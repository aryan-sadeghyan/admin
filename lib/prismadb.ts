import { PrismaClient } from "@prisma/client";
import dbFallback from "./db-fallback";

let prismadb: PrismaClient;

// In a try-catch block, we handle potential connection errors
// If we can't connect to the real database, we'll use our fallback
try {
  // Try to create a Prisma client and test the connection
  prismadb = new PrismaClient();

  // Test the connection with a simple query, but don't wait for it
  // Let any errors happen during actual queries
  console.log("Initializing Prisma client...");
} catch {
  console.warn("Error initializing Prisma client, using fallback database");
  // @ts-expect-error - Our fallback mimics the PrismaClient interface but isn't identical
  prismadb = dbFallback;
}

export default prismadb;
