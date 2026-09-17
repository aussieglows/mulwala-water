"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function updateSettings(input: {
  businessName: string;
  currency: string;
  taxRatePercent: number;
  fiscalYearStartMonth: number;
}) {
  await requireAuth();
  const rate = Number.isFinite(input.taxRatePercent) ? Math.max(0, Math.min(60, input.taxRatePercent)) : 0;
  const fyStart = Math.max(1, Math.min(12, Math.round(input.fiscalYearStartMonth || 1)));
  await db.appSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", businessName: input.businessName.trim() || "Mulwala Water", currency: input.currency || "USD", taxRatePercent: rate, fiscalYearStartMonth: fyStart },
    update: { businessName: input.businessName.trim() || "Mulwala Water", currency: input.currency || "USD", taxRatePercent: rate, fiscalYearStartMonth: fyStart },
  });
  revalidatePath("/admin/settings");
  revalidatePath("/admin/pl");
}
