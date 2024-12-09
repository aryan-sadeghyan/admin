import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

import { SettingsForm } from "./components/settings-form";

interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

const SettingsPage = async ({ params }: SettingsPageProps) => {
  const { userId } = await auth();
  const resolvedParams = await params;
  if (!userId) {
    redirect("/");
  }

  // Ensure `params` is awaited properly
  const store = await prismadb.store.findFirst({
    where: {
      id: resolvedParams.storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/"); // Redirect if store is not found
  }

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
