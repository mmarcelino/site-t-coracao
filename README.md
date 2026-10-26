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
