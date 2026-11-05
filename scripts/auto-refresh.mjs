#!/usr/bin/env node
/**
 * Automatic content refresh, run by GitHub Actions (.github/workflows/content-refresh.yml) so the
 * site stays current with nobody maintaining it (CLAUDE.md §16, 2026-11-05):
 *
 *   node scripts/auto-refresh.mjs reviews        (monthly) Platform scores from every review in Guesty,
 *                                                and each flat's 20 newest reviews that pass the rules
 *                                                in reviews-core.mjs, shown as written, translated by
 *                                                DeepL (into PT-PT, and into English when written in
 *                                                another language).
 *   node scripts/auto-refresh.mjs descriptions   (weekly) PT-PT translations of the descriptions the
 *                                                client added or changed in Guesty.
 *   node scripts/auto-refresh.mjs credit         (after each run) Fails, so GitHub emails the owner,
 *                                                once 80% of the DeepL credit is used: years ahead,
 *                                                time to add a new key or switch translator.
 *   Add --dry-run to report what would change without translating or writing anything.
 *
 * Safety: it only adds (a flat's oldest reviews make way for newer ones; nothing else is removed),
 * never shows IDs listed in scripts/reviews-rejected.json, and stops without changing anything if
 * Guesty's data looks wrong (far fewer reviews than last time, or a score jumping), so a bad day at
 * Guesty can't reach the site. Needs GUESTY_BOOKING_ENGINE_CLIENT_ID/_SECRET and DEEPL_API_KEY.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { hasDeepL, translate, usage } from "./deepl.mjs";
import { ROOT, fetchListingTexts, readJson, token } from "./guesty-shared.mjs";
import { REVIEWS, SCORES, collect, save, trim } from "./reviews-core.mjs";

const TRANSLATIONS = path.join(ROOT, "src/content/listing-translations.json");
const dryRun = process.argv.includes("--dry-run");
/** Largest believable change in a platform's average from one month to the next. */
const MAX_SCORE_MOVE = { airbnb: 0.2, booking: 0.4 };

function fail(message) {
  console.error(`Stopped, nothing changed: ${message}`);
  process.exit(1);
}

async function reviews() {
  const out = await collect(await token());
  const previous = await readJson(SCORES, null);
  for (const p of ["airbnb", "booking"]) {
    const before = previous?.[p];
    const now = out.scores[p];
    if (!before) continue;
    if (now.count < before.count * 0.95) fail(`${p} has ${now.count} reviews, ${before.count} last time`);
    if (Math.abs(now.score - before.score) > MAX_SCORE_MOVE[p]) fail(`${p} score moved from ${before.score} to ${now.score}`);
  }

  // Which candidates make each flat's 20 newest: only those get translated.
  const current = await readJson(REVIEWS, {});
  const merged = structuredClone(current);
  for (const c of out.candidates) (merged[c.listingId] ??= []).push({ ...c, pending: true });
  trim(merged);
  const added = Object.values(merged).flat().filter((r) => r.pending);
  console.log(`Scores: Airbnb ${out.scores.airbnb.score} (${out.scores.airbnb.count}), Booking.com ${out.scores.booking.score} (${out.scores.booking.count})`);
  console.log(`${out.candidates.length} new candidates; ${added.length} join their flat's 20 newest.`);
  if (dryRun) return;
  if (added.length && !hasDeepL()) fail("DEEPL_API_KEY is not set");

  const toPt = await translate(added.map((r) => r.text), "PT-PT");
  const needEn = added.filter((_, i) => toPt[i].source !== "en");
  const toEn = needEn.length ? await translate(needEn.map((r) => r.text), "EN-GB") : [];
  const enById = new Map(needEn.map((r, i) => [r.id, toEn[i].text]));
  added.forEach((r, i) => {
    const lang = toPt[i].source;
    const entry = {
      id: r.id, source: r.source, rating: r.rating, author: r.author, date: r.date, listingId: r.listingId,
      ...(lang === "en" ? {} : { language: lang }),
      text: { en: lang === "en" ? r.text : enById.get(r.id), pt: lang === "pt" ? r.text : toPt[i].text },
    };
    const list = merged[r.listingId];
    list[list.indexOf(r)] = entry;
  });
  const asOf = await save(trim(merged), out.scores);
  console.log(`Reviews and scores updated (as of ${asOf}).`);
}

async function descriptions() {
  const listings = await fetchListingTexts(await token());
  const current = await readJson(TRANSLATIONS, {});
  const changed = listings.filter((l) => {
    const t = current[l.id];
    return !t || t.en.summary !== l.en.summary || t.en.space !== l.en.space;
  });
  console.log(`${listings.length} listings; ${changed.length} new or changed descriptions.`);
  if (dryRun || !changed.length) return;
  if (!hasDeepL()) fail("DEEPL_API_KEY is not set");
  const texts = changed.flatMap((l) => [l.en.summary || " ", l.en.space || " "]);
  const pt = await translate(texts, "PT-PT", "EN");
  changed.forEach((l, i) => {
    current[l.id] = {
      en: l.en,
      pt: { summary: l.en.summary ? pt[2 * i].text : "", space: l.en.space ? pt[2 * i + 1].text : "" },
    };
  });
  await writeFile(TRANSLATIONS, JSON.stringify(current, null, 1) + "\n");
  console.log(`Translated ${changed.length} descriptions.`);
}

async function credit() {
  const { used, limit } = await usage();
  const share = limit ? used / limit : 0;
  console.log(`DeepL: ${used} of ${limit} characters used (${Math.round(share * 100)}%).`);
  if (share >= 0.8) {
    console.error("DeepL credit is 80% used: create a new DeepL key (or switch translator) and update the DEEPL_API_KEY secret.");
    process.exit(1);
  }
}

const job = process.argv[2];
if (job === "reviews") await reviews();
else if (job === "descriptions") await descriptions();
else if (job === "credit") await credit();
else console.log("Usage: node scripts/auto-refresh.mjs reviews | descriptions | credit [--dry-run]");
