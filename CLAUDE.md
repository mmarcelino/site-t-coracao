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
2. **Apartments**: listing grid with filters. Built: collection tags (`?tag=`), guests and dates from the home search (capacity + availability). Still to add: neighbourhood, type, optional grouped-by-building view.
3. **Apartment detail**: gallery, story line about the building, key facts, description, amenities, location/neighbourhood, house rules, sticky booking widget with mock price breakdown, related flats in the same building.
4. **Buildings**: one page per building with history, photos, its flats.
5. **Neighbourhoods**: index + one page per neighbourhood (local guide: eat, drink, see, practical tips). Important for SEO and premium feel.
6. **Experiences / Tours**: partner experiences in and outside Porto (see §9), plus a "help me plan" request form (UI only for now) and the guest portal / digital guidebook explainer.
7. **For owners** (`/pt/gestao-alojamento-local` / `/en/property-management`): management services for owners/investors (see §9), with a lead form (UI only).
8. **About**
9. **FAQ**: full page, grouped by topic (see §10).
10. **Contact**
11. **Legal**: Terms, Privacy, Cookies.
12. **Book direct / checkout**: UI only, mock flow ending on a clearly-marked demo confirmation.

**Footer must include:** contact (phone, email, address, WhatsApp), social links, the **Livro de Reclamações** link (legally required in Portugal), and space for the AL licence numbers.

Keep the existing site's URLs in a redirect map (`redirects.ts`) so SEO isn't lost at launch, e.g. `/pt/listwithus`, `/short-term-rental-management-porto`, `/pt/experiences-your-guest-portal`, `/pt/faqs`.

## 8. Placeholder imagery

- Photos are taken from the client's own public website and booking pages (tripas-coracao.pt, tripasapartments.guestybookings.com) as placeholders only.
- Store in `public/images/placeholder/` and record every image in `public/images/placeholder/SOURCES.md` (local filename → original URL → where it's used).
- Always use `next/image` with explicit sizes; write meaningful alt text in both languages.
- Final, high-resolution originals will come from the client. Don't optimise art direction around low-res placeholders.

## 9. Content to carry over from the current site

**Owners page.** Services in six steps: (1) feasibility analysis, (2) registration & licensing, (3) property setup (interiors, photography, listings), (4) daily operations (guest comms, cleaning, maintenance, on-site issues), (5) revenue management (dynamic pricing, reviews), (6) investor relations (reviews, reporting, transparency). Positioning: Porto-based since 2015, a limited number of properties, "we don't manage properties, we manage assets." Two audiences: owners already operating with inconsistent results, and owners considering short-term rental for the first time. Rewrite in the new voice; keep the substance.

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
- [ ] Google Business profile for reviews, and which review sources the client wants shown
  - Real reviews must come through **Guesty's API** (Airbnb + Booking.com, per listing) and the **Google Places API** (needs the client's Google Business profile + an API key; ~5 reviews per place, attribution rules). No scraping: Airbnb has no public API and its terms forbid it. Until then all quotes on the site are flagged mock.

- [ ] Final brand name/logo treatment for the new site (keep "Tripas-Coração"?)
- [ ] Exact number of apartments and buildings, and the building/flat mapping (site says 41–42; brief says 50+). *Research 2026-10-26: the public Guesty booking site lists 42 listings across ~10 street addresses (see §16); client to confirm.*
- [ ] Payment method: GuestyPay or Stripe through Guesty? Booking Engine API included in their Guesty plan?
- [ ] Instant booking or inquiry-first?
- [ ] Book-direct perks the client is happy to commit to
- [ ] Taxes/fees (incl. Porto tourist tax) configured in Guesty?
- [ ] Keep the luggage storage page/service?
- [ ] Allow or block AI crawlers?
- [ ] High-res photography and building history material from the client
- [ ] AL licence numbers per property (10 known from Guesty, see `src/content/site.ts`)
- [ ] **Copy/facts flagged TO CONFIRM in the code** (search for `TO CONFIRM`, `INVENTED`, `toConfirm: true`, `mock: true`):
  - Cancellation terms used in copy: "free cancellation up to 14 days before arrival" (perks, FAQ, reassurance)
  - Book-direct perks wording, incl. "find it for less and we'll match it", welcome gift contents
  - Porto tourist tax rule in the mock quote (€3/guest/night, max 7 nights, 13+)
  - FAQ answers for luggage storage, mid-stay cleaning, airport transfer, payment provider, owner fees
  - Building eras (`era`), lifts at Breiner 210 and São Bento, floor areas (`areaSqm`) for all 10 flats
  - Reviews: all excerpts and per-platform totals are mock; per-listing scores are real Guesty aggregates
  - Registered company name for legal pages / JSON-LD

## 16. Decision log

