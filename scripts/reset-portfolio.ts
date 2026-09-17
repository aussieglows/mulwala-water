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

// name, short descriptor (editable in admin), logo path (empty = show the name until a logo is added).
const companies: [string, string, string][] = [
  ["F45", "Functional-fitness franchise", "/images/logos/f45.jpg"],
  ["Noom", "Digital health platform", "/images/logos/noom.jpg"],
  ["Iris Energy", "Data centres & digital infrastructure", "/images/logos/iris.png"],
  ["Tifi", "", "/images/logos/tifi.svg"],
  ["Dixon Projects", "Design & construction", "/images/logos/dixon.jpg"],
  ["Evans and Partners", "Investment & advisory", "/images/logos/evans-partners.svg"],
  ["aussie glows", "Mobile spray-tan studio", "/images/logos/aussie-glows.png"],
  ["Donavan Realty and Development", "Real estate & development", "/images/logos/donovan.jpg"],
];

async function main() {
  await db.portfolioCompany.deleteMany({});
  for (let i = 0; i < companies.length; i++) {
    await db.portfolioCompany.create({ data: { name: companies[i][0], description: companies[i][1] || null, logoUrl: companies[i][2] || null, sortOrder: i + 1, active: true } });
  }
  console.log("Portfolio reset:", companies.length, "companies (6 with logos).");
}
main().finally(() => db.$disconnect());
