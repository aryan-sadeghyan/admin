import React from "react";
import { SizeClient } from "./components/client";
import prismadb from "@/lib/prismadb";

import { format } from "date-fns";
import { SizeColumn } from "./components/columns";

export default async function SizesPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMM do, yyyy"),
  }));

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
}
