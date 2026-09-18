// Copy for /how-we-work — the highest-priority page (spec Part 6.4).
// [[...]] values render as visible placeholders until Laura approves them.

export const howWeWork = {
  eyebrow: "HOW WE WORK",
  h1: "What an engagement actually looks like.",
  lead:
    "We work three ways — we advise, we operate, and we invest — and we scope to the problem, not to a rate card. Whether you need a plan you can act on, a person to step in and run it, or capital alongside you, here is the shape of an engagement, so you can decide whether it fits before you spend twenty minutes on a call.",

  shapes: {
    h2: "Four shapes. One way of working.",
    intro:
      "The Read and On Call are how we advise; the Build and In the Seat are how we operate. Each is a fixed-fee engagement, scoped to the problem.",
    investNote:
      "And where it fits, we invest — backing a business with capital as well as advice, so our incentives sit with yours. If that's the conversation, tell us on the call.",
    cards: [
      {
        name: "THE READ",
        duration: "3 weeks",
        who: "One operator, on site and in the numbers.",
        gets: [
          "A written point of view on what is actually holding the business back, ranked by impact",
          "The three things to do first, with owners and dates",
          "A straight answer on whether you need us after that, including when you don't",
        ],
      },
      {
        name: "THE BUILD",
        duration: "8 to 14 weeks",
        who: "One operator leading, specialists in and out as the work needs them.",
        gets: [
          "One play, run properly, start to finish",
          "The system installed and your people trained on it",
          "Handover documents, so it keeps running when we go",
        ],
      },
      {
        name: "IN THE SEAT",
        duration: "3 to 12 months",
        who: "An operating seat — COO, GM, or alongside yours.",
        gets: [
          "A defined mandate and a scoreboard we both look at every week",
          "We hire, fire, decide and are accountable for the number",
          "A leaving date, written into the scope before we start",
        ],
      },
      {
        name: "ON CALL",
        duration: "ongoing",
        who: "A standing line to a senior operator.",
        gets: [
          "For the decisions that don't justify a project but shouldn't be made alone",
          "Monthly, or when it matters",
          "No minimum term",
        ],
      },
    ],
  },

  phases: {
    h2: "Diagnose. Scope. Run. Hand over.",
    items: [
      {
        n: "01",
        name: "Diagnose",
        body:
          "A 20-minute call, then a longer conversation if it looks like a fit. We are trying to work out whether your problem is the kind we are good at. Sometimes it isn't, and we say so.",
      },
      {
        n: "02",
        name: "Scope",
        body:
          "One page. The mandate, what success looks like as a number, who is doing it, how long, what it costs, and when we leave. Fixed fee, agreed in writing before we start.",
      },
      {
        n: "03",
        name: "Run",
        body:
          "We are in the business, not adjacent to it. Weekly scoreboard, monthly written update to you and anyone else who needs it — your board, your sponsor, your lender. No surprises in month three.",
      },
      {
        n: "04",
        name: "Hand over",
        body:
          "Every engagement has a leaving date in the scope. We write it before we start, because a firm that can't say when it's leaving isn't planning to. You get the artifacts, your people get the training, and we check in at 90 days to see whether it held.",
      },
    ],
  },

  dontDo: {
    h2: "When we're the wrong call.",
    items: [
      { lead: "If you already know the answer and just need extra hands,", rest: "a contractor or a staffing firm is cheaper. We earn our keep when the judgement is the hard part, not the labour." },
      { lead: "If the owner isn't ready to change anything,", rest: "an outside operator makes it worse, not better. We've learned this the hard way." },
      { lead: "If you need a permanent hire, hire one.", rest: "Sometimes the right answer is a full-time COO. We'll say so, and we've helped people find one." },
    ],
  },

  price: {
    h2: "What it costs.",
    body: [
      "We price to the mandate, not to a rate card — a three-week read on a 40-unit franchisee and a three-week read on a single-site manufacturer are different pieces of work. Every engagement is a fixed fee agreed in writing before we start, so you are never billed for a surprise.",
      "You'll have a number in the first conversation. We don't make people work for it.",
    ],
  },

  alternatives: {
    h2: "Us, a big firm, a full-time hire, or doing it yourself.",
    columns: ["Mulwala Water", "A large consultancy", "A full-time hire", "You, at night"],
    rows: [
      { label: "Time to start", cells: ["Weeks", "Months", "3–6 months", "Now"] },
      { label: "Who does the work", cells: ["The person you met", "Often a team you haven't met", "The person you hired", "You"] },
      { label: "Accountable for the number", cells: ["Yes", "Rarely", "Yes", "Yes"] },
      { label: "Cost shape", cells: ["Fixed fee, ends", "Fixed or T&M, ends", "Salary, permanent", "Your weekends"] },
      { label: "Leaves when it's done", cells: ["Yes, by design", "Yes", "No — that's the point", "Never"] },
      { label: "Best when", cells: ["The gap is real but temporary, and needs someone who has done it", "The problem is genuinely enterprise-scale", "The need is permanent and you can attract the person", "It's small enough that you can"] },
    ],
  },

  risk: {
    h2: "If it isn't working, you shouldn't have to finish it.",
    approvalNote: "[[LAURA — THIS IS A REAL COMMERCIAL COMMITMENT. Approve, amend or delete. Do not ship it unapproved.]]",
    body:
      "Two weeks into any engagement you'll know whether we're the right people, and so will we. If either of us thinks we aren't, we stop there and you pay only for the time used. No notice period, no wind-down fee, no awkward conversation about the rest of the contract.",
  },

  faq: {
    h2: "The questions people ask on the first call.",
    items: [
      { q: "Who actually turns up?", a: "[[LAURA]]" },
      { q: "How much of your time do we get?", a: "[[LAURA]]" },
      { q: "Do you work remotely or on site?", a: "[[LAURA]]" },
      { q: "What do you need from us to start?", a: "[[LAURA]]" },
      { q: "What happens if the engagement needs to change shape halfway through?", a: "[[LAURA]]" },
      { q: "Do you sign NDAs?", a: "[[LAURA]]" },
      { q: "Will you take equity instead of fees?", a: "[[LAURA — relevant given the investment side; a straight answer here is unusual and would be noticed.]]" },
    ],
  },

  cta: {
    heading: "Book a 20-minute call.",
    sub: "Twenty minutes, no deck. We'll tell you whether this is a problem we're good at.",
  },
};
