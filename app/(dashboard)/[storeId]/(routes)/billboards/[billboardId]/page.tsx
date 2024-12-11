import prismadb from "@/lib/prismadb";
import React from "react";
import { BillboardForm } from "./components/billboard-form";

export default async function BillboardsPage({
  params,
}: Readonly<{
  params: Promise<{ billboardId: string }>;
}>) {
  // Await params to ensure it's resolved before usage
  const { billboardId } = await params;

  if (!billboardId) {
    throw new Error("Billboard ID is missing in the route parameters.");
  }

  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: billboardId,
    },
  });

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
}
