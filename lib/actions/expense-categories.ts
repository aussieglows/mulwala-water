"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

function bump() {
  revalidatePath("/admin/sources");
  revalidatePath("/admin/expenses");
  revalidatePath("/admin/pl");
}

export async function addExpenseCategory(name: string) {
  await requireAuth();
  const n = name.trim();
  if (!n) throw new Error("Name is required.");
  const existing = await db.expenseCategory.findUnique({ where: { name: n } });
  if (existing) throw new Error("That category already exists.");
  const max = await db.expenseCategory.aggregate({ _max: { sortOrder: true } });
  await db.expenseCategory.create({ data: { name: n, sortOrder: (max._max.sortOrder ?? 0) + 1 } });
  bump();
}

export async function updateExpenseCategory(input: { id: string; name: string; active: boolean }) {
  await requireAuth();
  const n = input.name.trim();
  if (!n) throw new Error("Name is required.");
  await db.expenseCategory.update({ where: { id: input.id }, data: { name: n, active: input.active } });
  bump();
}

/** Delete a category. Blocked if any expense still uses it (deactivate instead). */
export async function deleteExpenseCategory(id: string) {
  await requireAuth();
  const cat = await db.expenseCategory.findUnique({ where: { id } });
  if (!cat) return;
  const count = await db.expense.count({ where: { category: cat.name } });
  if (count > 0) throw new Error(`${count} expense${count === 1 ? "" : "s"} use "${cat.name}". Deactivate it instead, or recategorize those first.`);
  await db.expenseCategory.delete({ where: { id } });
  bump();
}

export async function reorderExpenseCategory(id: string, direction: "up" | "down") {
  await requireAuth();
  const all = await db.expenseCategory.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
  const i = all.findIndex((c) => c.id === id);
  if (i < 0) return;
  const j = direction === "up" ? i - 1 : i + 1;
  if (j < 0 || j >= all.length) return;
  await db.$transaction([
    db.expenseCategory.update({ where: { id: all[i].id }, data: { sortOrder: j } }),
    db.expenseCategory.update({ where: { id: all[j].id }, data: { sortOrder: i } }),
  ]);
  bump();
}
