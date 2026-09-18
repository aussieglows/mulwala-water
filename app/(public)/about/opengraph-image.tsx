import { renderOG, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { about } from "@/content/about";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "About — Mulwala Water";

export default function Image() {
  return renderOG({ eyebrow: about.eyebrow, title: about.h1 });
}
