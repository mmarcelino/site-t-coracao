# CLAUDE.md — Tripas-Coração direct booking site

This file is the standing brief for this project. Read it at the start of every session. If something here conflicts with a request, ask before acting.

## 1. The project

**Client:** Tripas-Coração, a Porto-based short-term rental operator (managing local accommodation since 2015). Website today: https://www.tripas-coracao.pt
**What they have:** 40+ apartments (studios/lofts, 1-bed, 2-bed, one 3-bed house) spread across several buildings in central Porto, mostly renovated historic buildings with original façades.
**What we're building:** a new, premium direct-booking website so guests book with Tripas-Coração directly instead of through Airbnb/Booking.com. The flats stay on the OTAs too; the site is an additional (and preferred) channel.

**Audiences**
1. Guests: browsing, choosing a flat, booking direct.
2. Property owners/investors: considering handing their property to Tripas-Coração for management.
3. Guests already booked: looking for tours, experiences and local tips.

## 2. Current phase: visuals first, no integrations

- We do **not** have Guesty credentials yet. **Do not call any external API.**
  - *Branch `api-version-0` (2026-11-04):* Guesty Booking Engine API credentials are in `.env.local`. **Read-only** BE API calls (token, listings, availability, quotes) are allowed, from the server only. Never create reservations or take payment. See the §16 entry of the same date.
- All listing, availability and pricing data comes from **local mock data** that mirrors the shape of Guesty's data (see §6), so swapping in the real API later is a data-layer change, not a UI rewrite.
- Booking UI (date picker, guests, price breakdown, checkout) is built as **non-functional UI**: it should look and behave realistically with mock data, but never take payment or create reservations.
- Placeholder photography comes from the client's current public site (see §8).

## 3. Tech stack

- **Next.js** (App Router) + **TypeScript** (strict)
- **Tailwind CSS**, with design tokens defined as CSS variables
- **next-intl** for i18n (PT + EN)
- **pnpm**
- Hosting target: Vercel (not set up yet)
- No CMS. Listing content will come from Guesty. Editorial content (homepage, buildings, neighbourhoods, FAQ, tours, owners page) lives in the repo as typed content files (TS/JSON/MDX) with PT and EN versions.
- Keep dependencies lean. Ask before adding anything heavy (animation libraries, UI kits, carousels).

## 4. Languages & URLs

- Locales: `pt` (default) and `en`. Every page exists in both. No hard-coded user-facing strings in components; everything goes through the translation layer or locale-specific content files.
- URL pattern: `/pt/...` and `/en/...`, with localized slugs where it helps (e.g. `/pt/apartamentos`, `/en/apartments`).
- `hreflang` alternates and a language switcher that keeps you on the equivalent page.
- The current site also has FR and ES. They are out of scope for now, but don't make choices that make adding locales hard.
- Portuguese copy: European Portuguese (pt-PT), not Brazilian. (The current site mixes both; e.g. use "alojamento", "casa de banho", "hóspedes", "reservar", not "aluguel"/"banheiro".)

## 5. Design direction

**Reference for structure and feel: https://numastays.com/**
We are borrowing Numa's *agency-like* confidence: contemporary grotesk typography, bold editorial layout, a single strong hero with search front and centre, clean location/building cards, a simple "how it works". Inspect it for structure, type scale, spacing and rhythm.

**What we are NOT borrowing from Numa:** discount badges, percentage-off banners, many competing CTAs, busy lifestyle imagery, jokey tone. Numa is mid-market; this client is premium. The aim is *modern and expensive*, not *young and promotional*.

**Principles**
- **Photography carries everything.** Full-bleed images, very little UI chrome. The booking widget stays in view (sticky on listing pages, a compact bar on mobile) without getting in the way.
- **Big and light, not big and bold.** Large headlines in regular/light weights; small-caps or tracked uppercase labels; generous whitespace.
- **Contrast is the idea:** contemporary type against old stone, tiles and restored interiors. The buildings provide the "heritage"; the UI stays modern.
- **Restrained palette:** neutrals drawn from the buildings (granite grey, limestone, warm off-white, near-black), plus one accent used sparingly (e.g. a muted azulejo blue). Define as tokens.
- **Calm motion:** slow fades and subtle reveals only; respect `prefers-reduced-motion`.
- **Copy says "why this place,"** not just bed counts. A line about the building's history beats an amenities list. Specs exist, but below the story.
- **Book direct, framed as hospitality:** best rate guaranteed, flexible cancellation, a welcome gift, a local concierge/WhatsApp contact, early/late check-in when possible. Present as perks, not as discounts.

**Trust signals** (guests moving off Airbnb/Booking need reassurance that booking direct is safe):
- **Reviews and scores:** an overall rating block (Google now; Airbnb and Booking.com scores later via Guesty, whose Booking Engine API exposes them) on Home, plus per-apartment reviews on the detail page. Show source, score, review count and a few short real-feeling excerpts; never invent reviews for production. Mock reviews must be clearly marked as mock in the data.
- **WhatsApp as concierge:** the client already runs on WhatsApp (+351 962 708 740). Present it as a premium "Talk to our Porto team" / "Fale com a nossa equipa" contact: in the header or nav, on apartment pages next to the booking widget, in the footer, and on the owners and experiences pages. No generic green floating bubble; style it to match the design system. Use a `wa.me` link with a prefilled, page-aware message (e.g. which apartment the guest is looking at), localized PT/EN.
- **Reassurance near the booking widget:** secure payment, the company's real address in Porto, years operating (since 2015), cancellation policy summary, and the licence number. Keep it quiet and compact.

