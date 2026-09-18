import { renderOG, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { howWeWork } from "@/content/howWeWork";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "How we work — Mulwala Water";

export default function Image() {
  return renderOG({ eyebrow: howWeWork.eyebrow, title: howWeWork.h1 });
}
