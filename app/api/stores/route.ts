import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const { name } = body;
    if (!userId) {
      return new NextResponse("unauthorized", { status: 481 });
    }
    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });
    return new NextResponse(JSON.stringify(store), { status: 201 });
  } catch (error) {
    console.log("[stores_post]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
