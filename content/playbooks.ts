// Four playbook categories (spec Part 6.7). Play names + subtitles are from the spec verbatim.
// Full per-play descriptions / "when it applies" / "what you get" are [[LAURA to review]] — Part 6.7.

export const playbooksIntro = {
  eyebrow: "PLAYBOOKS",
  h1: "A play for every inflection point.",
  lead:
    "The work falls into four kinds. Every play below is something we have run inside a real business — not a framework, a play. Growth, systems, turnaround, owner and exit.",
  reviewNote:
    "[[Laura to review and correct every play — these are drafted from your existing six plus the three categories you had named but not built.]]",
};

export type Play = { name: string; subtitle: string };
export type PlaybookCategory = {
  slug: string;
  name: string;
  tagline: string;
  home: { line: string; examples: string[] }; // used by the homepage "four kinds" cards
  plays: Play[];
};

export const playbookCategories: PlaybookCategory[] = [
  {
    slug: "growth",
    name: "Growth",
    tagline: "Grow on purpose, not by accident — with the offer and the customers you already have.",
    home: {
      line: "Grow on what already works before betting on what doesn't.",
      examples: ["Au Naturel", "Big Foot", "Strategic Reset"],
    },
    plays: [
      { name: "Au Naturel", subtitle: "Grow with what already works" },
      { name: "Channel Expansion", subtitle: "New channels, proven offer" },
      { name: "New Revenue Hotline", subtitle: "Complementary lines for the customers you already have" },
      { name: "Big Foot", subtitle: "Expand the footprint" },
      { name: "Parallel Partners", subtitle: "Same customer, not a competitor" },
      { name: "Strategic Reset", subtitle: "Realign the business around what it's actually for" },
    ],
  },
  {
    slug: "systems",
    name: "Systems",
    tagline: "One set of numbers everyone trusts, and the layer underneath the owner.",
    home: {
      line: "Install the numbers, the scoreboard and the bench so it runs without you.",
      examples: ["Single Source of Truth", "The Scoreboard", "Handover"],
    },
    plays: [
      { name: "Single Source of Truth", subtitle: "One set of numbers everybody trusts" },
      { name: "The Scoreboard", subtitle: "The five to seven numbers that run the business, weekly" },
      { name: "Handover", subtitle: "Document and delegate the owner's job" },
      { name: "Unit Economics Teardown", subtitle: "What one unit, customer or job actually makes" },
      { name: "The Bench", subtitle: "Build the layer underneath you" },
      { name: "Fewer, Connected", subtitle: "Rationalize the stack so the systems talk" },
    ],
  },
  {
    slug: "turnaround",
    name: "Turnaround",
    tagline: "Cash first, stabilize, then decide what to stop.",
    home: {
      line: "Stabilize the cash, cut to the core, rebuild trust in that order.",
      examples: ["Cash First", "Cut to the Core", "Unit Triage"],
    },
    plays: [
      { name: "Cash First", subtitle: "Stabilise cash and buy time" },
      { name: "Cut to the Core", subtitle: "Decide what to stop" },
      { name: "Renegotiate", subtitle: "Suppliers, leases, terms" },
      { name: "The Front Door", subtitle: "Pricing and margin, fixed at the source" },
      { name: "Unit Triage", subtitle: "Close, fix or convert — unit by unit" },
      { name: "Trust Rebuild", subtitle: "Lenders, franchisees and staff, in that order" },
    ],
  },
  {
    slug: "owner-and-exit",
    name: "Owner & Exit",
    tagline: "Built so it could be sold — whether or not you sell it.",
    home: {
      line: "Get the owner out of the day-to-day and the business ready to stand alone.",
      examples: ["Sellable", "Take Back the Calendar", "Succession"],
    },
    plays: [
      { name: "Sellable", subtitle: "Built so it could be sold, whether or not you sell it" },
      { name: "Take Back the Calendar", subtitle: "Get the owner out of the day-to-day" },
      { name: "Succession", subtitle: "Who runs it next, and how they learn to" },
      { name: "Right-Sized", subtitle: "Decide you're big enough, on purpose" },
      { name: "Partner Alignment", subtitle: "Get the owners agreeing on the same future" },
    ],
  },
];

export function getCategory(slug: string) {
  return playbookCategories.find((c) => c.slug === slug);
}
