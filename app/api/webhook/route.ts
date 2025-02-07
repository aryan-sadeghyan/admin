import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature");

  if (!signature) {
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Webhook error:", error.message);
      return new NextResponse(`Webhook error: ${error.message}`, {
        status: 400,
      });
    }

    console.error("Unknown webhook error:", error);
    return new NextResponse("Unknown webhook error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (!session.metadata?.orderId) {
      console.error("Missing order ID in session metadata", session);
      return new NextResponse("Missing order ID in metadata", { status: 400 });
    }

    const address = session.customer_details?.address;
    const addressString = [
      address?.line1,
      address?.line2,
      address?.city,
      address?.state,
      address?.postal_code,
      address?.country,
    ]
      .filter(Boolean)
      .join(", ");

    try {
      const order = await prismadb.order.update({
        where: { id: session.metadata.orderId },
        data: {
          isPaid: true,
          address: addressString,
          phone: session.customer_details?.phone || "",
        },
        include: { orderItems: true },
      });

      const productIds = order.orderItems.map(
        (orderItem) => orderItem.productId
      );

      await prismadb.product.updateMany({
        where: { id: { in: productIds } },
        data: { isArchived: true },
      });

      return new NextResponse(null, { status: 200 });
    } catch (error) {
      console.error("Database error:", error);
      return new NextResponse("Database update failed", { status: 500 });
    }
  }

  return new NextResponse("Unhandled event type", { status: 400 });
}
