// The four doors (spec Part 4.2 + 6.6, plus family-owned). Vocabulary is switched per audience.
// Symptoms ("what we usually find") are drafted; the audience case study is [[LAURA]].

export type Door = {
  slug: string;
  name: string; // short label for breadcrumbs / nav
  eyebrow: string;
  h1: string;
  lead: string;
  find: { h2: string; items: string[] };
  about: { h2: string; body: string; playbooks: string[] }; // slugs into playbookCategories
  caseStudy: string; // [[PLACEHOLDER]]
  shapes: string[]; // engagement shape names most relevant
  serviceType: string;
};

export const doors: Door[] = [
  {
    slug: "founder-led",
    name: "Founder-led",
    eyebrow: "FOUNDER-LED BUSINESSES",
    h1: "You built it. It shouldn't depend on you to run it.",
    lead:
      "There's a stage where the thing that made the business work — you, in everything, deciding everything — becomes the thing holding it back. Nobody warns you about it. We've been on both sides of it.",
    find: {
      h2: "What we usually find.",
      items: [
        "Every decision of consequence still routes through the owner, and the calendar shows it.",
        "The numbers exist, but there's no weekly set everyone trusts and acts on.",
        "There's no bench — the layer of people who could run it if you stepped back for a month.",
        "The business is valuable but not sellable, because it is you.",
      ],
    },
    about: {
      h2: "What we do about it.",
      body:
        "We get the owner out of the day-to-day without the wheels coming off: install the numbers, build the layer underneath you, and document the job only you know how to do. The plays that apply most here:",
      playbooks: ["systems", "owner-and-exit", "growth"],
    },
    caseStudy: "[[LAURA — a founder-led case study belongs here (Part 10.1).]]",
    shapes: ["THE READ", "IN THE SEAT", "ON CALL"],
    serviceType: "Operating advisory for founder-led businesses",
  },
  {
    slug: "family-owned",
    name: "Family-owned",
    eyebrow: "FAMILY-OWNED BUSINESSES",
    h1: "Everyone owns a piece. Nobody owns the decision.",
    lead:
      "The founder who could just decide is gone, and the business is usually run better than people give it credit for. What's holding it back isn't operations — it's governance: a group who each own part of it, and none of whom, alone, can move it.",
    find: {
      h2: "What we usually find.",
      items: [
        "Non-operating family shareholders own a piece but don't work in the business, and want different things from it — income, legacy, a clean exit — with no one reconciling the list.",
        "Decisions stall because nobody has clear authority to make them, and \"we'll raise it at the next family meeting\" has become the answer to everything.",
        "Ownership questions and operating questions get argued in the same room, and they contaminate each other.",
        "Fair and equal are treated as the same thing. They aren't, and pretending they are costs both the business and the family.",
      ],
    },
    about: {
      h2: "What we do about it.",
      body:
        "We separate the two problems that get tangled — who owns the business and who runs it — and put in the governance to decide without a family fight: clear authority, a forum where ownership questions are settled apart from operating ones, and a plan for who runs it next and how they learn to. Succession is usually the play that matters most here. The plays that apply most:",
      playbooks: ["owner-and-exit", "systems", "growth"],
    },
    caseStudy: "[[LAURA — a family-owned / multi-generation case study belongs here.]]",
    shapes: ["THE READ", "IN THE SEAT", "ON CALL"],
    serviceType: "Governance and operating support for family-owned businesses",
  },
  {
    slug: "private-equity",
    name: "Sponsor-backed",
    eyebrow: "SPONSOR-BACKED COMPANIES",
    h1: "Between the underwriting case and what's actually happening.",
    lead:
      "Senior operating capacity into portfolio companies, from post-close through to exit readiness. We work side by side with management rather than over them, we report on a cadence your IC can use, and every mandate has a transition-out date written into it before we start.",
    find: {
      h2: "What we usually find.",
      items: [
        "The value creation plan is sound; execution against it has stalled below the CEO.",
        "Management is capable and busy — and busy is not the same as against the plan.",
        "The board gets narrative, not a scoreboard tied to the EBITDA bridge.",
        "Nobody owns the operating cadence between board meetings.",
      ],
    },
    about: {
      h2: "What we do about it.",
      body:
        "We take a defined operating mandate, run it to a weekly scoreboard tied to the underwriting case, and report on a cadence your investment committee can use — through to exit readiness and a transition out. The plays that apply most here:",
      playbooks: ["systems", "growth", "turnaround"],
    },
    caseStudy: "[[LAURA — a sponsor-backed case study belongs here (Part 10.1).]]",
    shapes: ["THE READ", "THE BUILD", "IN THE SEAT"],
    serviceType: "Post-close operating support for sponsor-backed companies",
  },
  {
    slug: "franchise",
    name: "Franchise & multi-unit",
    eyebrow: "FRANCHISE & MULTI-UNIT",
    h1: "Units open is not the same number as units working.",
    lead:
      "Most franchise advice stops at the award. Ours starts after it — AUV, four-wall EBITDA, labour as a percentage, above-store leadership, and the field support ratio that decides whether your operators can actually be supported. Franchisor or multi-unit operator, the arithmetic is the same and it's rarely the arithmetic people are looking at.",
    find: {
      h2: "What we usually find.",
      items: [
        "Growth is measured in units awarded, not units at healthy four-wall EBITDA.",
        "AUV and labour percentage vary wildly by location and nobody can say why.",
        "The field support ratio is stretched past the point where operators can be helped.",
        "Above-store leadership is thin, so every problem lands back at the top.",
      ],
    },
    about: {
      h2: "What we do about it.",
      body:
        "We work the unit economics that actually move the system — four-wall EBITDA, AUV, labour, the field support ratio — and triage the estate unit by unit: close, fix or convert. The plays that apply most here:",
      playbooks: ["turnaround", "systems", "growth"],
    },
    caseStudy: "[[LAURA — a franchise / multi-unit case study belongs here (Part 10.1).]]",
    shapes: ["THE READ", "THE BUILD", "IN THE SEAT"],
    serviceType: "Operating support for franchise and multi-unit businesses",
  },
];

export function getDoor(slug: string) {
  return doors.find((d) => d.slug === slug);
}
