import prismadb from "@/lib/prismadb";
import React from "react";
import { CategoryForm } from "./components/category-form";

export default async function categoryPage({
  params,
}: Readonly<{
  params: Promise<{ categoryId: string; storeId: string }>;
}>) {
  // Await params to ensure it's resolved before usage
  const { categoryId } = await params;
  const { storeId } = await params;
  if (!categoryId) {
    throw new Error("Billboard ID is missing in the route parameters.");
  }

  const category = await prismadb.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: storeId,
    },
  });
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  );
}
