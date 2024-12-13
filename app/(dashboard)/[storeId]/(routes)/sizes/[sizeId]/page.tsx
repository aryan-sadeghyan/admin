import prismadb from "@/lib/prismadb";
import React from "react";
import { SizeForm } from "./components/size-form";

export default async function SizePage({
  params,
}: Readonly<{
  params: Promise<{ sizeId: string }>;
}>) {
  // Await params to ensure it's resolved before usage
  const { sizeId } = await params;

  if (!sizeId) {
    throw new Error("Billboard ID is missing in the route parameters.");
  }

  const sizes = await prismadb.size.findUnique({
    where: {
      id: sizeId,
    },
  });

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SizeForm initialData={sizes} />
      </div>
    </div>
  );
}
