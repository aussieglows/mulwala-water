# Mulwala Water website — handoff for a new Claude / new computer

Give this file to Claude on the new computer (it lives in the repo, and there's a cloud copy —
see "Artifacts" below). It captures the whole project so work can continue without this session.

_Last updated: 2026-09-22._

---

## 1. What this is

A full rebuild of **mulwalawater.com** — the website for **Mulwala Water Operating & Investment LLC**
(a firm that **advises, operates, and invests** in founder-led, family-owned, sponsor-backed and
multi-unit businesses). Laura (laura@aussieglows.com) is managing it on her husband's behalf.

The app is one Next.js project:
- **Public marketing site** = the rebuild (what we've been working on).
- **`/admin`** = an accounting/P&L + CMS section. **Untouched by the rebuild — do not change it.**

## 2. Repo, branches, hosting

- **GitHub:** `https://github.com/aussieglows/mulwala-water`
- **Working branch: `rebuild`** (all rebuild work). **PR #1 is open: `rebuild` → `main`.**
- **`main`** = the ORIGINAL v1 site, still live at mulwalawater.com. Merging `main` deploys production.
- **Backup of the original:** git tag `v1-original` and branch `backup/original-v1` (commit `fb095f1`).
- **Hosting:** Vercel (auto-deploys). GoDaddy DNS (apex A → Vercel `216.198.79.1`, `www` CNAME → `cname.vercel-dns.com`).
- **DB:** Neon Postgres via `DATABASE_URL` (Prisma 7 driver adapters; local dev can fall back to SQLite/better-sqlite3). The homepage portfolio logos + `/admin` read the DB.

> ⚠️ **First thing to do on the new computer: get the code + env.** Push any local commits from the
> OLD computer first (`git push origin rebuild`). Then on the new computer: `git clone …`,
> `git checkout rebuild`, `npm install`, **pull env from Vercel (see §3 — do NOT transfer `.env`)**,
> `npm run dev` (port 3000).

## 2b. Environment variables — pull from Vercel (never transfer .env)

The `.env` file is not moved between computers. Get the env vars from Vercel instead:

```bash
npm i -g vercel        # once, if the Vercel CLI isn't installed
vercel login           # sign in as the account that owns the project
vercel link            # in the repo root: pick the "mulwala-water" project
vercel env pull .env.local   # writes DATABASE_URL etc. into .env.local
```

`vercel env pull` downloads the project's environment variables (Development scope by default; add
`--environment=production` if a var is only set there) into a local `.env.local` that Next.js reads
automatically. **Manual fallback:** Vercel → project `mulwala-water` → Settings → Environment
Variables → reveal `DATABASE_URL` (Neon Postgres) and paste it into a local `.env.local`. That one var
is what the homepage portfolio logos and `/admin` need; the site's public pages render without it.

## 3. Stack & conventions

- Next.js 16 App Router, React 19, TypeScript, Tailwind v4 (CSS-var tokens in `app/globals.css`).
- **Copy lives in typed modules under `content/`** — not inline in JSX — so words change without touching components. Modules: `site, home, howWeWork, whoWeHelp, playbooks, about, principal, insights, diagnostic`.
- Components in `components/site/`. Public pages in `app/(public)/`.
- The **truss-bridge motif** (`components/site/Truss.tsx`) is the single graphic system.
- Verify with `node_modules/.bin/tsc --noEmit` then `node_modules/.bin/next build`.
- If `next build` errors on stale `.next/types` after moving routes: `node -e "require('fs').rmSync('.next',{recursive:true,force:true})"` then rebuild.

## 4. Current design (CHOSEN — "Bridge palette + Harbour fonts")

Laura reviewed three directions and chose **Bridge colours with Harbour fonts**. Applied in commit `50a74e4`.
- **Palette** (`app/globals.css` `:root`): `--color-ink:#13232d`, `--color-ink2:#26333c`,
  `--color-river:#0e6055` (teal, primary accent), `--color-river-deep:#0a4a42`,
  `--color-river-wash:#d9e8e3`, `--color-brass:#b8863b`, `--color-brass-deep:#8a6120`,
  `--color-paper:#f7f3ec` (warm ground), `--color-surface:#ffffff`, `--color-line:#e4ddd0`,
  `--color-muted:#67707a`.
- **Fonts** (`app/fonts.ts`): **Space Grotesk** for display + eyebrows + metrics, **Inter** for body.
  No serif, no mono. (The `mono` export aliases the display font.)
- The "companies we've backed" strip on the home page uses **white** section + **white** logo tiles
  with a hairline border (commits `295ad33`, `53cae8f`).

## 5. Positioning (do not regress)