**Fonts:** use a contemporary grotesk similar in spirit to Numa's. If Numa's typeface is commercial/custom, do not copy its files; propose 2–3 freely licensed alternatives and ask before choosing. Self-host via `next/font`. **Decided: Hanken Grotesk (OFL)**, a free stand-in for Numa's commercial Lausanne.

**Design tokens (implemented in `src/app/globals.css`, `@theme`):**
- Colour: paper `#f6f3ee` (page), sand `#efe9e0`, limestone `#e4dccf`, stone `#cbc2b4` (rules only), granite `#67645f` (secondary text), granite-light `#a39e96` (secondary text on ink), ink `#1b1a18`, azulejo `#2e4a72` (the one accent: links, focus, today, demo tags). Contrast pairs are documented in the CSS; granite on limestone fails AA for small text.
- Type: fluid scale `text-display` (44→112px, weight 300), `text-h1`, `text-h2`, `text-statement`, `text-h3`, `text-lead`, `text-body` (17px), `text-small`, `label` (12px, uppercase, 0.16em tracking). Headings default to weight 300.
- Spacing: `--gutter` (20→48px), `section-y` (80→160px), `section-y-tight`; `container-page` max 96rem.
- Motion: `--ease-soft`, 200/600/1000ms; `reveal` uses CSS scroll-driven animation (no JS, nothing hidden without support); overlays use `animate-fade-in-fast`; all motion off under `prefers-reduced-motion`.
- Buttons: square, `buttonClasses(variant, size)`. No class merging is installed, so never pass display/height overrides; use a `size` and wrap for responsive visibility.

## 6. Data model (mock now, Guesty later)

Single data-access layer in `src/lib/data/` with functions like `getListings()`, `getListing(id)`, `getBuildings()`, `getQuote(...)`. Pages and components only ever call these functions, never raw data files, and later never Guesty directly.

