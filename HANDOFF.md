# Mulwala Water — full handoff (read me first)

This project must survive with **nothing left on the original computer**. Everything is in GitHub, in
Claude.ai artifacts, and in Google Drive. This file is the source of truth. Give it to Claude on the
new machine.

_Last updated: 2026-09-25 (moved to the new computer; §3 setup corrected)._

---

## 0. EVACUATION — do this before the old computer dies

1. **Push BOTH branches to GitHub** (Claude cannot push; you must, from the old machine while it lives):
   ```bash
   git push origin classic
   git push origin rebuild
   ```
   `classic` is the current working branch and holds the newest work **and this handoff + the artifact
   backups in `docs/artifacts/`**. `rebuild` holds the alternate (Bridge) design. If you can only do one,
   push **classic**.
2. That's it for the code. Everything else (artifacts, Drive docs) is already in the cloud.

To confirm nothing is stranded: `git status` should say clean, and `git log origin/classic..HEAD`
should be empty after the push.

## 1. What this is

The website for **Mulwala Water Operating & Investment LLC** — a firm that **advises, operates, and
invests** in founder-led, family-owned, sponsor-backed and multi-unit businesses. Laura
(laura@aussieglows.com) manages it for her husband. One Next.js app: the public marketing site is the
rebuild; **`/admin`** is a separate accounting/CMS section — **do not touch it**.

## 2. Repo, branches, hosting

- **GitHub:** https://github.com/aussieglows/mulwala-water
- **Two design versions, on two branches:**
  - **`classic`** — the CURRENT working branch. Full site in the **original mulwalawater.com look**
    (Poppins, teal/navy/white, the wordmark logo, photo hero on every page). Also has the `/book` page.
  - **`rebuild`** — the alternate "Bridge" design (Source-Serif-ish → now Space Grotesk, ink/teal/brass,
    truss graphic). Kept intact so it can be chosen instead. **PR #1 (rebuild → main) is open.**
  - **The Bridge-vs-classic decision is still open.** Laura is leaning classic (this is where recent
    work went). Whichever wins gets merged to `main`; the other stays as a branch.
- **`main`** = the ORIGINAL v1 site, still live at mulwalawater.com. Merging to `main` deploys production.
- **Original backup:** git tag `v1-original` / branch `backup/original-v1` (`fb095f1`).
- **Hosting:** Vercel (auto-deploys every branch). GoDaddy DNS. Neon Postgres.
- **Preview URLs (after pushing):** classic → `https://mulwala-water-git-classic-aussie-glows.vercel.app`,
  Bridge → `https://mulwala-water-git-rebuild-aussie-glows.vercel.app`. Both are behind **Vercel
  Deployment Protection** (a login wall) until you turn it OFF: Vercel → project `mulwala-water` →
  Settings → Deployment Protection → **Vercel Authentication → Off → Save**.

## 3. New computer: get set up (nothing transfers from the old one)

```bash
git clone https://github.com/aussieglows/mulwala-water
cd mulwala-water
git checkout classic        # or rebuild
npm install                 # npm 11+: if it warns about install scripts, run
                            #   npm approve-scripts better-sqlite3 esbuild prisma sharp unrs-resolver @prisma/engines
                            #   npm rebuild
npm run dev                 # http://localhost:3000
```
- **Env: Vercel can't hand it over.** Every var in Vercel is a **Secret** (Production + Preview only), so
  `vercel env pull` writes `[SENSITIVE]` placeholders and the dashboard won't reveal values. Don't use
  the pulled file — write `.env.local` by hand instead (gitignored).
- **DATABASE_URL** (Neon Postgres) is the key var — powers the homepage portfolio logos + `/admin`.
  Get it from the **Neon dashboard** (console.neon.tech → project → Connect → connection string) and
  put `DATABASE_URL="postgresql://…"` in `.env.local`. Laura pastes it herself; never paste it in chat.
- **Without Neon** you can run on a local SQLite test DB: `DATABASE_URL="file:./dev.db"` in `.env.local`,
  then `$env:DATABASE_URL='file:./dev.db'; npm run setup` (PowerShell) to create + seed it. The CLI
  scripts load `.env`, not `.env.local`, hence the inline var.
