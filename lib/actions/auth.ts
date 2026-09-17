"use server";

import { redirect } from "next/navigation";
import { checkPasscode, createSession, clearSession } from "@/lib/auth";

export async function login(_prev: { error?: string } | undefined, formData: FormData): Promise<{ error?: string }> {
  const passcode = String(formData.get("passcode") ?? "");
  if (!checkPasscode(passcode)) {
    return { error: "Incorrect passcode." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await clearSession();
  redirect("/admin/login");
}
