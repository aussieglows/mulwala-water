// Pure, client-safe (no db / server-only imports) so client components can import these too.

// Default expense categories for a consulting business. These SEED the editable ExpenseCategory table
// (see prisma/seed.ts); after seeding they're managed in the admin (Sources → Expense categories), so
// this list is only the starting point. Kept as the fallback if the table is ever empty.
export const EXPENSE_CATEGORIES = [
  // People
  "Salaries & wages",
  "Payroll taxes & benefits",
  "Contractor & freelancer fees",
  // Travel
  "Flights",
  "Accommodation",
  "Ground transport",
  "Meals & entertainment",
  "Client entertainment",
  // Growth & knowledge
  "Conferences & events",
  "Training & professional development",
  "Dues & memberships",
  "Marketing & business development",
  // Tools & services
  "Software & subscriptions",
  "Website & hosting",
  "Legal fees",
  "Accounting & bookkeeping",
  "Professional services (other)",
  // Overheads
  "Office supplies & equipment",
  "Rent & workspace",
  "Phone & internet",
  "Insurance",
  "Bank & payment fees",
  "Taxes & licenses",
  "Other",
] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

// Revenue types (a received-revenue record is tagged with one; the P&L still groups by source).
export const REVENUE_CATEGORIES = [
  "Consulting fees",
  "Retainer",
  "Project fee",
  "Advisory",
  "Reimbursement",
  "Investment income",
  "Other",
] as const;
export type RevenueCategory = (typeof REVENUE_CATEGORIES)[number];

// How money moved (revenue received / expense paid).
export const PAYMENT_METHODS = ["Bank transfer", "Card", "Check", "Cash", "Other"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

// Kinds of revenue source (drives grouping on the P&L).
export const SOURCE_KINDS = ["CLIENT", "INVESTMENT", "OTHER"] as const;
export type SourceKind = (typeof SOURCE_KINDS)[number];
export const sourceKindLabel: Record<string, string> = {
  CLIENT: "Client",
  INVESTMENT: "Investment",
  OTHER: "Other",
};