- `scripts/db-provider.mjs` flips `prisma/schema.prisma` between `sqlite` and `postgresql` to match
  `DATABASE_URL`. **Never commit the schema while it says `sqlite`.**
- Windows PowerShell blocks `vercel.ps1` ("running scripts is disabled") — use `vercel.cmd …` instead,
  and open a new terminal after `npm i -g vercel` so it's on PATH.
- Verify builds with `node_modules/.bin/tsc --noEmit` then `node_modules/.bin/next build`. If `next build`
  errors on stale `.next/types` after moving routes: `node -e "require('fs').rmSync('.next',{recursive:true,force:true})"`
  then rebuild. **Don't delete `.next` while `npm run dev` is running** — it 500s; restart dev after.

## 4. Stack & conventions

- Next.js 16 App Router, React 19, TypeScript, Tailwind v4 (CSS-var tokens in `app/globals.css`).
- **Copy lives in typed modules under `content/`** — `site, home, howWeWork, whoWeHelp, playbooks, about,
  principal, insights, diagnostic`. Change words there, not in JSX.
- Components in `components/site/`. Public pages in `app/(public)/`. Fonts in `app/fonts.ts`.
- Design is token-driven: to reskin, change `app/globals.css` palette tokens + `app/fonts.ts` + the
  `Hero`/`Nav`/`Footer`/`Logo` components. (That's exactly how `classic` differs from `rebuild`.)

## 5. Design specifics per branch

- **classic:** `app/fonts.ts` = Poppins. `app/globals.css` tokens = navy `#24384f` (ink), teal `#0f766e`
  (river/accent), white/`#f5f8f9` grounds. `components/site/Logo.tsx` = the real wordmark (bridge + text),
  used in Nav/Footer. `Hero.tsx` = full-bleed photo + navy overlay; each page passes an `image` (aerial
  home, boardroom how-we-work, skyline who-we-help, office doors/insights, sunset playbooks, pano about).
- **rebuild:** Space Grotesk + Inter, ink/teal/brass tokens, the X-braced truss motif
  (`components/site/Truss.tsx` `TrussMark` + `Truss`) matching the logo bridge.

## 6. Positioning & content rules (both branches)

- The firm does **all three: advise, operate, invest.** Never reintroduce copy that talks down
  traditional consulting.
- **Hide-until-provided:** sections awaiting Laura's input are HIDDEN from the public site (no `⚠` to
  visitors); they appear only once real data exists. Gates use `isPlaceholder(...)` and flags like
  `home.proof.caseStudies.length` / `howWeWork.risk.approved`. The `[[…]]` strings stay in `content/`.
- **Launch trim:** `/portfolio`, `/results`, and the four individual `/playbooks/[slug]` pages are
  **parked under `parked/`** (not deleted); `/playbooks` is one page; newsletter removed; portfolio logos
  kept on the home page. Restore by moving folders back + reverting nav/footer/sitemap/redirect edits.

## 7. Booking (`/book`)

- Every "Book a 20-minute call" button routes to the on-site **`/book`** page (`bookingHref` in
  `content/site.ts`), which **embeds the scheduler** in an iframe from `site.bookingUrl`.
- `site.bookingUrl` is not set yet, so `/book` shows an email/call fallback. **To go live:** create a
  Google Calendar → Appointment schedule (or Calendly), copy the embed/booking URL, and set
  `site.bookingUrl = "<url>"`. (Currently on `classic`; port to `rebuild` if that design is chosen.)

## 8. Cloud artifacts (on Laura's Claude account — survive the computer)

All are private to Laura's account; open from claude.ai or Claude Code `/artifacts`. **Source HTML for
each is backed up in the repo at `docs/artifacts/`** so a new Claude can edit/republish or rebuild them.

