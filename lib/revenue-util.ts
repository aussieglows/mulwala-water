import "server-only";
import { db } from "@/lib/db";

/** The catch-all source used for auto-imported revenue we couldn't match to a client. */
export async function findOrCreateUnassignedSource(): Promise<string> {
  const existing = await db.revenueSource.findFirst({ where: { name: "Unassigned" } });
  if (existing) return existing.id;
  const max = await db.revenueSource.aggregate({ _max: { sortOrder: true } });
  const created = await db.revenueSource.create({ data: { name: "Unassigned", kind: "OTHER", sortOrder: (max._max.sortOrder ?? 0) + 1 } });
  return created.id;
}

/** The source used for investment income (first INVESTMENT-kind source, else Unassigned). */
export async function findInvestmentSourceId(): Promise<string> {
  const inv = await db.revenueSource.findFirst({ where: { kind: "INVESTMENT", active: true }, orderBy: { sortOrder: "asc" } });
  return inv ? inv.id : findOrCreateUnassignedSource();
}
