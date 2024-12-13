import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: Readonly<{ params: Promise<{ sizeId: string }> }>
) {
  try {
    const { sizeId } = await params; // Await the params promise

    if (!sizeId) {
      return new NextResponse("size id is required", { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: Readonly<{ params: Promise<{ storeId: string; sizeId: string }> }>
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, value } = body;
    const { storeId, sizeId } = await params; // Await the params promise

    if (!userId) {
      return new NextResponse("unauthorized", { status: 401 });
    }
    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("value is required", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("size id is required", { status: 400 });
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

    const size = await prismadb.size.updateMany({
      where: {
        id: sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: Readonly<{ params: Promise<{ storeId: string; sizeId: string }> }>
) {
  try {
    const { userId } = await auth();
    const { storeId, sizeId } = await params; // Await the params promise

    if (!userId) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    if (!sizeId) {
      return new NextResponse("size id is required", { status: 400 });
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

    const size = await prismadb.size.deleteMany({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
