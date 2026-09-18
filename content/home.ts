// Homepage copy, section by section (spec Part 6.5).

import type { Metric } from "@/components/site/bands";

export const home = {
  hero: {
    eyebrow: "OPERATING & INVESTMENT",
    h1: "We take the seat, not the sidelines.",
    lead:
      "Hands-on operating help for founder-led, sponsor-backed and multi-unit businesses at the point where the next stage needs a different playbook. Big-company discipline, run by people who have actually done the job — in Australia and America.",
  },

  // Section 2 — portfolio-level aggregates avoid confidentiality problems. Real numbers are Laura's (Part 10).
  metrics: [
    { value: "[[X]]", label: "years in operating seats" },
    { value: "[[X]]", label: "businesses backed, advised or operated" },
    { value: "[[$X]]M+", label: "revenue run through" },
    { value: "2", label: "continents" },
  ] as Metric[],

  doors: {
    h2: "Where we're useful.",
    items: [
      { title: "Founder-led businesses", line: "You built it. It shouldn't depend on you to run it.", href: "/who-we-help/founder-led" },
      { title: "Sponsor-backed companies", line: "The underwriting case doesn't care how busy the team is.", href: "/who-we-help/private-equity" },
      { title: "Franchise & multi-unit", line: "Units open is not the same number as units working.", href: "/who-we-help/franchise" },
    ],
  },

  approach: {
    h2: "Data drives decision. People drive businesses.",
    body:
      "We start with the people, because you cannot fix a business you do not understand, and you cannot understand one without understanding who runs it and why they do it that way. Then the numbers come in — and they come in hard. Both halves matter. Firms that only do the second half write good documents that nobody implements.",
  },

  whatWeDo: {
    h2: "The work falls into four kinds.",
  },

  proof: {
    h2: "What it looks like when it works.",
    placeholder: "[[LAURA: needs 2–3 case studies, Part 10]]",
  },

  phasesBrief: {
    h2: "How we work, in brief.",
    cta: { label: "See how we work", href: "/how-we-work" },
  },

  portfolioStrip: {
    h2: "Companies we've backed, advised and operated.",
    cta: { label: "See the portfolio", href: "/portfolio" },
  },

  closing: {
    heading: "Tell us what's actually going on.",
    body: "Twenty minutes, no deck. If it's not a problem we're good at, we'll say so and point you somewhere better.",
  },
};
