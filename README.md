# Consulting P&L

A profit-and-loss / bookkeeping app for a consulting business. Log revenue by client/source and
expenses by category, upload invoices and payment screenshots for AI auto-fill, forward documents in
by email, and see a monthly P&L. Everything is fully editable.

Built on the same framework as the aussie glows booking app: **Next.js 16 (App Router) + React 19 +
Prisma 7 + Tailwind v4 + Claude (Haiku) vision**. Local-first on **SQLite**.

## Quick start

```bash
npm install
cp .env.example .env      # then edit ADMIN_PASSCODE + paste a SESSION_SECRET (see the file)
npm run setup             # creates the SQLite DB + seeds revenue sources
npm run dev               # http://localhost:3000
```

Sign in with the `ADMIN_PASSCODE` from your `.env` (default in the local `.env` is `consult2026`).

To turn on AI auto-fill of invoices/screenshots, add `ANTHROPIC_API_KEY` to `.env` and restart.
Without it, uploads still save and attach — you just fill the fields in yourself.

## What's in it

- **Dashboard** — YTD revenue / expenses / net, pending-review alerts, top sources, recent activity.
- **P&L** — month-by-month table: revenue by source, expenses by category, net before/after an
  optional estimated-tax rate. Year selector + CSV export.
- **Revenue** — log income against a source; upload a payment screenshot/remittance (PDF or image)
  and Claude pre-fills payer, amount, date, type — then you confirm.
- **Expenses** — log costs by consulting category (Flights, Accommodation, Ground transport, Meals,
  Software, Professional services, …); upload an invoice and Claude splits it into editable line items.
- **Sources** — your P&L revenue line items (seeded: Parched Hospitality Group, Romina Day,
  Investment Income). Add/rename/reorder/deactivate.
- **Settings** — business name, currency, estimated tax rate, fiscal-year start; automation setup.

## Automation (three tiers)

1. **Upload + AI extract** — works now (needs `ANTHROPIC_API_KEY`).
2. **Email forwarding** — point an inbound-email provider at `POST /api/inbound?type=expense`
   (or `?type=revenue`). Forwarded attachments are AI-read into the review queues. Set
   `INBOUND_SECRET` and append `?key=...` to secure it. See **Settings → Automation** for the exact URL.
3. **Bank link (Plaid)** — add `PLAID_CLIENT_ID` / `PLAID_SECRET` / `PLAID_ENV` to enable; the
   connect + sync flow is the next phase (see PROJECT_STATUS.md).

## Deploying later

Local uses SQLite. To host it (like the booking app on Vercel + Neon Postgres): switch the Prisma
`datasource` provider to `postgresql`, swap the adapter in `lib/db.ts` to `@prisma/adapter-pg`, and
move media/uploads to blob storage if you expect large volumes.
