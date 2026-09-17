# Deploying Mulwala Water to Vercel

The app is committed and Postgres/Vercel-ready. Local dev still uses SQLite; the cloud uses Postgres
(Neon) — the provider is chosen automatically from `DATABASE_URL` (see `scripts/db-provider.mjs`).

You do the two account steps (create the accounts / log in); I run everything else.

## Step 1 — Create a Neon Postgres database (free)  · YOU
1. Go to https://neon.tech → sign up → **New Project** (name it "mulwala-water", region near you).
2. Copy the **pooled** connection string (looks like
   `postgresql://USER:PASSWORD@ep-xxxx-pooler.REGION.aws.neon.tech/neondb?sslmode=require`).
3. Give me that string (or paste it into `.env` as `DATABASE_URL=` yourself). It's a database
   password — treat it like one.

Then I create the tables + seed:
```
# with DATABASE_URL set to the Neon string
npm run setup
```

## Step 2 — Log in to Vercel  · YOU
```
npx vercel login
```
(opens the browser once; use your Vercel account — create one free at https://vercel.com if needed)

## Step 3 — Deploy  · ME (after steps 1–2)
```
npx vercel link          # create/link the Vercel project
# push the env vars (I'll add each of these):
npx vercel env add DATABASE_URL         production   # the Neon string
npx vercel env add SESSION_SECRET       production   # a long random string
npx vercel env add ADMIN_PASSCODE       production   # your admin login passcode
npx vercel env add ANTHROPIC_API_KEY    production   # optional (AI reading)
npx vercel env add APP_URL              production   # https://<your-vercel-domain>
# (GOOGLE_*, PLAID_*, CRON_SECRET later when you connect those — see INTEGRATIONS.md)
npx vercel --prod        # deploy
```
Result: a live URL like `https://mulwala-water.vercel.app`. We test it there.

## Step 4 — Point the domain (later, once you're back into GoDaddy)
In GoDaddy DNS, point `mulwalawater.com` at Vercel (Vercel shows the exact A/CNAME records under
Project → Settings → Domains). Leave the MX/email records untouched. Vercel auto-issues the SSL cert.

## Alternative: GitHub + Vercel dashboard (no CLI)
If you prefer clicking: put the repo on GitHub (GitHub Desktop is easiest), then at vercel.com →
**Add New → Project → Import** the repo. Add the **Neon** integration from the Storage tab (it sets
`DATABASE_URL` for you), add the other env vars under Settings → Environment Variables, and Deploy.

## Notes
- Media (uploaded invoices/screenshots) is stored in the database, so it works on Vercel with no extra
  storage service.
- The daily sync cron is configured in `vercel.json` (`/api/cron/run`); set `CRON_SECRET` to enable it.
