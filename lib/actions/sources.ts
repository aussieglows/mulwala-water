"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { SOURCE_KINDS } from "@/lib/categories";

export async function addSource(input: { name: string; kind: string }) {
  await requireAuth();
  const name = input.name.trim();
  if (!name) throw new Error("Name is required.");
  const kind = (SOURCE_KINDS as readonly string[]).includes(input.kind) ? input.kind : "CLIENT";
  const max = await db.revenueSource.aggregate({ _max: { sortOrder: true } });
  await db.revenueSource.create({ data: { name, kind, sortOrder: (max._max.sortOrder ?? 0) + 1 } });
  revalidatePath("/admin/sources");
  revalidatePath("/admin/revenue");
  revalidatePath("/admin/pl");
}

export async function updateSource(input: { id: string; name: string; kind: string; active: boolean }) {
  await requireAuth();
  const name = input.name.trim();
  if (!name) throw new Error("Name is required.");
  const kind = (SOURCE_KINDS as readonly string[]).includes(input.kind) ? input.kind : "CLIENT";
  await db.revenueSource.update({ where: { id: input.id }, data: { name, kind, active: input.active } });
  revalidatePath("/admin/sources");
  revalidatePath("/admin/revenue");
  revalidatePath("/admin/pl");
}

/** Delete a source. Blocked if it still has revenue entries (deactivate it instead). */
export async function deleteSource(id: string) {
  await requireAuth();
  const count = await db.revenueEntry.count({ where: { sourceId: id } });
  if (count > 0) throw new Error(`This source has ${count} revenue entr${count === 1 ? "y" : "ies"}. Deactivate it instead, or move those entries first.`);
  await db.revenueSource.delete({ where: { id } });
  revalidatePath("/admin/sources");
  revalidatePath("/admin/revenue");
  revalidatePath("/admin/pl");
}

export async function reorderSource(id: string, direction: "up" | "down") {
  await requireAuth();
  const all = await db.revenueSource.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  const i = all.findIndex((s) => s.id === id);
  if (i < 0) return;
  const j = direction === "up" ? i - 1 : i + 1;
  if (j < 0 || j >= all.length) return;
  await db.$transaction([
    db.revenueSource.update({ where: { id: all[i].id }, data: { sortOrder: j } }),
    db.revenueSource.update({ where: { id: all[j].id }, data: { sortOrder: i } }),
  ]);
  revalidatePath("/admin/sources");
  revalidatePath("/admin/revenue");
  revalidatePath("/admin/pl");
}