- 2026-10-26: Next.js + TypeScript + Tailwind + next-intl; PT/EN; no CMS; visuals first with mock data; Numa-inspired agency look adapted to a premium, heritage context.
- 2026-10-26: Analytics via the client's Microsoft Clarity behind a consent banner and a single analytics wrapper; reviews + WhatsApp concierge as core trust signals; Playwright for screenshots, smoke and a11y checks.
- 2026-10-26 (milestone 1 build decisions):
  - **Stack versions:** Next 16.4 (App Router, Turbopack, Cache Components + Partial Prefetching on), React 19.3, Tailwind 4.3, next-intl 4.14, TypeScript strict + `noUncheckedIndexedAccess`, pnpm 12 via Corepack.
  - **i18n:** locale is a root param (`app/[locale]`, read via `next/root-params`); localized slugs in `src/i18n/routing.ts`; `src/proxy.ts` (Next 16's renamed middleware) does detection/redirects. We do **not** use `next-intl/plugin`: it eagerly loads `@swc/core`, whose binary doesn't run on macOS 13; `next.config.ts` sets the `next-intl/config` alias by hand. Number/date formatting goes through `src/lib/format.ts` (maps `pt`→`pt-PT`, `en`→`en-GB`; bare `pt` formats as Brazilian, e.g. "€ 60").
  - **Cache Components rules we follow:** dynamic `params`/`searchParams` sit under `<Suspense>`; nothing in a server render reads "now" (calendar/today only computed client-side after interaction); consent is read client-side so pages stay static.
  - **Date picker:** `react-day-picker` v10 (approved). Analytics: `src/lib/analytics.ts` + consent provider; Clarity loads only after consent and when `NEXT_PUBLIC_CLARITY_PROJECT_ID` is set; uses Clarity Consent API v2 (`consentv2`), and `consent(false)` on withdrawal.
  - **Mock data:** built from a trimmed snapshot of the client's **public** Guesty booking site (`src/lib/data/mock/guesty-listings.snapshot.json`, 10 listings: real titles, addresses, capacity, base prices, fees, amenities, licences, review aggregates). Our editorial layer (`src/content/listings.ts`, `buildings.ts`, `neighbourhoods.ts`) adds slugs, PT/EN copy and photo order. Mock set: 4 buildings (Mouzinho 32, Cordoaria, Breiner 210, São Bento) and 3 neighbourhoods (Ribeira, Baixa & São Bento, Cordoaria & Cedofeita). Availability and quotes are deterministic mocks; quotes are built in Guesty Booking Engine shape and mapped by `fromGuestyQuote()`.
  - **Data model addition:** `Building.storyImage` (detail photo for the story block on apartment pages, so it doesn't repeat the listing cover).
  - **Booking UI seam:** the widget calls server actions in `src/lib/actions/booking.ts` (`requestQuote`, `requestBlockedNights`); these become the Guesty calls later.
  - **Phasing:** nav links to pages from later milestones render the localized 404 ("this page doesn't exist yet"). A lean `/apartments` index exists so the home search has somewhere to land.
  - **Playwright:** bundled Chromium doesn't support macOS 13, so on macOS the config uses the installed Google Chrome (`channel: "chrome"`); Linux/CI uses the bundled browser.
- 2026-10-26 (**experiment, branch `numa-like` only**): client asked for Numa's bold agency look ("approach #2: full Numa"), which overrides §5's "big and light, not big and bold" on that branch. Changes: headings weight 600 with poster scale (`text-display`/`text-mega`/`text-h1`/`text-h2` enlarged), signature colour block `wash` `#cddcef` (text on it: ink or `ink-soft-text`, never granite), `azulejo-bright` hover accent, pill buttons, rounded cards (`--radius-card`/`--radius-tile`), ↗ arrows. Home adds Numa devices: search pill pinned under the header on desktop, scroll-darkening statement lines, giant typographic building list with hover photo, "Why book direct" stacked sticky cards, owners block with the six services as tiles (`src/content/owners.ts`), neighbourhood "story" cards, wash footer with a giant wordmark. If adopted, update §5 principles accordingly; if not, `main` keeps the light direction.
- 2026-10-26 (`numa-like` refinement): home restructured to the 9 sections in §7.1; **white page background** (`paper` = `#ffffff`; `sand` is now a neutral mist `#f3f4f5`, no beige). Collections are driven by **listing tags** (data model addition `Listing.tags`: `couples | families | sea | outdoor | views | remote-work`; `sea/outdoor/views` are editorial `features` in `src/content/listings.ts`, the rest derived from Guesty fields) and defined in `src/content/collections.ts`. Added the client's **Casa do Farol** villa (Foz, 3-bed house for 6, licence 167338/AL, Guesty 10/10 from 32 reviews) from the public Guesty page, with building + new **Foz do Douro** neighbourhood; its tram/façade photo is the hero. Home perks are 4 (early/late check-in kept in `perks.ts` for later pages). "Self check-in" in How it works is TO CONFIRM (Guesty copy says some arrivals are met in person). Experience cards are colour tiles until per-tour photos exist.
- 2026-10-26 (research, not yet decisions): Numa uses **Lausanne** (commercial, Weltkern), 300/600 weights, ~100px H1 with negative tracking, so we will not copy it; free alternatives proposed. The public Guesty booking site (`tripasapartments.guestybookings.com`) exposes 42 real listings with titles, addresses, coordinates, capacities and long descriptions. Buildings inferred from addresses: Mouzinho da Silveira 32, Rua das Taipas 47, Cordoaria (Campo Mártires da Pátria 27/103), Sá da Bandeira 198, São Bento (Praça Almeida Garrett 24), Santa Catarina (Rua da Firmeza 410), Rua do Almada 505, Rua do Breiner 210, Rua de Santa Teresa 40, plus an oceanfront villa at Passeio Alegre (Foz). Many units have no lift. The current site's header shows placeholder contact details (555-555-5555, mymail@mailservice.com); the real ones are in the footer: +351 962 708 740, ola@tripas-coracao.pt, Rua do Breiner 208, 4050-124 Porto.
