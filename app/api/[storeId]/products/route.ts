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

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;
    const { storeId } = await params; // Await the params promise

    if (!userId) {
      return new NextResponse("unauthenticated", { status: 481 });
    }
    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }
    if (!price) {
      return new NextResponse("price is required", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("categoryId is required", { status: 400 });
    }
    if (!colorId) {
      return new NextResponse("colorId is required", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("sizeId is required", { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse("images are required", {
        status: 400,
      });
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

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        sizeId,
        colorId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },

        storeId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: Readonly<{ params: Promise<{ storeId: string }> }>
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured") || undefined;

    const { storeId } = await params; // Await the params promise

    if (!storeId) {
      return new NextResponse("storeId is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: {
          select: {
            url: true, // Ensure only the URL is returned from images
          },
        },
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