- **Listing** (mirrors Guesty listing fields; verify against Guesty's Open API docs when access arrives): id, title, nickname, propertyType, accommodates, bedrooms, bathrooms, areaSqm, address/neighbourhood, pictures (url, caption), description (summary, space, neighbourhood, notes), amenities, base price + currency, buildingId.
- **Building** (our own content, not in Guesty): id, name, neighbourhood, short history line, longer story, year/era, hero image, list of listing IDs.
- **Neighbourhood** (our own content): slug, name, intro, what's nearby, guide entries, map coordinates.
- **Quote** (mock): nights, nightly breakdown, cleaning fee, city tourist tax, total; shaped like Guesty's Booking Engine API quote so the UI is ready.
- **Review** (mock now, Guesty/Google later): source (google | airbnb | booking), rating, author first name, date, language, text, listingId (optional). Plus an aggregate per source (score, count).

Later integration notes (not for now): Guesty Booking Engine API for quotes and reservations; payments tokenized via GuestyPay or Stripe-through-Guesty (TBC with client); listing pages pre-rendered and revalidated, with live calls only for availability/quotes/checkout; guests can't modify/cancel via the BE API, so "manage booking" will be a contact flow.

## 7. Site map (v1)

1. **Home** (revised 2026-10-26, in this order):
   1. Hero: full-bleed photo (or slow video) of one of the buildings, one short headline, search (dates, guests) on it. No other CTAs. The whole hero stays above the fold.
   2. Intro line: one or two sentences on who they are (restored historic buildings, local team since 2015), before anything is for sale.
   3. Collections: 4 featured (for two, for families, by the sea, with outdoor space) + "See all" → apartments page with tag pills and filters.
   4. Why book direct: four perks with small icons (best rate, flexible cancellation, welcome gift, local concierge). Early, because it's the main business goal.
   5. Reviews: aggregate scores (Google now; Airbnb and Booking.com later) + 3–4 short excerpts.
   6. How it works: compact 3 steps (book direct, self check-in, WhatsApp concierge).
   7. Experiences: horizontal strip of partner tours, linking to the full page.
   8. FAQ excerpt: check-in, luggage, cancellation, tourist tax, long stays, lifts; link to full FAQ.
   9. Footer: contact, WhatsApp, address, social, language switch, legal, Livro de Reclamações, licence numbers.
   (Neighbourhoods and owners are no longer on the home page; they get their own pages.)
2. **Apartments**: listing grid with filters. Built: collection tags (`?tag=a,b`, multi-select: homes in any chosen collection), building (`?building=<slug>`, a dropdown next to list/map), guests and dates from the home search (capacity + availability); different filters combine with "and"; an empty result offers one-tap "Remove …" fixes with counts. Still to add: neighbourhood, type.
3. **Apartment detail**: gallery, story line about the building, key facts, description, amenities, location/neighbourhood, house rules, sticky booking widget with mock price breakdown, related flats in the same building.
4. **Buildings**: one page per building with history, photos, its flats.
5. **Neighbourhoods**: index + one page per neighbourhood (local guide: eat, drink, see, practical tips). Important for SEO and premium feel.
6. **Experiences / Tours**: partner experiences in and outside Porto (see §9), plus a "help me plan" request form (UI only for now) and the guest portal / digital guidebook explainer.
7. **For owners** (`/pt/gestao-alojamento-local` / `/en/property-management`): management services for owners/investors (see §9), with a lead form (UI only).
8. **About**
9. **FAQ**: full page, grouped by topic (see §10).
10. **Contact**
11. **Legal**: Terms, Privacy, Cookies.
12. **Book direct / checkout**: UI only, mock flow ending on a clearly-marked demo confirmation. When building it: put the booking card's reassurance (secure payment, cancellation, "since 2015, 6 000+ guests a year") beside the payment step, where guests leaving Airbnb need it most.

**Footer must include:** contact (phone, email, address, WhatsApp), social links, the **Livro de Reclamações** link (legally required in Portugal), and space for the AL licence numbers.

Keep the existing site's URLs in a redirect map (`redirects.ts`) so SEO isn't lost at launch, e.g. `/pt/listwithus`, `/short-term-rental-management-porto`, `/pt/experiences-your-guest-portal`, `/pt/faqs`.

## 8. Placeholder imagery

- Photos are taken from the client's own public website and booking pages (tripas-coracao.pt, tripasapartments.guestybookings.com) as placeholders only.
- Store in `public/images/placeholder/` and record every image in `public/images/placeholder/SOURCES.md` (local filename → original URL → where it's used).
- Always use `next/image` with explicit sizes; write meaningful alt text in both languages.
- Final, high-resolution originals will come from the client. Don't optimise art direction around low-res placeholders.

## 9. Content to carry over from the current site

**Owners page.** Services in six steps: (1) feasibility analysis, (2) registration & licensing, (3) property setup (interiors, photography, listings), (4) daily operations (guest comms, cleaning, maintenance, on-site issues), (5) revenue management (dynamic pricing, reviews), (6) investor relations (reviews, reporting, transparency). Positioning: Porto-based since 2015, a limited number of properties, "we don't manage properties, we manage assets." Two audiences: owners already operating with inconsistent results, and owners considering short-term rental for the first time. Rewrite in the new voice; keep the substance. When building it: show "since 2015, 6 000+ guests a year" (`site.guestsPerYear`) near the top, as proof of operating scale for investors.

**Experiences page.** Inside Porto: food walking tour, private Douro boat trip, Portuguese cooking class, hop-on hop-off, Matosinhos surf, private yacht cruise, bike/e-bike/Segway/tuk-tuk tours. Outside Porto: Douro Valley wine tour, Aveiro & Coimbra day tour, Braga & Guimarães day tour. Plus: a "help me plan" form (name on booking, email, guests, dates, experience, private/shared, message), the digital guest portal, a curated Google map, and Viator recommendations. Model experiences as a typed content file (title, partner, category inside/outside Porto, price-from, duration, image, PT/EN copy).

All copy should be **rewritten** for the new premium voice, not pasted.

## 10. FAQ, SEO and AI discoverability

- FAQ content lives in one typed source and is reused: full FAQ page + relevant excerpts on home, apartment, owners and experiences pages.
- Answers are direct and self-contained (first sentence answers the question), written so a search engine or AI assistant can quote them accurately.
- Render as real HTML (not hidden behind JS-only accordions; `<details>` is fine) and add **`FAQPage` JSON-LD**.
- Other structured data: `LodgingBusiness`/`Organization` for the company, `Apartment`/`VacationRental` (or `LodgingBusiness` + `Offer`) for listings, `BreadcrumbList`, `TouristTrip` for experiences.
- Per-page metadata, Open Graph images, `sitemap.xml` with hreflang, `robots.txt`, and an `llms.txt` summarising the business, apartments, neighbourhoods and FAQ. AI crawler allow/deny is a client decision; leave a clearly marked placeholder.
- Suggested FAQ topics: booking direct vs OTAs; check-in/out times and self check-in; luggage storage; parking; cancellation; payment; tourist tax; long stays (weeks/months); families and cots; accessibility/lifts (historic buildings often have none, so be honest); pets; airport transfer; cleaning during stay; Wi-Fi/remote work; owners: fees, contract, licensing, reporting.

## 11. Analytics, conversion tracking & consent

The site's main business goal is shifting bookings from OTAs to direct, so we must be able to measure it.

- **Tool: Microsoft Clarity**, using the client's existing account. We don't have access yet: read the project ID from `NEXT_PUBLIC_CLARITY_PROJECT_ID` and do nothing if it's empty (no errors, no script). Add it to `.env.example`.
- **One analytics wrapper** (`src/lib/analytics.ts`) with a typed `track(event, props)` function. Components call the wrapper, never Clarity directly, so adding another tool later (e.g. GA4 or Plausible) is a one-file change. In development, log events to the console instead.
- **Conversion events** (send as Clarity custom events/tags):
  - `search_submitted` (dates, guests)
  - `listing_viewed` (listingId, buildingId)
  - `booking_widget_opened`, `dates_selected`, `quote_viewed`
  - `checkout_started`, `booking_completed` (the latter fires on the mock confirmation for now)
  - `whatsapp_clicked` (page, listingId)
  - `owner_lead_submitted`, `experience_request_submitted`
  - `language_switched`
- **Cookie consent:** a custom, on-brand consent banner (PT/EN), with "accept" and "reject" equally prominent and a way to reopen preferences from the footer. Load Clarity only after analytics consent, and pass consent status through Clarity's consent API (check Microsoft's current docs; Clarity requires consent signals for EEA visitors).
- **Privacy in recordings:** Clarity records sessions. Mask all form inputs and anything personal (checkout, owner lead form, experience request form) with Clarity's masking attributes, and keep its masking mode strict on checkout pages.
- Update the Privacy and Cookies pages' placeholder copy to mention Clarity.

## 12. Visual self-checking with Playwright

Set up Playwright (dev dependency) early and use it to check your own visual work before handing it over.

- A script (e.g. `pnpm screenshots`) that starts or reuses the dev server and captures key pages in both locales at **375px, 768px, 1280px and 1600px**, full-page, into `screenshots/` (git-ignored).
- After any visual change, run it, **look at the screenshots yourself**, fix obvious issues (overflow, broken layout, awkward line breaks, contrast, images not loading, sticky widget overlapping content), then summarise what you checked.
- A small set of smoke tests: each page renders in PT and EN without console errors, language switch keeps the equivalent page, booking widget opens and shows a mock quote, consent banner appears and both choices work.
- Add basic automated accessibility checks (e.g. `@axe-core/playwright`) on key pages.

**Temporary rule: visual-direction phase (from 2026-10-26, until the client approves the look).** Speed over completeness while exploring design:
- Per round, only: `pnpm typecheck` + a few targeted screenshots of what changed (desktop + mobile, one locale), saved **outside the project** (session scratch folder), reviewed, then **deleted** once no longer needed. Nothing is left in `screenshots/` during this phase.
- Skip until the direction is approved: full test/a11y suite, full screenshot matrix, production builds, detailed CLAUDE.md/SOURCES.md logging (one short line at most), multiple polished commits (one commit per round is enough).
- When the look is approved, and always before merging to `main`: one full pass (lint, typecheck, `pnpm test`, `pnpm screenshots` at all widths and both locales, a11y fixes, CLAUDE.md + SOURCES.md up to date). Then this rule is removed and §12–§14 apply in full again.

## 13. Quality bars

- Mobile-first; test at 375px, 768px, 1280px, 1600px+.
- Accessibility: WCAG 2.2 AA, semantic HTML, keyboard-navigable date picker and gallery, visible focus, colour contrast checked against the palette.
- Performance: aim for green Core Web Vitals; LCP image prioritised; no layout shift from images or fonts.
- Server Components by default; client components only where interaction needs it.
- Run `pnpm lint` and `pnpm typecheck` (and tests where present) before saying a task is done.

## 14. How to work in this repo

- **Ask before:** adding dependencies, changing the stack, changing the data model shape, or making a design-direction call not covered here.
- **Small, reviewable steps.** Explain what changed and why in a few lines. Commit with clear messages; never commit secrets.
- **Show, don't describe:** after visual changes, run the Playwright screenshots (§12) and review them before saying the work is done.
- **Keep this file current.** When a decision is made (fonts, palette, client answers), update the relevant section and the log below.
- `.env.example` lists every variable the app will need (Guesty keys etc.) with dummy values. Real values only in `.env.local`, never committed.

## 15. Open questions (update as answered)

- [ ] Access to the client's Microsoft Clarity account / project ID
- [ ] Reviews: client's OK to reuse Airbnb/Booking.com reviews (and first names) on the site; confirm the Google figure (4.9 / 516, read by hand 2026-10-30)

- [ ] Final brand name/logo treatment for the new site (keep "Tripas-Coração"?)
- [ ] Exact number of apartments and buildings, and the building/flat mapping (site says 41–42; brief says 50+). *Research 2026-10-26: the public Guesty booking site lists 42 listings across ~10 street addresses (see §16); client to confirm.*
- [ ] Payment method: GuestyPay or Stripe through Guesty? (Architecture decided 2026-11-04, see §16; only the provider is open.)
- [ ] Rate plans (live quotes show Daily "semi_moderate" = free cancellation until 5 days before, Early Book −10% "strict" = 60 days, Non-Refundable −10%): checkout now lets guests choose between them (since 2026-11-04), most flexible preselected; options a more flexible one beats on price are hidden. Confirm the preselection (most flexible vs cheapest). Guesty's Daily plan (5 days) confirms the client's terms; the site's "14 days" copy is wrong.
- [ ] Booking-engine price markup: a live quote charged 188 €/night where Guesty's own daily rate was 150 € (~25% more). Intended (set on the BE API instance), or to remove?
- [x] Instant booking or inquiry-first? **Both** (2026-11-04): guests can book instantly or request to book. BE API keys are set to "both".
- [ ] Book-direct perks the client is happy to commit to
- [x] Taxes/fees (incl. Porto tourist tax) configured in Guesty? Yes: live quotes include "City Tax" (3 € × guests × nights, 2026-11-04).
- [ ] Keep the luggage storage page/service?
- [x] Allow or block AI crawlers? **Allow** (2026-11-05): `src/app/robots.ts` names the AI crawlers as allowed; `/llms.txt` summarises the site for them.
- [ ] High-res photography and building history material from the client
  - Photography needed to show the interiors well (branch `showcase`): the high-res originals (current placeholders are compressed listing photos), plus a short detail shoot per building: furniture, textiles, materials (tiles, granite, timber), light on surfaces; consistent warm, bright grading. Home collection photos (wide + detail) are set in `src/content/collections.ts`.
- [ ] **Accessibility gap (hero slideshow, branches hero-lunevar/ahotels):** no visible pause control (client request); it pauses on booking-box hover/focus, hidden tab and reduced motion, but WCAG 2.2.2 expects an explicit control. Resolve before launch.
- [ ] AL licence numbers per property (10 known from Guesty, see `src/content/site.ts`)
- [ ] **Copy/facts flagged TO CONFIRM in the code** (search for `TO CONFIRM`, `INVENTED`, `toConfirm: true`, `mock: true`):
  - Cancellation terms used in copy: "free cancellation up to 14 days before arrival" (perks, FAQ, reassurance). **Conflicts with the client's published terms** (5 days short stays / 30 days for 1 month+), which the new Terms page follows (2026-11-04); tourist tax: their terms say paid at check-in, Guesty includes it in the total
  - **Legal pages must be reviewed by the client before launch** (`src/content/legal.ts`; no draft note on the pages, by choice): rewritten from the client's current pages for the new site; company name/NIF, payment provider and retention periods to confirm
  - Book-direct perks wording, incl. "find it for less and we'll match it", welcome gift contents
  - FAQ answers for luggage storage, mid-stay cleaning, airport transfer, payment provider, owner fees
  - Building eras (`era`), lifts at Breiner 210 and São Bento, floor areas (`areaSqm`) for all 10 flats
  - Reviews: quotes and scores are real (see 2026-11-05 in §16); the scores are a hand-refreshed snapshot
  - Registered company name for legal pages / JSON-LD
  - Live Guesty data (2026-11-04): neighbourhoods given to the six new buildings; Guesty data errors to fix in Guesty: implausible areas (Taipas 1º 40 sq ft, Sta Catarina T2-2º 150 sq ft, Sá da Bandeira II balc. 60 sq ft), "Sta Catarina T2 - 1º" has 3 bedrooms in Guesty; PT copy for the 32 homes without editorial content (Guesty's text is English and OTA-toned)

## 16. Decision log

- 2026-10-26: Next.js + TypeScript + Tailwind + next-intl; PT/EN; no CMS; visuals first with mock data; Numa-inspired agency look adapted to a premium, heritage context.
- 2026-10-26: Analytics via the client's Microsoft Clarity behind a consent banner and a single analytics wrapper; reviews + WhatsApp concierge as core trust signals; Playwright for screenshots, smoke and a11y checks.
- 2026-10-26 (milestone 1 build decisions):
  - **Stack versions:** Next 16.4 (App Router, Turbopack, Cache Components + Partial Prefetching on), React 19.3, Tailwind 4.3, next-intl 4.14, TypeScript strict + `noUncheckedIndexedAccess`, pnpm 12 via Corepack.
  - **i18n:** locale is a root param (`app/[locale]`, read via `next/root-params`); localized slugs in `src/i18n/routing.ts`; `src/proxy.ts` (Next 16's renamed middleware) does detection/redirects. We do **not** use `next-intl/plugin`: it eagerly loads `@swc/core`, whose binary doesn't run on macOS 13; `next.config.ts` sets the `next-intl/config` alias by hand. Number/date formatting goes through `src/lib/format.ts` (maps `pt`→`pt-PT`, `en`→`en-GB`; bare `pt` formats as Brazilian, e.g. "€ 60").
  - **Cache Components rules we follow:** dynamic `params`/`searchParams` sit under `<Suspense>`; nothing in a server render reads "now" (calendar/today only computed client-side after interaction); consent is read client-side so pages stay static.
  - **Date picker:** `react-day-picker` v10 (approved). Analytics: `src/lib/analytics.ts` + consent provider; Clarity loads only after consent and when `NEXT_PUBLIC_CLARITY_PROJECT_ID` is set; uses Clarity Consent API v2 (`consentv2`), and `consent(false)` on withdrawal.
  - **Mock data:** built from a trimmed snapshot of the client's **public** Guesty booking site (`src/lib/data/mock/guesty-listings.snapshot.json`, 10 listings: real titles, addresses, capacity, base prices, fees, amenities, licences, review aggregates). Our editorial layer (`src/content/listings.ts`, `buildings.ts`, `neighbourhoods.ts`) adds slugs, PT/EN copy and photo order. Mock set: 4 buildings (Mouzinho 32, Cordoaria, Breiner 210, São Bento) and 3 neighbourhoods (Ribeira, Baixa & São Bento, Cordoaria & Cedofeita). Availability and quotes are deterministic mocks; quotes are built in Guesty Booking Engine shape and mapped by `fromGuestyQuote()`.
  - **Data model addition:** `Building.storyImage` (detail photo for a building story block; no longer shown on apartment pages since 2026-11-03, kept for the building pages).
  - **Booking UI seam:** the widget calls server actions in `src/lib/actions/booking.ts` (`requestQuote`, `requestBlockedNights`); these become the Guesty calls later.
  - **Phasing:** nav links to pages from later milestones render the localized 404 ("this page doesn't exist yet"). A lean `/apartments` index exists so the home search has somewhere to land.
  - **Playwright:** bundled Chromium doesn't support macOS 13, so on macOS the config uses the installed Google Chrome (`channel: "chrome"`); Linux/CI uses the bundled browser.
- 2026-10-26 (**experiment, branch `numa-like` only**): client asked for Numa's bold agency look ("approach #2: full Numa"), which overrides §5's "big and light, not big and bold" on that branch. Changes: headings weight 600 with poster scale (`text-display`/`text-mega`/`text-h1`/`text-h2` enlarged), signature colour block `wash` `#cddcef` (text on it: ink or `ink-soft-text`, never granite), `azulejo-bright` hover accent, pill buttons, rounded cards (`--radius-card`/`--radius-tile`), ↗ arrows. Home adds Numa devices: search pill pinned under the header on desktop, scroll-darkening statement lines, giant typographic building list with hover photo, "Why book direct" stacked sticky cards, owners block with the six services as tiles (`src/content/owners.ts`), neighbourhood "story" cards, wash footer with a giant wordmark. If adopted, update §5 principles accordingly; if not, `main` keeps the light direction.
- 2026-10-26 (`numa-like` refinement): home restructured to the 9 sections in §7.1; **white page background** (`paper` = `#ffffff`; `sand` is now a neutral mist `#f3f4f5`, no beige). Collections are driven by **listing tags** (data model addition `Listing.tags`: `couples | families | sea | outdoor | views | remote-work`; `sea/outdoor/views` are editorial `features` in `src/content/listings.ts`, the rest derived from Guesty fields) and defined in `src/content/collections.ts`. Added the client's **Casa do Farol** villa (Foz, 3-bed house for 6, licence 167338/AL, Guesty 10/10 from 32 reviews) from the public Guesty page, with building + new **Foz do Douro** neighbourhood; its tram/façade photo is the hero. Home perks are 4 (early/late check-in kept in `perks.ts` for later pages). "Self check-in" in How it works is TO CONFIRM (Guesty copy says some arrivals are met in person). Experience cards are colour tiles until per-tour photos exist.
- 2026-11-02 (branch `showcase`, client request): booking-widget reassurance is secure payment, cancellation and "since 2015" only (no address or licence line); the AL licence number stays on each apartment page as one quiet line (legally required in advertising); since 2026-11-03 it closes the home's own content, after its reviews (before "More homes" and the FAQ, which are generic), and the no-lift note is a plain icon line in "The building" row (no tinted box), not under the house rules.
- 2026-11-03 (branch `showcase`): **text colour rule**: anything read as a sentence (card descriptions, intros, FAQ answers, taglines) is ink; granite only for small facts and UI (prices, counts, locations, dates, captions, helper text, placeholders, legal lines). Refined 2026-11-03 on the apartment page: **ink = anything you read as content** (headings, sentences, values such as facts, chosen dates, prices, amenity and place names, the reassurance lines) and icons take the colour of their text; **granite = labels and metadata only** (uppercase labels, a note attached to a value like walk times, "per night", "max 4 guests", review counts, placeholders, helper and legal small print). On colour blocks everything is ink.
- 2026-11-03 (branch `showcase`, apartment page, revised same day): Share is an icon + underlined text link running inline after the title's last word (icon alone on phones), never on the photos (system share sheet, else copy link); key facts are one row between hairlines, icon + self-describing text ("2 guests", "1 bathroom", "3rd floor, no lift"); the apartment comes first (summary and `description.space` as two body paragraphs; three type styles only in this block: eyebrow, title, body; `highlights` not shown, they repeat the summary), and the building is one quiet row in the details' rhythm (no colour block, no photo); the booking card is one field group (dates row + guests row with −/+), the rating top right linking to #reviews, WhatsApp and reassurance inside the card under a hairline; reviews follow the details as a grid of three (`ReviewList` with `listingId`; "Show more reviews" adds three at a time) with no rules or boxes, quotes at body size with the home page's inline “ ” marks (`ReviewCard size="md"`), score in the header; then "More homes at…" as a mist band, linked from the building block; address leads the Location section; reassurance reads "Since 2015, hosting 6 000+ guests a year" / "Desde 2015, com mais de 6 000 hóspedes por ano" (client-confirmed figure, `site.guestsPerYear`).
- 2026-11-03: **thousands are always grouped from 1 000, with a non-breaking space in both locales** ("6 000", "1 200 €"; no commas, client's choice). `format.number`/`format.money` force it (en-GB would use commas, pt-PT alone leaves 4-digit numbers bare); numbers typed into content files follow the same rule with `\u00a0`. Pass numbers to translations already formatted (strings), never raw: next-intl would format them as bare `pt`.
- 2026-11-03 (branch `showcase`): prices always read "60 €" (symbol after the number) in both locales, via `format.money`. Footer stays the compact ink panel: wordmark + three columns on one line grid, social as bare icons in the bottom row, bare WhatsApp icon, underline only on the credit, plus a discreet "Made by MM" credit.
- 2026-11-03 (branch `showcase`): page changes cross-fade (React `<ViewTransition>` in `app/[locale]/template.tsx`, fade only); the sticky header has no shadow, an ink/15 hairline (same as the booking box outline) fades in once the page scrolls (`.header-rule`, CSS scroll-driven); the 404 has no number: closed-door photo, one line, "See the apartments" + a quiet link home, fitting one screen.
- 2026-11-03: production served a stale `globals.css` from Vercel's Turbopack build cache (no hero glass, old uppercase `h3`, old heading weights; second time after 2026-11-02). Three fixes: Tailwind now runs through the standard `@tailwindcss/postcss` plugin (`postcss.config.mjs`) instead of the custom `@tailwindcss/turbopack` loader, the likely cause, also of the dev server going stale; `vercel.json` deletes `.next/cache/turbopack` before every build; and `.github/workflows/check-deploy.yml` runs `pnpm check:deploy` after every production deployment (on Vercel's commit status; also a manual "Run workflow" button), comparing the live CSS with a fresh build of the same commit (red ✗ + email on mismatch); it only runs once it's on `main`. Run it by hand with `pnpm check:deploy <deployed-url> <fresh-build-url>`.
- 2026-11-05 (branch `api-version-0`): **reviews are a fixed, hand-picked set, not a live feed** (client's choice): the home page draws its 30 quotes from the apartments' own (the strongest of the last 3 months, one per flat, newest first; `homeSelection()` in `src/lib/data/reviews.ts`), so every refresh updates it; scores are a snapshot of every review in Guesty that day (Airbnb 4.9 / 4 714, Booking.com 9.1 / 4 301) plus Google by hand; refresh by hand every few months. Fetching the whole history live (~90 requests) hit Guesty's rate limit. Apartment pages show the flat's own reviews (revised same day): up to 20 per flat, newest first (823 in all, `src/content/apartment-reviews.ts`), English first with small typos corrected, then other languages translated (`language` field; captions read "Translated from French" / "Traduzido do francês"), under the flat's live Guesty score; 6 flats have fewer than 20 good ones. **Refresh every ~3 months:** `pnpm reviews:fetch` (downloads all Guesty reviews with the dev key, pre-selects new candidates, recomputes Airbnb/Booking.com scores into `.next/cache/reviews/`), then a session reads the candidates and writes `decisions.json` (corrected EN, PT-PT, or DROP), then `pnpm reviews:apply` merges them (20 newest per flat), records drops in `scripts/reviews-rejected.json` and updates `src/content/review-scores.json`. Data: `src/content/apartment-reviews.json`. All mock reviews removed.
- 2026-11-05 (branch `api-version-0`): **AI assistants can read the site**: `robots.ts` (all crawlers allowed, AI ones named; checkout disallowed), `sitemap.ts` (both locales, hreflang), `/llms.txt` (business, homes by building, neighbourhoods, FAQ; built from the data; TO CONFIRM answers and prices left out). **Apartment URLs always follow the Guesty title** (also the 11 curated homes); earlier slugs live in `formerSlugs` (`src/content/listings.ts`) and redirect permanently; add the old slug there when a listing is renamed. **Nearby walks are per building**: computed from the building's Guesty coordinates to the landmarks in `src/content/landmarks.ts` (×1.35 detour, 75 m/min; estimates, TO CONFIRM).
- 2026-11-05 (branch `api-version-0`, revises 2026-11-04): **apartment descriptions in PT-PT**: Guesty's summary and "space" text stay English on `/en`; `/pt` shows our PT-PT translation (`src/content/listing-translations.json`, stored with the English it came from). If the client edits a description in Guesty, that home shows the new English until it's translated again; `pnpm listings:texts` lists new/changed descriptions, `pnpm listings:texts apply` stores translations from `.next/cache/listings/translated.json`. Run it with the quarterly reviews refresh. Titles stay as in Guesty (they also make the URLs).
- 2026-11-05 (branch `api-version-0`): **neighbourhoods regrouped** ("Baixa" covered almost everything): São Bento & Ribeira (Mouzinho 32, São Bento), Clérigos & Cordoaria (Cordoaria, Clérigos, Taipas 47), Cedofeita & Galerias (Santa Teresa 40, Breiner 210), Aliados & Bolhão (Almada 505, Sá da Bandeira 198, Santa Catarina), Foz (Casa do Farol). Grouped from the buildings' real coordinates (5–8 min apart within a zone); copy in `src/content/neighbourhoods.ts`.
- 2026-11-01 (branch `showcase`): apartments page gets a map view (`?view=map`) with **Leaflet** (approved dependency) and OpenStreetMap's standard tiles, muted to greys in CSS (dev only: OSM's tile policy is for light use; image requests only, no cookies). Swap to a styled provider with a key at launch via `NEXT_PUBLIC_MAP_TILES_URL`. Mention the map provider in the Privacy page.
- 2026-10-26 (research, not yet decisions): Numa uses **Lausanne** (commercial, Weltkern), 300/600 weights, ~100px H1 with negative tracking, so we will not copy it; free alternatives proposed. The public Guesty booking site (`tripasapartments.guestybookings.com`) exposes 42 real listings with titles, addresses, coordinates, capacities and long descriptions. Buildings inferred from addresses: Mouzinho da Silveira 32, Rua das Taipas 47, Cordoaria (Campo Mártires da Pátria 27/103), Sá da Bandeira 198, São Bento (Praça Almeida Garrett 24), Santa Catarina (Rua da Firmeza 410), Rua do Almada 505, Rua do Breiner 210, Rua de Santa Teresa 40, plus an oceanfront villa at Passeio Alegre (Foz). Many units have no lift. The current site's header shows placeholder contact details (555-555-5555, mymail@mailservice.com); the real ones are in the footer: +351 962 708 740, ola@tripas-coracao.pt, Rua do Breiner 208, 4050-124 Porto.
- 2026-11-04 (branch `api-version-0`): real data comes from Guesty's **Booking Engine API only**. **No Open API key**: it has a single all-account scope (every reservation, guest personal data, owner finances, write access); revisit only if the BE API lacks something, as a separate server job. Don't connect Guesty's MCP server either. Keys (max 5 BE API instances per account): the client's existing "Tripas-Coração" instance (42 properties, used by something of theirs) is **left untouched**; we add `website-dev-mariana` (local `.env.local` + Vercel Preview, all 42 properties, booking option "both") and, at launch, `website-production` (Vercel Production only, Sensitive). Base URL `https://booking.guesty.com/api` (verified 2026-11-04; the `booking-api.guesty.com/v1` host in Guesty's newer quick start doesn't resolve), token at `https://booking.guesty.com/oauth2/token`. Delete the dev key when Mariana's involvement ends or immediately if exposed. Secrets live only in `.env.local`/Vercel and a password manager, never in chat, code, logs or `NEXT_PUBLIC_*` vars. Guesty calls are server-only; tokens (3 per 24h per key, valid 24h) must be cached; mock data stays as the fallback when keys are missing; checkout stays a demo until payments are decided.
- 2026-11-04 (branch `api-version-0`, live availability and prices): the date picker uses Guesty's calendar (`GET /listings/{id}/calendar`, no prices in it); the apartments date search uses one dated search (`GET /listings?checkIn&checkOut`, returns bookable listings with `nightlyRates`); the widget shows a real Guesty quote (`POST /reservations/quotes`: valid 24 h, verified not to block nights, no reservation created), the most lenient rate plan, mapped so the lines always add up to Guesty's total. "From" prices (cards, collections, widget) = lowest bookable nightly rate in the next 120 days, sampled from back-to-back 3-night searches (40 calls, throttled to ≈4/s, cached for hours; base price if none). All cached with `use cache`; mock fallbacks when keys are missing. Collections: hand-assigned `views`/`outdoor`/`sea` for the 32 new homes are in `listingFeatures` (`src/content/listings.ts`, TO CONFIRM; Juliet balconies don't count as outdoor).
- 2026-11-04 (branch `api-version-0`, **token store**, decided): Guesty tokens are shared through **Upstash Redis** (Vercel Marketplace, free tier; client chose it over Next's built-in remote cache, which resets on every deploy). Plain `fetch` to Upstash's REST API, no new dependency (`src/lib/data/guesty/token-store.ts`); keys namespaced by a hash of the client ID; a 30 s lock means only one instance asks Guesty while others wait. Env: `KV_REST_API_URL`/`KV_REST_API_TOKEN` (set by the integration). Without them: memory only (dev: the token file). Guesty 429s are retried with backoff (parallel build workers). The slow Guesty results (listings list, "from" prices) are also shared through Upstash (`shared-data.ts`: fresh 1 h / 6 h, one instance refreshes under a lock while others serve the stale copy; `use cache` alone is per instance on Vercel, which made the apartments page and its filters time out on the first preview, 2026-11-04). Keys: `website-dev-mariana` (local), `website-preview` (Vercel Preview, created 2026-11-04), `website-production` (at launch). **Don't run `pnpm build` locally with real keys**: build workers don't share the dev token file, so each may spend a token.
- 2026-11-04 (branch `api-version-0`, **checkout demo**): `/pt/reservar` / `/en/checkout?listing=<slug>&checkIn&checkOut&guests`, reached from "Reserve" by a full page load. Live Guesty quote in a summary card (first on phones, sticky beside the form on desktop); three steps (your details, payment placeholder where the provider's secure fields will go + the reassurance lines, consent); `noindex`. The form sends nothing anywhere: submit only validates and shows a clearly marked preview confirmation (`booking_completed` with `mock: true`). Stale links show a "check those dates again" page. Client questions for the next phase are in a shared doc (Claude Docs, "Novo site Tripas-Coração: questões para a equipa").
- 2026-11-04 (branch `api-version-0`, **rate choice at checkout**): every Guesty rate plan in the quote becomes a `RateOption` (own total, `freeCancellationUntil` = check-in minus Guesty's policy days: flexible 1, semi_flexible 2, semi_moderate 5, moderate 7, firm 14, semi_strict 30, strict 60, super_strict 90; unknown policy or "non-refundable" name = non-refundable; a passed deadline = non-refundable). Checkout step 1 "Your rate" picks one (summary and reassurance follow it); the widget's reassurance shows the default rate's real terms once priced. The checkout page calls `connection()` (it reads today's date).
- 2026-11-04 (**payments**, decided): payments go through Guesty (GuestyPay or Stripe connected to Guesty, client to choose). Card details are typed into the provider's own secure fields and go straight to the provider, never to our server; the site only passes Guesty the payment token (`ccToken`, Stripe `pm_…` tokens only) to create the booking. The client is the merchant: refunds, chargebacks and payouts sit with them and the provider. **Checkout pages run no third-party scripts:** Clarity never loads there (and a page that already has it reloads clean, `ConsentProvider` + `src/lib/checkout.ts`), and `/pt/reservar` and `/en/checkout` get a strict Content-Security-Policy (`next.config.ts`); add only the chosen provider's domains to it.
- 2026-11-04 (branch `api-version-0`, live listings): all **42** Guesty listings are shown. Code: `src/lib/data/guesty/` (server-only client + list/detail loaders, `cacheLife("hours")`; dev token cached in `.next/cache/guesty/token.json`, 0600). **All listing text is Guesty's own, as-is** (title minus the "Tripas-Coração:" prefix, summary, space; English on PT pages too; client decision 2026-11-04, our PT/EN rewrites are in git history). `src/content/listings.ts` now only pins slug, building, collection features, floor override and photo order for 11 homes; the rest show Guesty's first 12 photos, slugs from the Guesty title. Buildings link to listings via `guestyTag` (the client's Guesty tag); six new buildings (Taipas 47, Almada 505, Santa Catarina, Clérigos, Sá da Bandeira 198, Santa Teresa 40) have no history copy and lift unknown (`hasLift: null`, nothing shown). Invented `areaSqm` removed: area comes from Guesty `areaSquareFeet` (hidden if missing or < 15 m²). Floor isn't in the API (snapshot floor kept for the curated homes). Without keys, or if Guesty fails, the mock snapshot is used. Guesty photo hosts: `assets.guesty.com` and `guesty-listing-images.s3.amazonaws.com` (`next.config.ts` + `imageHosts`).
