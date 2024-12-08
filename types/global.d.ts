// global.d.ts
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined; // Declares `prisma` as a global variable that can be assigned
}
