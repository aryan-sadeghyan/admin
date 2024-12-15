import prismadb from "@/lib/prismadb";
import React from "react";
import { ProductForm } from "./components/product-form";

export default async function ProductPage({
  params,
}: Readonly<{
  params: Promise<{ productId: string; storeId: string }>;
}>) {
  // Await params to ensure it's resolved before usage
  const { productId, storeId } = await params;

  if (!productId) {
    throw new Error("Billboard ID is missing in the route parameters.");
  }

  const product = await prismadb.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      images: true,
    },
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: storeId,
    },
  });
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: storeId,
    },
  });
  const colors = await prismadb.color.findMany({
    where: {
      storeId: storeId,
    },
  });

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductForm
          categories={categories}
          colors={colors}
          sizes={sizes}
          initialData={product}
        />
      </div>
    </div>
  );
}
