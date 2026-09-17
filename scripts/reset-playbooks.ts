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

// The real Growth plays from mulwalawater.com.
const plays: [string, string][] = [
  ["Au naturale", "Accelerate client growth with your current service offering by doubling down on your competitive advantage and using channels proven to work."],
  ["Same, same, but different", "Open new channels to win new clients — install a referral program with existing clients and offer the same product that's already proven."],
  ["New revenue hotline", "Add complementary product and service lines for your existing passionate followers (horizontal and vertical integration opportunities)."],
  ["Big Foot", "Expand your footprint geographically, or target new corollary versions of your successful channels and partnerships."],
  ["Parallel Partners", "Partner with contemporaries who share your target market but aren't competitors — a win-win for both."],
  ["Strategic Reset", "When you're hyper-focused on the day-to-day, the big picture can get lost. A strategic reset realigns the organization around your mission."],
];

async function main() {
  await db.playbook.deleteMany({});
  for (let i = 0; i < plays.length; i++) {
    await db.playbook.create({ data: { title: plays[i][0], summary: plays[i][1], category: "Growth", sortOrder: i + 1, active: true } });
  }
  await db.siteSettings.update({
    where: { id: "singleton" },
    data: {
      playbooksHeading: "Playbooks",
      playbooksIntro: "Whatever business you're in, versions of the same problem arise — with the same decision model and solutions to achieve your objectives. We call these playbooks. We tailor the right play to each situation, across four broad categories: growth, systems, turnaround and lifestyle.",
      portfolioHeading: "Portfolio & Advisory Companies",
      portfolioIntro: "The businesses we partner with, invest in, and advise.",
    },
  });
  console.log("Playbooks reset:", plays.length, "growth plays; intros updated.");
}
main().finally(() => db.$disconnect());
