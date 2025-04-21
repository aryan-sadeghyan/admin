import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}) {
  const { userId } = await auth();
  const resolvedParams = await params;

  if (!userId) {
    redirect("/");
  }
  const store = await prismadb.store.findFirst({
    where: {
      id: resolvedParams.storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className='flex min-h-screen flex-col bg-background'>
      <Navbar />
      <main className='flex-1 container mx-auto px-6 py-8 animate-in'>
        {children}
      </main>
      <footer className='py-4 text-center text-sm text-muted-foreground border-t'>
        <p>
          © {new Date().getFullYear()} Admin Dashboard. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
