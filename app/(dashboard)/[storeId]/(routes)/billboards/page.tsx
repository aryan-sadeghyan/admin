import React from "react";
import { BillboardsClient } from "./components/client";
import prismadb from "@/lib/prismadb";

import { format } from "date-fns";
import { BillboardColumn } from "./components/columns";

export default async function BillboardsPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMM do, yyyy"),
  }));

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardsClient data={formattedBillboards} />
      </div>
    </div>
  );
}
