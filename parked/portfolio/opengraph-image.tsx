import { renderOG, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Portfolio & advisory companies — Mulwala Water";

export default function Image() {
  return renderOG({ eyebrow: "PORTFOLIO & ADVISORY", title: "Companies we've backed, advised and operated." });
}
