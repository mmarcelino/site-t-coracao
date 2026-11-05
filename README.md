# Tripas-Coração · direct booking site

Premium direct-booking website for Tripas-Coração (Porto short-term rentals). The project brief,
decisions and open questions live in [CLAUDE.md](CLAUDE.md). Read it first.

**Phase 1: visuals only.** All listing, availability and price data is local mock data shaped like
Guesty's. No external APIs are called and nothing is booked or charged.

## Getting started

```bash
corepack enable          # provides pnpm (version pinned in package.json)
pnpm install
cp .env.example .env.local
pnpm dev                 # http://localhost:3000 → redirects to /pt or /en
```

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Route type generation + `tsc --noEmit` |
| `pnpm test` | Playwright smoke + accessibility (axe) tests |
| `pnpm screenshots` | Full-page captures of key pages, PT + EN, at 375/768/1280/1600 → `screenshots/` |
| `pnpm reviews:fetch` / `reviews:apply` | Refresh reviews by hand (normally automatic, see below) |
| `pnpm listings:texts` | List descriptions changed in Guesty that need a PT translation (normally automatic) |

Playwright starts the dev server, or reuses one already on port 3000. On macOS it drives the
installed Google Chrome (Playwright's bundled Chromium no longer supports macOS 13).

## Where things are

```
src/app/[locale]/        pages (internal paths; public localized slugs in src/i18n/routing.ts)
src/components/          layout, booking, listing, home, consent, ui
src/content/             editorial content, PT + EN (buildings, neighbourhoods, FAQ, perks, experiences)
src/lib/data/            the only data entry point for pages (mock now, Guesty later)
src/lib/actions/         server actions used by the booking widget (future Guesty seam)
src/lib/analytics.ts     track() wrapper → Microsoft Clarity (only after consent + project ID)
messages/                UI strings (pt.json, en.json)
public/images/placeholder/  placeholder photos + SOURCES.md
tests/                   Playwright smoke, a11y and screenshot specs
```

## Environment

See `.env.example`. With `NEXT_PUBLIC_CLARITY_PROJECT_ID` empty, analytics is fully off (no script
is loaded). Events log to the console in development.

## Content that refreshes itself

Most of the site reads Guesty directly (photos, descriptions, prices, availability, per-apartment
scores, new apartments) and updates within the hour. Three things are refreshed by a scheduled
GitHub Actions job instead (`.github/workflows/content-refresh.yml` → `scripts/auto-refresh.mjs`),
which commits the changes to `main`; Vercel then publishes them.

| When | What |
|---|---|
| 1st of each month | Airbnb and Booking.com scores, and each apartment's 20 newest top-rated reviews (also the home page's) |
| Every Monday | European Portuguese translations of descriptions the client added or changed in Guesty |

Nothing needs doing for it to run. Good to know:

- **Secrets** (GitHub → Settings → Secrets and variables → Actions): `GUESTY_BOOKING_ENGINE_CLIENT_ID`
  and `GUESTY_BOOKING_ENGINE_CLIENT_SECRET` (a Booking Engine key used only by this job,
  "website-automation") and `DEEPL_API_KEY` (DeepL's free Developer plan).
- **Alerts:** GitHub emails the repository owner if a run fails. A run stops without changing anything
  if Guesty's data looks wrong (far fewer reviews than last time, or a score jumping).
- **Translation credit:** DeepL gives a one-time credit of 1 million characters (several years at this
  site's volume). The run fails, and so emails the owner, once 80% is used: create a new DeepL key or
  switch translator, and update `DEEPL_API_KEY`.
- **Hiding a review:** add its ID (from `src/content/apartment-reviews.json`) to
  `scripts/reviews-rejected.json`; it won't be shown or added again.
- **Run it now:** GitHub → Actions → "Content refresh" → "Run workflow", choosing `reviews` or
  `descriptions`.
- **Undo a run:** revert its commit ("Content refresh: … (automatic)") on GitHub.
