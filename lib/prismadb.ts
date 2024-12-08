import { PrismaClient } from "@prisma/client";

// Check if globalThis.prisma is already defined; if so, use it.
const prismadb = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prismadb;
}

export default prismadb;