The firm does **all three: advise, operate, invest** (an override of the original spec's "operating,
not advisory"). Homepage headline: "We advise, operate, and invest." with a "Three ways to work with
us" section. **Do NOT reintroduce copy that disparages traditional consulting / strategy documents.**

## 6. Hide-until-provided (Laura's rule)

Any section awaiting Laura's input is **hidden from the public site** (no `⚠` markers to visitors) and
appears only once real data exists. Gates live in the page components: e.g.
`home.proof.caseStudies.length > 0`, `howWeWork.risk.approved`, and `isPlaceholder(...)` checks on
door case studies / contact / FAQ / play descriptions. The `[[…]]` strings STAY in the `content/`
files as the data source. `⚠` markers appear only in the private tracker (below), never on the site.

## 7. Launch trim (shipping a simple version first)

Parked under **`parked/`** (NOT deleted — restore later by moving folders back + reverting nav/footer/
sitemap/redirect edits):
- `parked/playbooks-slug` — the four individual playbook pages (`/playbooks` is now ONE page).
- `parked/portfolio` — the portfolio page (logos kept on the home page; `/portfolio` +
  `/portfolio-companies` temporarily redirect home in `next.config.ts`).
- `parked/results` — the results page (removed from nav).
- Newsletter sign-up removed from the footer.
- Nav: Playbooks is a single link; Portfolio removed from the Who We Help dropdown.

Also live: a fourth Who We Help door — **Family-owned** — added alongside Founder-led, Sponsor-backed,
Franchise & multi-unit.

## 8. Artifacts (cloud — owned by Laura's account)

- **ACTIONS TRACKER — "Mulwala site tracker":** https://claude.ai/artifact/VDRJvUzYMGr7QXpBsSuM76
  (pinned). The private to-do dashboard. Mirrors the aussie-glows backlog / Job Search Actions
  dashboards, styled with the consulting palette/fonts. **To update it from the new computer:** use the
  Artifact tool — `read` it by that URL, then republish with `url` set to that URL (keeps the same link).
- **Design directions — "Mulwala design directions":** https://claude.ai/artifact/5jN92cEqMsxb9TnzLuNpyy
  The three concepts (Harbour / Bridge / Estuary). Chosen = **Bridge palette + Harbour fonts** (applied).

## 9. The actions tracker, in text (so it travels)

**Needs Laura's input** (each hidden on the public site until provided):
1. **Case studies (2–3)** — situation → what we found → what we changed → the number → a named quote.
   Shows on: homepage proof band, matching door page, `/results` (parked). Data: `content/home.ts`
   `home.proof.caseStudies`, `content/whoWeHelp.ts` `door.caseStudy`.
2. **Principal bio** — name, title, LinkedIn, photo, bio, career. Fill `content/principal.ts` (currently
   null → About shows a deliberate signed statement). If it must wait, capture WHY.
3. **Portfolio: relationship (Investment/Advisory/Operating), period, 2 lines + logo permissions** per
   company. For when `/portfolio` is un-parked. Confirm F45, Noom, Iris Energy especially.
4. **Contact details** — named email, phone hours, LinkedIn URL. `content/site.ts` `PLACEHOLDER` + `site`.
5. **FAQ answers (7 questions)** on `/how-we-work`. `content/howWeWork.ts` `faq.items` (answers are `[[LAURA]]`).
6. **Playbook play descriptions** — names + subtitles are live; fuller detail pending review.

**A decision:**
7. **The guarantee** on `/how-we-work` — approve / amend / delete. Currently hidden. To publish: set
   `content/howWeWork.ts` `risk.approved = true` (only with Laura's explicit approval).

**Drafted, waiting on Laura:**
8. **Six insight articles** — written in `content/insights.ts` but `published: false`. Need a **byline**
   (author name) + approval, then flip `published: true`. Readable copies in `INSIGHTS-DRAFTS.md`.

**To build next (needs Laura's steer on the advise-only model):**
9. Add a **pure-consulting / advise-only option** to the four Who We Help pages (they currently only
   describe someone coming into the business).
10. A **consulting equivalent of "Diagnose · Scope · Run · Hand over"** for advise-only engagements, on
    `/how-we-work`.

Repo docs: **`PHASE-3-INTAKE.md`** (fill-in worksheet for items 1–8) and **`INSIGHTS-DRAFTS.md`**.

## 10. Deploy / sharing status (open item)

- Vercel auto-builds a preview of `rebuild`. Preview URL (auto-updates on push):
  **https://mulwala-water-git-rebuild-aussie-glows.vercel.app**
- **BLOCKER:** that preview is currently behind **Vercel Deployment Protection** (visiting it redirects
  to a Vercel login — 302 → `vercel.com/sso-api`). To let anyone (e.g. Laura's husband) view it:
  Vercel → project `mulwala-water` → **Settings → Deployment Protection → Vercel Authentication →
  turn OFF → Save.** (Or use a per-deployment "Share" bypass link.) As of this handoff it was still ON.
- **To go live:** push `rebuild`, review PR #1, merge into `main` → Vercel deploys production.

## 11. Constraints & gotchas

- **Never recreate brand/company logos in code** — use only user-supplied logo files.
- In the OLD environment, `git push`, `rm`, and `curl` were blocked for Claude (Laura ran pushes
  herself). The new environment may differ — check before assuming.
- Local memory files (`~/.claude/projects/.../memory/`) do NOT transfer between computers; their key
  facts are captured in this file.
- The old design spec (`C:\Users\lamoo\Downloads\mulwala-water-website-build-spec.md`) drove the
  original rebuild but has been overridden in places (positioning; visible-placeholder → hide-until-
  provided; launch trim). This HANDOFF is the current source of truth where they conflict.

## 12. First steps for the new Claude

1. Confirm you're on branch `rebuild`, `npm install`, set `DATABASE_URL`, `npm run dev`.
2. Read this file, then skim `content/` and `components/site/`.
3. Open the actions tracker artifact (URL in §8) to see the live to-do list.
4. Continue from §9. When Laura supplies inputs, wire them into the relevant `content/` module and the
   gated section un-hides automatically. Keep the tracker artifact updated (read + republish by URL).
5. Commit on `rebuild` with the standard `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>` line.
