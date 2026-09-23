// The "Which play do you need?" diagnostic (spec Part 6.7).
// Eight questions, each option weighted to a playbook category. Result names the top
// category and two plays. Free, no email required to see the answer.

export type Cat = "growth" | "systems" | "turnaround" | "owner-and-exit";

export type DiagnosticQuestion = {
  q: string;
  options: { label: string; cat: Cat }[];
};

export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    q: "What's the sharpest pain right now?",
    options: [
      { label: "We've plateaued — growth has stalled", cat: "growth" },
      { label: "Nobody agrees on the numbers", cat: "systems" },
      { label: "Cash is tight and getting tighter", cat: "turnaround" },
      { label: "The business runs through me and I want out of the day-to-day", cat: "owner-and-exit" },
    ],
  },
  {
    q: "If you fixed one thing in the next 90 days, it would be…",
    options: [
      { label: "Opening a new market or channel", cat: "growth" },
      { label: "A weekly scoreboard everyone trusts", cat: "systems" },
      { label: "Stopping the bleeding", cat: "turnaround" },
      { label: "A plan for who runs it next", cat: "owner-and-exit" },
    ],
  },
  {
    q: "Your cash position is…",
    options: [
      { label: "Healthy — we're investing", cat: "growth" },
      { label: "Fine, but we fly blind", cat: "systems" },
      { label: "The thing keeping me up at night", cat: "turnaround" },
      { label: "Strong — this is about my time, not money", cat: "owner-and-exit" },
    ],
  },
  {
    q: "When you look at your team…",
    options: [
      { label: "We need more reach and sales muscle", cat: "growth" },
      { label: "There's no layer underneath the owner", cat: "systems" },
      { label: "We may have to make cuts", cat: "turnaround" },
      { label: "I need someone who could run it without me", cat: "owner-and-exit" },
    ],
  },
  {
    q: "Which phrase fits best?",
    options: [
      { label: "Same offer, more customers", cat: "growth" },
      { label: "One source of truth", cat: "systems" },
      { label: "Decide what to stop", cat: "turnaround" },
      { label: "Built so it could be sold", cat: "owner-and-exit" },
    ],
  },
  {
    q: "Your margins are…",
    options: [
      { label: "Fine — we just need volume", cat: "growth" },
      { label: "A mystery per unit or customer", cat: "systems" },
      { label: "Underwater, or close to it", cat: "turnaround" },
      { label: "Healthy — I'm optimizing for exit", cat: "owner-and-exit" },
    ],
  },
  {
    q: "In two years, you want…",
    options: [
      { label: "To be meaningfully bigger", cat: "growth" },
      { label: "The business to run itself", cat: "systems" },
      { label: "To have survived and stabilized", cat: "turnaround" },
      { label: "To have stepped back, or sold", cat: "owner-and-exit" },
    ],
  },
  {
    q: "What would your best people say is broken?",
    options: [
      { label: "We could sell more but don't", cat: "growth" },
      { label: "We don't have the numbers to decide", cat: "systems" },
      { label: "We're firefighting constantly", cat: "turnaround" },
      { label: "Everything waits for the owner", cat: "owner-and-exit" },
    ],
  },
];

export const diagnosticResults: Record<
  Cat,
  { name: string; blurb: string; plays: { name: string; subtitle: string }[]; href: string }
> = {
  growth: {
    name: "Growth",
    blurb:
      "The foundations are sound and it's time to push. The trap is chasing new and shiny before wringing out what already works — so we start there.",
    plays: [
      { name: "Au Naturel", subtitle: "Grow with what already works" },
      { name: "Big Foot", subtitle: "Expand the footprint" },
    ],
    href: "/playbooks/growth",
  },
  systems: {
    name: "Systems",
    blurb:
      "The business works but you're flying on instinct. Install the numbers and the layer underneath you, and decisions get faster and calmer.",
    plays: [
      { name: "The Scoreboard", subtitle: "The five to seven numbers that run the business, weekly" },
      { name: "Handover", subtitle: "Document and delegate the owner's job" },
    ],
    href: "/playbooks/systems",
  },
  turnaround: {
    name: "Turnaround",
    blurb:
      "First job is time. Get thirteen weeks of cash visibility, stabilize, then decide what to stop — in that order, not the other way around.",
    plays: [
      { name: "Cash First", subtitle: "Stabilise cash and buy time" },
      { name: "Cut to the Core", subtitle: "Decide what to stop" },
    ],
    href: "/playbooks/turnaround",
  },
  "owner-and-exit": {
    name: "Owner & Exit",
    blurb:
      "This is about your time and your options. Build the business so it could be sold — whether or not you sell it — and get yourself out of the day-to-day.",
    plays: [
      { name: "Sellable", subtitle: "Built so it could be sold, whether or not you sell it" },
      { name: "Take Back the Calendar", subtitle: "Get the owner out of the day-to-day" },
    ],
    href: "/playbooks/owner-and-exit",
  },
};
