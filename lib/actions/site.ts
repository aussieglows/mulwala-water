"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

function bumpPublic() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/playbooks");
  revalidatePath("/portfolio-companies");
  revalidatePath("/admin/site");
}

export type SiteSettingsInput = {
  siteName: string;
  legalName: string;
  tagline: string;
  phone: string;
  email: string;
  heroHeadline: string;
  heroSubtext: string;
  ctaLabel: string;
  aboutHeading: string;
  visionHeading: string;
  visionBody: string;
  expertiseHeading: string;
  expertiseIntro: string;
  approachHeading: string;
  approachTagline: string;
  approachBody: string;
  founderName: string;
  founderTitle: string;
  founderBio: string;
  playbooksHeading: string;
  playbooksIntro: string;
  portfolioHeading: string;
  portfolioIntro: string;
  footerText: string;
};

export async function updateSiteSettings(input: SiteSettingsInput) {
  await requireAuth();
  const data = { ...input, siteName: input.siteName.trim() || "Mulwala Water" };
  await db.siteSettings.upsert({ where: { id: "singleton" }, create: { id: "singleton", ...data }, update: data });
  bumpPublic();
}

// --- Expertise points ---
export async function addExpertise(text: string) {
  await requireAuth();
  if (!text.trim()) return;
  const max = await db.expertisePoint.aggregate({ _max: { sortOrder: true } });
  await db.expertisePoint.create({ data: { text: text.trim(), sortOrder: (max._max.sortOrder ?? 0) + 1 } });
  bumpPublic();
}
export async function updateExpertise(id: string, text: string, active: boolean) {
  await requireAuth();
  await db.expertisePoint.update({ where: { id }, data: { text: text.trim(), active } });
  bumpPublic();
}
export async function deleteExpertise(id: string) {
  await requireAuth();
  await db.expertisePoint.delete({ where: { id } });
  bumpPublic();
}

// --- Playbooks ---
export async function addPlaybook(title: string, summary: string) {
  await requireAuth();
  if (!title.trim()) return;
  const max = await db.playbook.aggregate({ _max: { sortOrder: true } });
  await db.playbook.create({ data: { title: title.trim(), summary: summary.trim() || null, sortOrder: (max._max.sortOrder ?? 0) + 1 } });
  bumpPublic();
}
export async function updatePlaybook(id: string, title: string, summary: string, active: boolean) {
  await requireAuth();
  await db.playbook.update({ where: { id }, data: { title: title.trim(), summary: summary.trim() || null, active } });
  bumpPublic();
}
export async function deletePlaybook(id: string) {
  await requireAuth();
  await db.playbook.delete({ where: { id } });
  bumpPublic();
}

// --- Portfolio companies ---
export async function addPortfolio(name: string, description: string, url: string) {
  await requireAuth();
  if (!name.trim()) return;
  const max = await db.portfolioCompany.aggregate({ _max: { sortOrder: true } });
  await db.portfolioCompany.create({ data: { name: name.trim(), description: description.trim() || null, url: url.trim() || null, sortOrder: (max._max.sortOrder ?? 0) + 1 } });
  bumpPublic();
}
export async function updatePortfolio(id: string, name: string, description: string, url: string, active: boolean) {
  await requireAuth();
  await db.portfolioCompany.update({ where: { id }, data: { name: name.trim(), description: description.trim() || null, url: url.trim() || null, active } });
  bumpPublic();
}
export async function deletePortfolio(id: string) {
  await requireAuth();
  await db.portfolioCompany.delete({ where: { id } });
  bumpPublic();
}
