# Project status — Mulwala Water (public site + admin P&L)

Last updated: 2026-09-17.

## What this is
The **Mulwala Water Operating & Investment LLC** website + back office (owners: Laura Orr & husband).
One unified app, forked from the **aussie glows booking app** framework (Next.js 16 + React 19 +
Prisma 7 + Tailwind v4 + Claude vision). Local-first on SQLite.

- **Public website** (recreation of mulwalawater.com) at the root: `/`, `/about`, `/playbooks`,
  `/portfolio-companies`. Content is editable from the admin (a light CMS) — nothing hard-coded.
- **Admin** at `/admin` (passcode login at `/admin/login`): the P&L / accounting, plus a Website
  content editor (`/admin/site`) and an Inbox (`/admin/inbox`) for contact-form messages + newsletter
  sign-ups. Public contact/newsletter submissions save to the DB and appear in the Inbox.

(The folder is still named `Consulting-PL` from when the accounting was built first.)

## Stack
- Next.js 16 App Router, React 19 (server components + server actions).
- Prisma 7 with `@prisma/adapter-better-sqlite3` → local `prisma/dev.db`.
- Claude `claude-haiku-4-5` for reading invoices + payment screenshots (images and PDFs).
- Single-passcode auth (HMAC-signed cookie), `ADMIN_PASSCODE` + `SESSION_SECRET` in `.env`.

## Data model (prisma/schema.prisma)
Accounting: `RevenueSource` (P&L revenue line items — seeded: Parched Hospitality Group, Romina Day,
Investment Income), `ExpenseCategory` (editable expense line items — seeded from lib/categories.ts,
managed in Sources; Expense stores the category name as a string so renames don't rewrite history),
`RevenueEntry`, `Expense`, `MediaAsset` (uploads at /api/media/<id>), `AppSettings` (businessName,
currency, taxRatePercent, fiscalYearStartMonth), `BankConnection` (Plaid).
Public site (all editable from `/admin/site`): `SiteSettings` (singleton: all page copy — hero, about,
vision, approach, section intros, footer, phone, email), `ExpertisePoint`, `Playbook`,
`PortfolioCompany`, `ContactMessage` (contact-form inbox), `NewsletterSignup`.

## Recently shipped (2026-09-17)
- **Accounting (built first):** dashboard, month-by-month P&L (by source / by category, est. tax, CSV
  export), Revenue + Expenses managers with upload → AI auto-fill → review/confirm + full edit/delete,
  Sources manager, Settings, media upload/serve (image + PDF), inbound-email webhook
  `/api/inbound?type=revenue|expense`. Seeded the three revenue sources.
- **Public site + admin unify (later same day):** moved accounting under `/admin` (login at
  `/admin/login`); built the public Mulwala Water site at the root (`/`, `/about`, `/playbooks`,
  `/portfolio-companies`) from the real mulwalawater.com content; made all copy editable via
  `/admin/site` (CMS); added `/admin/inbox` for contact messages + newsletter sign-ups; public
  contact/newsletter forms (`lib/actions/public.ts`) with honeypot spam guard.

## Automation (built 2026-09-17 — see INTEGRATIONS.md for switch-on steps)
All four are coded and wired into Admin → Settings → Automation; each needs keys in `.env` to activate.
- **AI extract** (`ANTHROPIC_API_KEY`) — invoice/payment reading for uploads + email.
- **Gmail** (`lib/google.ts`, `/api/google/auth` + `/callback`) — OAuth connect; scans an Expenses and
  a Revenue label, pulls attachments → AI → pending rows. `GoogleAccount` + `ProcessedEmail` (dedup).
  Chosen over Postmark/SendGrid because it needs no DNS and works locally (outbound API, not a webhook).
- **Plaid bank + investments** (`lib/plaid.ts`, `/api/plaid/link-token` + `/exchange`) — Plaid Link
  (CDN) connect; `syncPlaid` pulls transactions (→ expense/revenue) + investment dividends/interest
  (→ Investment Income), dedup on `bankTxnId`. `BankConnection` holds cursor + investmentsFrom.
- **Uploads** — already live on Revenue/Expenses.
- **Cron** `/api/cron/run?key=<CRON_SECRET>` runs Gmail+Plaid sync (for a scheduler after deploy).
- Server actions in `lib/actions/integrations.ts`; connect/sync UI in `components/integrations/*`.

## Outstanding to-do
- Add real keys to `.env` (Anthropic, Google OAuth, Plaid) to activate — see INTEGRATIONS.md.
- Legacy inbound-email webhook `/api/inbound` still exists as an alternative to Gmail (Postmark/SendGrid).
- Multi-currency display (currently a label only).
- Deploy path: Postgres/Neon + Vercel + blob storage for media (see README).
- Optional: quarterly view, per-client profitability (billable expenses vs revenue), forecast toggle
  (the booking app has a forecasting P&L to borrow from).

## How to resume
1. `npm install`; ensure `.env` exists (ADMIN_PASSCODE, SESSION_SECRET, optional ANTHROPIC_API_KEY).
2. `npm run setup` (db push + seed) if `prisma/dev.db` is missing.
3. `npm run dev` → http://localhost:3000. Read this file + README.md.
