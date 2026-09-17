import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import path from "node:path";
const raw = process.env.DATABASE_URL || "file:./dev.db";
const db = new PrismaClient({ adapter: raw.startsWith("postgres") ? new PrismaPg({ connectionString: raw }) : new PrismaBetterSqlite3({ url: `file:${path.resolve(process.cwd(), raw.replace(/^file:/, ""))}` }) });

async function main() {
  await db.siteSettings.update({
    where: { id: "singleton" },
    data: {
      visionBody: "Our passion is small and medium business. Our vision is to help founders and executive teams thrive during their biggest challenges — providing the tools, insight and expertise typically only available to big business.",
      approachTagline: "Data drives decision, people drive businesses.",
      approachBody: 'We’re all about relationships, and we start with the people first. Only by truly understanding your business and your goals can we help you thrive. Data-driven processes are extremely powerful tools — but they come in only after the “why” is understood.',
      aboutPageTitle: "About Us",
      storyHeading: "Our Story",
      storyBody: "As a public-company COO, our founder wanted to help founder-led businesses — giving them access to the strategy and expertise typically only available to big business. Conversely, the scale and red tape that came with big business was suffocating. Mulwala Water was born.",
      historyHeading: "Our History — what’s in a name?",
      historyBody: "Mulwala — a tiny town in regional Australia with the purest drinking water on earth — just so happens to be where our founder grew up. There’s more to this story, and we’ll tell you in person…",
      missionHeading: "Our Mission",
      missionBody: "Our mission is to bridge the gap to the resources of large companies while providing nimble, personal advice and insights that can be actioned immediately and deliver enduring results. This continues to drive us every day.",
    },
  });
  console.log("Copy updated to match the original site.");
}
main().finally(() => db.$disconnect());
