import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import { EXPENSE_CATEGORIES } from "../lib/categories";
import path from "node:path";

// SQLite locally, Postgres in the cloud (matches lib/db.ts).
const raw = process.env.DATABASE_URL || "file:./dev.db";
function makeAdapter() {
  if (raw.startsWith("postgres")) return new PrismaPg({ connectionString: raw });
  const rel = raw.replace(/^file:/, "");
  const abs = path.isAbsolute(rel) ? rel : path.resolve(process.cwd(), rel);
  return new PrismaBetterSqlite3({ url: `file:${abs}` });
}
const db = new PrismaClient({ adapter: makeAdapter() });

async function main() {
  await db.appSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", businessName: "Mulwala Water", currency: "USD", taxRatePercent: 0, fiscalYearStartMonth: 1 },
    update: {},
  });

  // Expense categories (editable; seed once, then managed in the admin). Adds any missing defaults
  // so existing installs pick up newly-added defaults (e.g. Salaries & wages) without duplicating.
  for (let i = 0; i < EXPENSE_CATEGORIES.length; i++) {
    const name = EXPENSE_CATEGORIES[i];
    const existing = await db.expenseCategory.findUnique({ where: { name } });
    if (!existing) await db.expenseCategory.create({ data: { name, sortOrder: i + 1 } });
  }
  console.log(`  = expense categories ensured (${EXPENSE_CATEGORIES.length})`);

  // Public site content (leaves existing edits alone — only creates if missing).
  await db.siteSettings.upsert({ where: { id: "singleton" }, create: { id: "singleton" }, update: {} });

  const expertise = [
    "Client growth by leveraging your competitive advantage",
    "Opening new channels to win business",
    "New complementary revenue streams that enhance value to clients",
    "Expansion into new markets",
    "Turnaround situations",
  ];
  if ((await db.expertisePoint.count()) === 0) {
    for (let i = 0; i < expertise.length; i++) await db.expertisePoint.create({ data: { text: expertise[i], sortOrder: i + 1 } });
    console.log(`  + ${expertise.length} expertise points`);
  }

  if ((await db.playbook.count()) === 0) {
    const playbooks = [
      { title: "Go-to-Market Acceleration", summary: "Sharpen positioning, open new channels, and build a repeatable engine to win business faster." },
      { title: "Revenue Stream Design", summary: "Identify and launch complementary revenue streams that deepen client value and margins." },
      { title: "Market Expansion", summary: "A data-led path into new markets and segments, de-risked stage by stage." },
      { title: "Turnaround & Stabilization", summary: "Rapid diagnostics, decisive action, and a plan that returns the business to health." },
    ];
    for (let i = 0; i < playbooks.length; i++) await db.playbook.create({ data: { ...playbooks[i], sortOrder: i + 1 } });
    console.log(`  + ${playbooks.length} playbooks`);
  }

  if ((await db.portfolioCompany.count()) === 0) {
    const companies = [
      { name: "Parched Hospitality Group", description: "Hospitality group partner." },
    ];
    for (let i = 0; i < companies.length; i++) await db.portfolioCompany.create({ data: { ...companies[i], sortOrder: i + 1 } });
    console.log(`  + ${companies.length} portfolio companies`);
  }

  const sources = [
    { name: "Parched Hospitality Group", kind: "CLIENT", sortOrder: 1 },
    { name: "Romina Day", kind: "CLIENT", sortOrder: 2 },
    { name: "Investment Income", kind: "INVESTMENT", sortOrder: 3 },
  ];
  for (const s of sources) {
    const existing = await db.revenueSource.findFirst({ where: { name: s.name } });
    if (!existing) {
      await db.revenueSource.create({ data: s });
      console.log(`  + revenue source: ${s.name}`);
    } else {
      console.log(`  = revenue source already exists: ${s.name}`);
    }
  }
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
