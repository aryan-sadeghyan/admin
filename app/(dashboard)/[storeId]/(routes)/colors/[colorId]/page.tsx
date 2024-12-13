import prismadb from "@/lib/prismadb";
import React from "react";
import { ColorForm } from "./components/color-form";

export default async function ColorPage({
  params,
}: Readonly<{
  params: Promise<{ colorId: string }>;
}>) {
  // Await params to ensure it's resolved before usage
  const { colorId } = await params;

  if (!colorId) {
    throw new Error("color ID is missing in the route parameters.");
  }

  const color = await prismadb.color.findUnique({
    where: {
      id: colorId,
    },
  });

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ColorForm initialData={color} />
      </div>
    </div>
  );
}
