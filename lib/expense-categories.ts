import "server-only";
import { db } from "@/lib/db";
import { EXPENSE_CATEGORIES } from "@/lib/categories";

/** Active expense category names, ordered. Falls back to the built-in defaults if the table is empty. */
export async function getActiveExpenseCategoryNames(): Promise<string[]> {
  const rows = await db.expenseCategory.findMany({ where: { active: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
  return rows.length ? rows.map((r) => r.name) : [...EXPENSE_CATEGORIES];
}

/** All expense categories (incl. inactive), for the admin manager. */
export async function getAllExpenseCategories() {
  return db.expenseCategory.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
}
