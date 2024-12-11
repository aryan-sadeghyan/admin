import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: Readonly<{ params: Promise<{ storeId: string }> }>
) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const { label, imageUrl } = body;
    const { storeId } = await params; // Await the params promise

    if (!userId) {
      return new NextResponse("unauthenticated", { status: 481 });
    }
    if (!label) {
      return new NextResponse("label is required", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("image Url is required", { status: 400 });
    }
    if (!storeId) {
      return new NextResponse("storeId is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("unauthorized", { status: 403 });
    }

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: Readonly<{ params: Promise<{ storeId: string }> }>
) {
  try {
    const { storeId } = await params; // Await the params promise

    if (!storeId) {
      return new NextResponse("storeId is required", { status: 400 });
    }

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