| Artifact | URL | Source in repo |
|---|---|---|
| **Mulwala site tracker** (the to-dos) | https://claude.ai/artifact/VDRJvUzYMGr7QXpBsSuM76 | `docs/artifacts/mulwala-tracker.html` |
| Handoff (this doc, styled) | https://claude.ai/artifact/Sni7oWEqdpSgxZvrSzxRFB | `docs/artifacts/handoff.html` |
| Design directions (3 concepts) | https://claude.ai/artifact/5jN92cEqMsxb9TnzLuNpyy | `docs/artifacts/design-directions.html` |
| Classic demo (homepage mockup) | https://claude.ai/artifact/Jj9iKEhASDZ9cJ3zgYgmCx | `docs/artifacts/classic-demo.html` |

Also in **Google Drive → "Mulwala Water website"** folder: Handoff, Phase 3 intake, Insight article
drafts (as Google Docs).

## 9. How to rebuild / keep the project management + to-dos going

The "to-dos on the side" = the **Mulwala site tracker** artifact (pinned in the claude.ai sidebar). It is
a single self-contained HTML page (header, summary stats, filter chips, collapsible sections of items
with copy-to-chat buttons, a shipped log). To continue it on a new computer:

- **To update it** (add/complete a to-do): the new Claude opens the source `docs/artifacts/mulwala-tracker.html`
  (or `Artifact` tool `action:"read"` on the tracker URL to pull the live HTML), edits the item list, then
  **republishes to the SAME url** — `Artifact` `publish` with `url:"https://claude.ai/artifact/VDRJvUzYMGr7QXpBsSuM76"`
  (from a new conversation) — which keeps the same link and the sidebar pin.
- **To rebuild it from scratch** (if ever lost): the source in `docs/artifacts/mulwala-tracker.html` is the
  whole thing — publish it as a new artifact and re-pin. It's styled with the consulting palette/fonts and
  mirrors Laura's other dashboards (aussie glows backlog, Job Search Actions).
- **Item model:** each `<li class="item need|decision|drafted|build">` has a title, description, a
  "where it shows" line, tags, and a `data-copy` fill-in message. Add items by copying an `<li>`.
- Keep the tracker in sync as work lands: when a to-do is done, move it to the Shipped list; when Laura
  supplies an input, wire it into `content/` and tick it off.

## 10. Outstanding to-dos (mirror of the tracker, in text)

**Needs Laura's input** (hidden on the site until provided): booking scheduler URL (`site.bookingUrl` →
`/book`); 2–3 case studies; principal bio (`content/principal.ts`); portfolio relationship/period + logo
permissions; contact named email / phone-hours / LinkedIn (`content/site.ts`); FAQ answers (7, on
`/how-we-work`); playbook play descriptions.
**A decision:** the guarantee on `/how-we-work` — approve/amend/delete (publish by setting
`howWeWork.risk.approved = true`).
**Drafted, waiting on Laura:** six insight articles (`content/insights.ts`, `published:false`; need a
byline). Readable copies in `INSIGHTS-DRAFTS.md` / the Drive doc.
**To build next:** a pure-consulting / advise-only option on the Who We Help pages, and a consulting
equivalent of "Diagnose · Scope · Run · Hand over" on `/how-we-work`.

## 11. First steps for the new Claude

1. Read this file. Confirm branch (`classic` for the current direction), `npm install`, set up
   `.env.local` (§3), `npm run dev`.
2. Skim `content/` and `components/site/`. Open the tracker artifact (§8) for the live to-do list.
3. Continue from §10. Wire Laura's inputs into the right `content/` module — gated sections un-hide
   automatically. Keep the tracker artifact updated (§9).
