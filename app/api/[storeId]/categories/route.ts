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

    const { name, billboardId } = body;
    const { storeId } = await params; // Await the params promise

    if (!userId) {
      return new NextResponse("unauthenticated", { status: 481 });
    }
    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse("billboardId id is required", { status: 400 });
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

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
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

    const categories = await prismadb.category.findMany({
      where: {
        storeId: storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
