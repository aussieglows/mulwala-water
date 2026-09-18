import type { MetadataRoute } from "next";
import { doors } from "@/content/whoWeHelp";
import { playbookCategories } from "@/content/playbooks";

const BASE = "https://www.mulwalawater.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "/",
    "/how-we-work",
    "/playbooks",
    "/results",
    "/portfolio",
    "/insights",
    "/about",
    "/contact",
    "/privacy",
    ...doors.map((d) => `/who-we-help/${d.slug}`),
    ...playbookCategories.map((c) => `/playbooks/${c.slug}`),
  ];
  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : path === "/how-we-work" ? 0.9 : 0.7,
  }));
}
