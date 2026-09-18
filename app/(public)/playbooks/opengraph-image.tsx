import { renderOG, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { playbooksIntro } from "@/content/playbooks";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Playbooks — Mulwala Water";

export default function Image() {
  return renderOG({ eyebrow: playbooksIntro.eyebrow, title: playbooksIntro.h1 });
}
