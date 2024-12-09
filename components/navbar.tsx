import { UserButton } from "@clerk/nextjs";
import React from "react";
import MainNav from "@/components/main-nav";
import { StoreSwitcher } from "./store-switcher";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Navbar() {
  const { userId } = await auth(); // Await the promise and destructure userId.

  if (!userId) {
    redirect("/sign-in"); // Redirect if no userId is found.
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId, // This now correctly uses the resolved userId.
    },
  });

  return (
    <div className='border-b'>
      <div className='flex items-center h-16 px-4'>
        <StoreSwitcher items={stores} />
        <MainNav className='mx-6' />
        <div className='ml-auto flex items-center space-x-4'>
          <UserButton />
        </div>
      </div>
    </div>
  );
}
