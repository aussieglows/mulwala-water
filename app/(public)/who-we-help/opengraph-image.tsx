import { renderOG, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Who we help — Mulwala Water";

export default function Image() {
  return renderOG({ eyebrow: "WHO WE HELP", title: "Three kinds of business. One way of working." });
}
