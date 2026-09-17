import "server-only";
import { db } from "@/lib/db";

/** The editable public-site copy (creates the singleton on first read). */
export async function getSiteSettings() {
  return (
    (await db.siteSettings.findUnique({ where: { id: "singleton" } })) ??
    (await db.siteSettings.create({ data: { id: "singleton" } }))
  );
}

export async function getActiveExpertise() {
  return db.expertisePoint.findMany({ where: { active: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
}

export async function getActivePlaybooks() {
  return db.playbook.findMany({ where: { active: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
}

export async function getActivePortfolio() {
  return db.portfolioCompany.findMany({ where: { active: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
}
