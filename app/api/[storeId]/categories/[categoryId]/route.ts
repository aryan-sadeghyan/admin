import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: Readonly<{ params: Promise<{ categoryId: string }> }>
) {
  try {
    const { categoryId } = await params; // Await the params promise

    if (!categoryId) {
      return new NextResponse("billboard id is required", { status: 400 });
    }

    const category = await prismadb.billboard.findUnique({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: Readonly<{ params: Promise<{ storeId: string; categoryId: string }> }>
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, billboardId } = body;
    const { storeId, categoryId } = await params; // Await the params promise

    if (!userId) {
      return new NextResponse("unauthorized", { status: 401 });
    }
    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse("billboard id is required", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("category id is required", { status: 400 });
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

    const category = await prismadb.category.updateMany({
      where: {
        id: categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: Readonly<{ params: Promise<{ storeId: string; categoryId: string }> }>
) {
  try {
    const { userId } = await auth();
    const { storeId, categoryId } = await params; // Await the params promise

    if (!userId) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    if (!categoryId) {
      return new NextResponse("category id is required", { status: 400 });
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

    const category = await prismadb.category.deleteMany({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
