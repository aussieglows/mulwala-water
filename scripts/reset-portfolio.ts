import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import path from "node:path";

const raw = process.env.DATABASE_URL || "file:./dev.db";
function makeAdapter() {
  if (raw.startsWith("postgres")) return new PrismaPg({ connectionString: raw });
  const rel = raw.replace(/^file:/, "");
  const abs = path.isAbsolute(rel) ? rel : path.resolve(process.cwd(), rel);
  return new PrismaBetterSqlite3({ url: `file:${abs}` });
}
const db = new PrismaClient({ adapter: makeAdapter() });

// name, short descriptor (editable in admin), logo path is added once the logo files are supplied.
const companies: [string, string][] = [
  ["F45", "Functional-fitness franchise"],
  ["Noom", "Digital health platform"],
  ["Iris Energy", "Data centres & digital infrastructure"],
  ["Tifi", ""],
  ["Dixon Projects", "Design & construction"],
  ["Evans and Partners", "Investment & advisory"],
  ["aussie glows", "Mobile spray-tan studio"],
  ["Donavan Realty and Development", "Real estate & development"],
];

async function main() {
  await db.portfolioCompany.deleteMany({});
  for (let i = 0; i < companies.length; i++) {
    await db.portfolioCompany.create({ data: { name: companies[i][0], description: companies[i][1] || null, sortOrder: i + 1, active: true } });
  }
  console.log("Portfolio reset:", companies.length, "companies.");
}
main().finally(() => db.$disconnect());
