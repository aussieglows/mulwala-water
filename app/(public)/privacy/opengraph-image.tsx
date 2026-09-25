import { renderOG, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Privacy — Mulwala Water";

export default function Image() {
  return renderOG({ eyebrow: "PRIVACY", title: "How we handle what you share." });
}
