// Central site configuration + copy. Editing words here never touches components (spec Part 8.1).
// `[[...]]` markers denote values only Laura can supply (Part 10). They render visibly (see Placeholder).

export const PLACEHOLDER = {
  bookingUrl: "[[BOOKING_URL]]", // Calendly/SavvyCal link for "Book a 20-minute call"
  namedEmail: "[[NAMED EMAIL]]", // e.g. laura@mulwalawater.com — a person, not info@
  linkedin: "[[LINKEDIN_URL]]",
} as const;

export const site = {
  name: "Mulwala Water",
  legalName: "Mulwala Water Operating & Investment LLC",
  // Fallback contact until the named details are supplied.
  email: "info@mulwalawater.com",
  phone: "(201) 657-2292",
  phoneHours: "[[HOURS PHONE IS ANSWERED]]",
  bookingUrl: PLACEHOLDER.bookingUrl,
  linkedin: PLACEHOLDER.linkedin,
};

// Primary CTA — verbatim everywhere (spec Part 4.4). Falls back to /contact until a booking link exists.
export const ctaPrimary = { label: "Book a 20-minute call", href: "/contact" };
export const ctaSecondary = { label: "See how we work", href: "/how-we-work" };

export const nav = [
  {
    label: "Who We Help",
    href: "/who-we-help",
    children: [
      { label: "Founder-led businesses", href: "/who-we-help/founder-led" },
      { label: "Family-owned businesses", href: "/who-we-help/family-owned" },
      { label: "Sponsor-backed companies", href: "/who-we-help/private-equity" },
      { label: "Franchise & multi-unit", href: "/who-we-help/franchise" },
      { label: "Portfolio & advisory companies", href: "/portfolio", divider: true },
    ],
  },
  { label: "How We Work", href: "/how-we-work" },
  {
    label: "Playbooks",
    href: "/playbooks",
    children: [
      { label: "Growth", href: "/playbooks/growth" },
      { label: "Systems", href: "/playbooks/systems" },
      { label: "Turnaround", href: "/playbooks/turnaround" },
      { label: "Owner & Exit", href: "/playbooks/owner-and-exit" },
    ],
  },
  { label: "Results", href: "/results" },
  { label: "About", href: "/about" },
];

export const footer = {
  columns: [
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Portfolio", href: "/portfolio" },
        { label: "Insights", href: "/insights" },
        { label: "Contact", href: "/contact" },
        { label: "Privacy", href: "/privacy" },
      ],
    },
    {
      title: "Who We Help",
      links: [
        { label: "Founder-led", href: "/who-we-help/founder-led" },
        { label: "Family-owned", href: "/who-we-help/family-owned" },
        { label: "Sponsor-backed", href: "/who-we-help/private-equity" },
        { label: "Franchise & multi-unit", href: "/who-we-help/franchise" },
      ],
    },
    {
      title: "Playbooks",
      links: [
        { label: "Growth", href: "/playbooks/growth" },
        { label: "Systems", href: "/playbooks/systems" },
        { label: "Turnaround", href: "/playbooks/turnaround" },
        { label: "Owner & Exit", href: "/playbooks/owner-and-exit" },
      ],
    },
  ],
  newsletter: {
    heading: "The occasional note",
    description: "Field notes on operating founder-led and multi-unit businesses. A few times a year, never more.",
  },
};
