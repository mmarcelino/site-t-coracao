#!/usr/bin/env node
/**
 * Refresh the apartment reviews from Guesty (CLAUDE.md §16, 2026-11-05). Run every few months:
 *
 *   pnpm reviews:fetch   Downloads every review (Booking Engine API, dev key from .env.local,
 *                        paced ~1 request/s), keeps the new ones that pass the rules below and writes
 *                        them to .next/cache/reviews/candidates.json, plus fresh platform scores.
 *   (a person, or Claude, reads the candidates and writes .next/cache/reviews/decisions.json:
 *    { "<review id>": { "en": "=" | "<corrected English>", "pt": "=" | "<PT-PT>", "lang"?: "fr" } | "DROP" })
 *   pnpm reviews:apply   Adds the kept reviews to src/content/apartment-reviews.json (each flat keeps
 *                        its 20 newest), records dropped IDs in scripts/reviews-rejected.json so they
 *                        aren't suggested again, and updates src/content/review-scores.json.
 *
 * Working files hold guests' names and stay under .next/cache (git-ignored, owner-only). The access
 * token is reused from the dev token file the app keeps, and never printed.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { API, ROOT, decode, readJson, sleep, token, writePrivate } from "./guesty-shared.mjs";

const WORK = path.join(ROOT, ".next/cache/reviews");
const REVIEWS = path.join(ROOT, "src/content/apartment-reviews.json");
const SCORES = path.join(ROOT, "src/content/review-scores.json");
const REJECTED = path.join(ROOT, "scripts/reviews-rejected.json");
const PER_FLAT = 20;
/** Reviews this many days older than the last refresh still count as new (late arrivals). */
const OVERLAP_DAYS = 60;

const STOP = {
  en: "the and was very great we is to place stay our were it this with".split(" "),
  pt: "o e muito com não uma para apartamento é estadia localização tudo".split(" "),
  es: "el y muy con la es para todo piso estancia ubicación".split(" "),
  fr: "le et très avec est nous pour un appartement séjour emplacement".split(" "),
  de: "die und sehr mit ist wir war der wohnung alles lage".split(" "),
  it: "il e molto con è per appartamento tutto della siamo posizione".split(" "),
  nl: "de en zeer met is we het een appartement heel locatie".split(" "),
};
/** Anything hinting at a complaint, or naming the platforms, is left out. */
const BAD = {
  en: /\b(but|however|although|though|unfortunately|noise|noisy|loud|dirty|broken|problem|issues?|complain\w*|wish|could (be|have)|lack\w*|missing|no (ac|a\/c|air|elevator|lift)|cons?|negative|airbnb\w*|air ?b(&|n)b|booking|smell\w*|stairs|steep|except|downside)\b/i,
  pt: /\b(mas|porém|barulho|ruído|sujo|problema|escadas|elevador|airbnb|infelizmente)\b/i,
  es: /\b(pero|ruido|sucio|problema|escaleras|ascensor|airbnb|lamentablemente)\b/i,
  fr: /\b(mais|bruit|bruyant|sale|problème|escaliers?|ascenseur|airbnb|dommage)\b/i,
  de: /\b(aber|leider|laut|lärm|schmutzig|problem|treppen?|aufzug|airbnb)\b/i,
  it: /\b(ma|rumore|rumoroso|sporco|problema|scale|ascensore|airbnb|purtroppo)\b/i,
  nl: /\b(maar|helaas|lawaai|vies|probleem|trappen?|lift|airbnb)\b/i,
};

