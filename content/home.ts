// Homepage copy, section by section (spec Part 6.5).

import type { Metric } from "@/components/site/bands";

export const home = {
  hero: {
    eyebrow: "ADVISORY · OPERATING · INVESTMENT",
    h1: "We advise, operate, and invest.",
    lead:
      "Three ways to work with us: a plan you can act on, a senior operator who steps in and runs it, or capital alongside you. Big-company discipline for founder-led, family-owned, sponsor-backed and multi-unit businesses — from people who have actually done the job, in Australia and America.",
  },

  // The three ways to work with us (added per Laura: advisory, operating, and investment).
  modes: {
    h2: "Three ways to work with us.",
    items: [
      {
        title: "Advise",
        line: "A plan you can act on. A senior operator reads the business, tells you what's actually holding it back, and hands you the three things to do first — with owners and dates.",
      },
      {
        title: "Operate",
        line: "Someone in the seat. When advice isn't enough, we step in — COO, GM, or a defined mandate — run the play, and write a leaving date into the scope before we start.",
      },
      {
        title: "Invest",
        line: "Capital alongside you. Where it fits, we back the businesses we believe in as well as advise them — so our incentives sit with yours.",
      },
    ],
  },

  // Section 2 — portfolio-level aggregates avoid confidentiality problems. Real numbers are Laura's (Part 10).
  metrics: [
    { value: "20+", label: "years in operating seats" },
    { value: "50+", label: "businesses backed, advised or operated" },
    { value: "$5B+", label: "revenue run through" },
    { value: "2", label: "continents" },
  ] as Metric[],

  doors: {
    h2: "Where we're useful.",
    items: [
      { title: "Founder-led businesses", line: "You built it. It shouldn't depend on you to run it.", href: "/who-we-help/founder-led" },
      { title: "Family-owned businesses", line: "Everyone owns a piece. Nobody owns the decision.", href: "/who-we-help/family-owned" },
      { title: "Sponsor-backed companies", line: "The underwriting case doesn't care how busy the team is.", href: "/who-we-help/private-equity" },
      { title: "Franchise & multi-unit", line: "Units open is not the same number as units working.", href: "/who-we-help/franchise" },
    ],
  },

  approach: {
    h2: "Data drives decision. People drive businesses.",
    body:
      "We start with the people, because you cannot fix a business you do not understand, and you cannot understand one without understanding who runs it and why they do it that way. Then the numbers come in — and they come in hard. Both halves matter, whether we're advising you or running it ourselves.",
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
