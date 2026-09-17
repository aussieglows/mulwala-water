"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function markMessageRead(id: string, read: boolean) {
  await requireAuth();
  await db.contactMessage.update({ where: { id }, data: { read } });
  revalidatePath("/admin/inbox");
  revalidatePath("/admin");
}

export async function deleteMessage(id: string) {
  await requireAuth();
  await db.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/inbox");
  revalidatePath("/admin");
}

export async function deleteSignup(id: string) {
  await requireAuth();
  await db.newsletterSignup.delete({ where: { id } });
  revalidatePath("/admin/inbox");
}
