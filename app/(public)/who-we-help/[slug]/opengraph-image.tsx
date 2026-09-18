import { renderOG, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { doors, getDoor } from "@/content/whoWeHelp";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Who we help — Mulwala Water";

export function generateStaticParams() {
  return doors.map((d) => ({ slug: d.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDoor(slug);
  return renderOG({ eyebrow: d?.eyebrow ?? "WHO WE HELP", title: d?.h1 ?? "Who we help" });
}
