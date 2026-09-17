# Automation setup — switch-on checklist

Everything below is already **built into the app**. To turn each one on you add keys to `.env`, restart
(`npm run dev`), then use the buttons on **Admin → Settings → Automation**. All auto-imported items land
as **drafts in the review queues** (Revenue / Expenses) — nothing is counted until you confirm it.

The three that need accounts (AI, Gmail, Plaid) require signups only you can do — I can't create
accounts or hold your credentials. Each is free to start.

---

## 1. AI reading of invoices & payments  (needed by uploads + email)
1. Get an API key at https://console.anthropic.com → API Keys.
2. In `.env` set `ANTHROPIC_API_KEY="sk-ant-..."`.
3. Restart. Uploads and forwarded emails will now auto-fill vendor/amount/date/category.
   *(Without it, uploads still save and attach — you just type the fields.)*

## 2. Email — forward receipts & revenue via Gmail
Works locally (no deploy needed), because the app reads Gmail rather than receiving a webhook.
1. Go to https://console.cloud.google.com → create a project.
2. **APIs & Services → Library →** enable **Gmail API** (and **People API** for the email address).
3. **OAuth consent screen:** choose *External*, fill the basics, and under **Test users** add the
   Gmail address you'll use. (Testing mode is fine for personal use — no Google review needed.)
4. **Credentials → Create credentials → OAuth client ID → Web application.** Add an
   **Authorized redirect URI:** `http://localhost:3000/api/google/callback`
   (and later your deployed `https://YOURDOMAIN/api/google/callback`).
5. Put the client ID/secret in `.env`:
   `GOOGLE_CLIENT_ID="..."` and `GOOGLE_CLIENT_SECRET="..."`. Restart.
6. In the admin: **Settings → Email → Connect Google account.**
7. In Gmail, make two labels (default names **Expenses** and **Revenue**) and forward/filter the right
   emails into each. Then hit **Sync now** (or let the scheduled sync run after deploy).
   *You can rename the labels the app looks for right on the Settings card.*

## 3. Bank + investments via Plaid
Testable locally in Plaid's free **sandbox** (fake bank logins).
1. Sign up at https://dashboard.plaid.com. In **Team Settings → Keys**, copy your `client_id` and the
   **Sandbox** secret.
2. To link investment accounts, request the **Investments** product (Dashboard → Products).
3. In `.env`:
   `PLAID_CLIENT_ID="..."`, `PLAID_SECRET="..."`, `PLAID_ENV="sandbox"`. Restart.
4. In the admin: **Settings → Bank + investments → Connect a bank.** In sandbox use the test login
   `user_good` / `pass_good`.
5. Hit **Sync now.** Bank charges → draft **expenses**, deposits → draft **revenue**, and
   dividends/interest → draft **Investment Income**. Dedup is automatic.
6. When ready for real banks, switch `PLAID_ENV` to `production` (Plaid requires a quick production
   access request) and re-link.

## 4. Upload screenshots & invoices
Already on — Revenue and Expenses pages both have an upload button (PDF or photo).

---

## Scheduled (hands-off) syncing — after deploy
`GET/POST /api/cron/run?key=<CRON_SECRET>` runs Gmail + Plaid sync. Set `CRON_SECRET` in `.env`, then
point a scheduler at it (Vercel Cron or a GitHub Action) — e.g. every few hours. Until then, use the
**Sync now** buttons.

## Note on hosting
Uploads, Gmail sync and Plaid **sandbox** all work locally. For everyday hands-off use — scheduled
syncs and real (production) bank links with OAuth — deploy to Vercel + Neon Postgres and set the same
env vars there (and add the deployed redirect URI in Google + Plaid). Ask and I'll do the deploy.
