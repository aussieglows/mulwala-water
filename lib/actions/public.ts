"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Public contact form. Saves a message to the admin inbox. No auth (public endpoint). */
export async function submitContact(_prev: { ok?: boolean; error?: string } | undefined, formData: FormData): Promise<{ ok?: boolean; error?: string }> {
  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  const email = String(formData.get("email") ?? "").trim().slice(0, 200);
  const message = String(formData.get("message") ?? "").trim().slice(0, 5000);
  // Honeypot: bots fill hidden fields. If present, silently accept without saving.
  if (String(formData.get("company") ?? "").trim()) return { ok: true };
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };
  await db.contactMessage.create({ data: { name: name || null, email, message: message || null } });
  revalidatePath("/admin/inbox");
  return { ok: true };
}

/** Public newsletter sign-up. Saves an email to the admin inbox (idempotent on the address). */
export async function subscribeNewsletter(_prev: { ok?: boolean; error?: string } | undefined, formData: FormData): Promise<{ ok?: boolean; error?: string }> {
  const email = String(formData.get("email") ?? "").trim().slice(0, 200);
  if (String(formData.get("company") ?? "").trim()) return { ok: true }; // honeypot
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };
  await db.newsletterSignup.upsert({ where: { email }, create: { email }, update: {} });
  revalidatePath("/admin/inbox");
  return { ok: true };
}
