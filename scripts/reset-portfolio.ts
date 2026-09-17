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

// [name, descriptor (shown only when there's no logo), logoUrl, website]
const companies: [string, string, string, string][] = [
  ["F45", "Functional-fitness franchise", "/images/logos/f45.jpg", "https://f45training.com"],
  ["Noom", "Digital health platform", "/images/logos/noom.jpg", "https://www.noom.com"],
  ["Iris Energy", "Data centres & digital infrastructure", "/images/logos/iris.png", "https://irisenergy.co"],
  ["Tifi", "", "/images/logos/tifi.svg", ""],
  ["Dixon Projects", "Design & construction", "/images/logos/dixon.jpg", "https://www.dixon-projects.com"],
  ["Evans and Partners", "Investment & advisory", "/images/logos/evans-partners.svg", "https://www.evansandpartners.com.au"],
  ["aussie glows", "Mobile spray-tan studio", "/images/logos/aussie-glows.png", "https://www.aussieglows.com"],
  ["Donavan Realty and Development", "Real estate & development", "/images/logos/donovan.jpg", ""],
  ["Parched Hospitality Group", "Hospitality group", "/images/logos/phg.jpg", "https://parchedhg.com"],
  ["Romina Day", "", "", ""],
  ["Apex Wellness Group", "Health & wellness", "", ""],
  ["LODI enabled", "Supply-chain hardware & tech", "", "https://lodienabled.com"],
  ["Storyline", "", "", ""],
  ["OWNA", "Childcare management software", "", "https://owna.com.au"],
];

async function main() {
  await db.portfolioCompany.deleteMany({});
  for (let i = 0; i < companies.length; i++) {
    const [name, description, logoUrl, url] = companies[i];
    await db.portfolioCompany.create({ data: { name, description: description || null, logoUrl: logoUrl || null, url: url || null, sortOrder: i + 1, active: true } });
  }
  console.log(`Portfolio reset: ${companies.length} companies.`);
}
main().finally(() => db.$disconnect());
