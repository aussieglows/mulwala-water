import { renderOG, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { home } from "@/content/home";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Mulwala Water — We take the seat, not the sidelines.";

export default function Image() {
  return renderOG({ eyebrow: home.hero.eyebrow, title: home.hero.h1 });
}
