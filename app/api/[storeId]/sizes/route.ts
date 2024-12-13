import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { Size } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: Readonly<{ params: Promise<{ storeId: string }> }>
) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const { name, value } = body;
    const { storeId } = await params; // Await the params promise

    if (!userId) {
      return new NextResponse("unauthenticated", { status: 481 });
    }
    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("value is required", { status: 400 });
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

    const size = await prismadb.size.create({
      data: {
        name,
        value,
        storeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZES_POST]", error);
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

    const sizes = await prismadb.size.findMany({
      where: {
        storeId: storeId,
      },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[SIZES_GET]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
