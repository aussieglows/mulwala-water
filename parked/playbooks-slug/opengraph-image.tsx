import { renderOG, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { playbookCategories, getCategory } from "@/content/playbooks";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Playbooks — Mulwala Water";

export function generateStaticParams() {
  return playbookCategories.map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCategory(slug);
  return renderOG({ eyebrow: `PLAYBOOKS · ${(c?.name ?? "").toUpperCase()}`, title: c?.tagline ?? "Playbooks" });
}
