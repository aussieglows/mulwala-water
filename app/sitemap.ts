import type { MetadataRoute } from "next";
import { doors } from "@/content/whoWeHelp";

const BASE = "https://www.mulwalawater.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // /results, /portfolio and the individual /playbooks/[slug] pages are parked for launch.
  const routes = [
    "/",
    "/how-we-work",
    "/playbooks",
    "/insights",
    "/about",
    "/contact",
    "/privacy",
    ...doors.map((d) => `/who-we-help/${d.slug}`),
  ];
  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : path === "/how-we-work" ? 0.9 : 0.7,
  }));
}
