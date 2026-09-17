import path from "node:path";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Choose the driver adapter from DATABASE_URL: Postgres in the cloud (Vercel/Neon), SQLite locally.
function makeAdapter() {
  const raw = process.env.DATABASE_URL || "file:./dev.db";
  if (raw.startsWith("postgres")) {
    return new PrismaPg({ connectionString: raw });
  }
  const p = raw.replace(/^file:/, "");
  const abs = path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
  return new PrismaBetterSqlite3({ url: `file:${abs}` });
}

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter: makeAdapter() });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