function languageOf(text) {
  const words = text.toLowerCase().match(/[\p{L}']+/gu) ?? [];
  let best = null;
  let bestScore = 2;
  for (const [lang, list] of Object.entries(STOP)) {
    const score = words.filter((w) => list.includes(w)).length;
    if (score > bestScore) [best, bestScore] = [lang, score];
  }
  return best;
}

async function channel(auth, channelId) {
  const all = [];
  for (let skip = 0; ; skip += 100) {
    let res;
    for (let attempt = 1; ; attempt++) {
      res = await fetch(`${API}/reviews?channelId=${channelId}&limit=100&skip=${skip}`, { headers: { authorization: `Bearer ${auth}` } });
      if (res.status !== 429 || attempt > 5) break;
      await sleep(5000 * attempt);
    }
    if (!res.ok) throw new Error(`Guesty GET /reviews failed (${res.status})`);
    const { data } = await res.json();
    all.push(...data);
    process.stdout.write(`\r${channelId}: ${all.length}`);
    if (data.length < 100) break;
    await sleep(700);
  }
  process.stdout.write("\n");
  return all;
}

async function fetchCandidates() {
  const auth = await token();
  const [airbnb, booking] = [await channel(auth, "airbnb2"), await channel(auth, "bookingCom")];
  const current = await readJson(REVIEWS, {});
  const known = new Set([...Object.values(current).flat().map((r) => r.id), ...(await readJson(REJECTED, []))]);
  const { asOf } = await readJson(SCORES, { asOf: "2000-01-01" });
  const since = new Date(Date.parse(asOf) - OVERLAP_DAYS * 864e5).toISOString().slice(0, 10);

  const totals = { airbnb: { sum: 0, count: 0 }, booking: { sum: 0, count: 0 } };
  const rows = [];
  for (const r of airbnb) {
    const raw = r.rawReview ?? {};
    if (raw.reviewer_role !== "guest" || raw.hidden || !raw.overall_rating) continue;
    totals.airbnb.sum += raw.overall_rating;
    totals.airbnb.count++;
    const text = decode(raw.public_review ?? "");
    if (raw.overall_rating === 5) rows.push({ r, source: "airbnb", rating: 5, author: null, text, language: languageOf(text) });
  }
  for (const r of booking) {
    const raw = r.rawReview ?? {};
    const score = raw.scoring?.review_score;
    if (!score) continue;
    totals.booking.sum += score;
    totals.booking.count++;
    const text = decode(raw.content?.positive ?? "");
    const first = (raw.reviewer?.name ?? "").trim().match(/^[\p{L}'’-]{2,}/u)?.[0];
    const author = first ? first[0].toUpperCase() + first.slice(1).toLowerCase() : null;
    const language = raw.content?.language_code?.split("-")[0]?.toLowerCase() || languageOf(text);
    if (score >= 9) rows.push({ r, source: "booking", rating: score, author, text, language });
  }

  const candidates = rows
    .filter(({ r, text, language }) =>
      !known.has(r._id) && r.createdAt.slice(0, 10) >= since && language in BAD && text.length >= 80 && text.length <= 480 && !BAD[language].test(text),
    )
    .map(({ r, source, rating, author, text, language }) => ({
      id: r._id, listingId: r.listingId, source, rating, author, date: r.createdAt.slice(0, 10), language, text,
    }))
    // English first, then newest.
    .sort((a, b) => Number(b.language === "en") - Number(a.language === "en") || b.date.localeCompare(a.date));

  const avg = (t, outOf) => ({ score: Math.round((t.sum / t.count) * 10) / 10, count: t.count, outOf });
  const out = { since, scores: { airbnb: avg(totals.airbnb, 5), booking: avg(totals.booking, 10) }, candidates };
  await writePrivate(path.join(WORK, "candidates.json"), out);
  const perFlat = Object.groupBy(candidates, (c) => c.listingId);
  console.log(`New candidates since ${since}: ${candidates.length} across ${Object.keys(perFlat).length} flats`);
  console.log(`Scores now: Airbnb ${out.scores.airbnb.score} (${out.scores.airbnb.count}), Booking.com ${out.scores.booking.score} (${out.scores.booking.count})`);
  console.log(`Written to ${path.relative(ROOT, path.join(WORK, "candidates.json"))}; decisions go in .next/cache/reviews/decisions.json`);
}

async function apply() {
  const { scores, candidates } = await readJson(path.join(WORK, "candidates.json"), null) ?? {};
  const decisions = await readJson(path.join(WORK, "decisions.json"), null);
  if (!candidates || !decisions) throw new Error("Run reviews:fetch first and write .next/cache/reviews/decisions.json");
  const byId = new Map(candidates.map((c) => [c.id, c]));
  const reviews = await readJson(REVIEWS, {});
  const rejected = new Set(await readJson(REJECTED, []));
  let added = 0;
  for (const [id, d] of Object.entries(decisions)) {
    const c = byId.get(id);
    if (!c) throw new Error(`Unknown review id in decisions: ${id}`);
    if (d === "DROP") {
      rejected.add(id);
      continue;
    }
    const lang = d.lang ?? c.language;
    const entry = {
      id, source: c.source, rating: c.rating, author: c.author, date: c.date, listingId: c.listingId,
      ...(lang === "en" ? {} : { language: lang }),
      text: { en: d.en === "=" ? c.text : d.en, pt: d.pt === "=" ? c.text : d.pt },
    };
    if (!entry.text.en || !entry.text.pt) throw new Error(`Missing text for ${id}`);
    (reviews[c.listingId] ??= []).push(entry);
    added++;
  }
  for (const id of Object.keys(reviews)) {
    reviews[id] = reviews[id].sort((a, b) => b.date.localeCompare(a.date)).slice(0, PER_FLAT);
  }
  // Prices typed in reviews keep the number and "€" together (CLAUDE.md §16, 2026-11-03).
  const json = JSON.stringify(reviews, null, 1).replace(/(\d) €/g, "$1\\u00a0€");
  await writeFile(REVIEWS, json + "\n");
  await writeFile(REJECTED, JSON.stringify([...rejected].sort(), null, 1) + "\n");
  const asOf = new Date().toISOString().slice(0, 10);
  await writeFile(SCORES, JSON.stringify({ asOf, airbnb: { score: scores.airbnb.score, count: scores.airbnb.count }, booking: { score: scores.booking.score, count: scores.booking.count } }, null, 1) + "\n");
  console.log(`Added ${added}, dropped ${Object.values(decisions).filter((d) => d === "DROP").length}; scores as of ${asOf}`);
}

const command = process.argv[2];
if (command === "fetch") await fetchCandidates();
else if (command === "apply") await apply();
else console.log("Usage: node scripts/reviews.mjs fetch | apply");