4. Commit on the working branch with `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
   Laura pushes (Claude couldn't push in the old environment; check whether the new one can).

## 12. Constraints

- **Never recreate brand/company logos in code** — use only user-supplied logo files (in `public/images/logos/`).
- Local Claude memory files do not transfer between computers; their key facts are in this file.

## 13. How we got here (chat history, so the new Claude can pick up)

Chronological arc of the whole project:

1. **Origin.** Started as an accounting/P&L app for a consulting business (reusing the "aussie glows"
   booking framework). Then pivoted: recreate the husband's site **mulwalawater.com** so Laura can manage
   it — unified as ONE Next.js app, public marketing site + the accounting as **`/admin`**.
2. **First live site.** Built the public site + admin, wired integrations (Gmail import, Plaid, Claude
   vision for receipts), added expense categories/sources, real portfolio & advisory logos, hero imagery.
   Went live: Neon Postgres, GitHub, Vercel, GoDaddy DNS + SSL. Removed the Admin link from the footer.
3. **Full rebuild (per a spec).** Decided to rebuild the public site to a detailed brief while keeping
   the original revertible (tag `v1-original`, branch `backup/original-v1`). Built on the **`rebuild`**
   branch: a design system (truss motif, free fonts, palette tokens), restructured Nav/Footer, all content
   moved into typed `content/` modules, and every page (home, how-we-work, who-we-help doors, playbooks,
   about, contact, insights, results, portfolio, privacy) + OG images, breadcrumbs, structured data,
   sitemap, and an 8-question playbook diagnostic.
4. **Positioning override.** Laura corrected the spec's "operating, not advisory" → the firm does **all
   three: advise, operate, invest.** Reworded the site; removed copy that talked down consulting.
5. **Fourth door.** Added **Family-owned** to Who We Help (now four doors).
6. **Phase 3 content.** Wrote an intake worksheet (`PHASE-3-INTAKE.md`) and drafted six insight articles
   (`content/insights.ts`, kept unpublished). Filled the homepage metrics with real figures
   (20+ / 50+ / $5B+ / 2). Removed the how-we-work revenue-floor bullet and the pricing prompt.
7. **Project tracker.** Built the **Mulwala site tracker** artifact (pinned) — the to-dos dashboard,
   mirroring Laura's aussie-glows backlog / Job Search Actions dashboards.
8. **Hide-until-provided.** Switched unfilled sections from visible `⚠` placeholders to being **hidden**
   on the public site until Laura supplies the data.
9. **Launch trim.** Parked `/portfolio`, `/results`, and the four `/playbooks/[slug]` pages under
   `parked/`; made `/playbooks` a single page; removed the newsletter; kept portfolio logos on the home page.
10. **Handoff v1 + Drive.** Created the handoff doc/artifact and saved docs to Google Drive; established
    env-from-Vercel (never transfer `.env`).
11. **Design directions.** Presented three concepts (Harbour / Bridge / Estuary). Laura chose **Bridge
    palette + Harbour fonts** → applied to the `rebuild` build (Space Grotesk + Inter, ink/teal/brass).
    Then: portfolio tiles → white; the bridge **icon** replaced with the real live-logo X-braced truss;
    the large truss (hero backdrop, dividers, phase strip) aligned to the same X-braced + sloped-end shape;
    fixed a button-hover bug (text now stays white on the green button).
12. **CTAs.** "Book a 20-minute call" → the booking flow; added a second CTA **"Send us a note" → /contact**.
13. **Copy pass.** Reworded "Advise"; condensed the "four kinds" cards; renamed "Same, Same but Different"
    → "Channel Expansion"; dropped "thirteen-week" from "Cash First"; replaced the "three things to do
    first" bullet in "The Read"; moved engagement-card bullets to the top; fixed the Mulwala/Lake Mulwala
    wording.
14. **Second version (classic).** Laura wanted to compare the new content in the ORIGINAL site's look.
    Built a classic demo artifact, then decided to do a **full build in the classic design on the
    `classic` branch** (Poppins, teal/navy/white, the real wordmark logo, a photo hero carried across
    every page, original imagery). **Both versions now exist; the Bridge-vs-classic choice is still open.**
15. **Booking embed.** Added the on-site **`/book`** page that embeds a scheduler (Google Appointment
    Schedule / Calendly) from `site.bookingUrl`; all Book buttons route there; added the booking-URL task
    to the tracker.
16. **This evacuation.** Backed everything to GitHub + Drive + artifacts because the working computer is
    failing; wrote this handoff so a new Claude on a new machine continues seamlessly.
17. **New computer (2026-09-25).** Cloned to `C:\Users\lamoo\Projects\mulwala-water`, running on a
    local SQLite test DB until the Neon `DATABASE_URL` is added. Found Vercel env vars are all Secrets
    (can't be pulled) and rewrote §3. Tracker caught up: added the Classic-vs-Bridge decision and the
    later shipped work, fixed the "To build next" count.
