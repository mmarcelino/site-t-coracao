#!/usr/bin/env node
/**
 * Manual review refresh (CLAUDE.md §16, 2026-11-05). The monthly automatic run (auto-refresh.mjs)
 * normally does this; use these to refresh by hand, with a person (or Claude) choosing and
 * translating:
 *
 *   pnpm reviews:fetch   Downloads every review (Booking Engine API, dev key from .env.local,
 *                        paced ~1 request/s) and writes the new ones that pass the rules
 *                        (reviews-core.mjs) to .next/cache/reviews/candidates.json, plus fresh scores.
 *   (then write .next/cache/reviews/decisions.json:
 *    { "<review id>": { "en": "=" | "<corrected English>", "pt": "=" | "<PT-PT>", "lang"?: "fr" } | "DROP" })
 *   pnpm reviews:apply   Adds the kept reviews to src/content/apartment-reviews.json (each flat keeps
 *                        its 20 newest), records dropped IDs in scripts/reviews-rejected.json so they
 *                        aren't suggested again, and updates src/content/review-scores.json.
 *
 * Working files hold guests' names and stay under .next/cache (git-ignored, owner-only).
 */
import path from "node:path";
import { ROOT, readJson, token, writePrivate } from "./guesty-shared.mjs";
import { REJECTED, REVIEWS, collect, save, trim } from "./reviews-core.mjs";

const WORK = path.join(ROOT, ".next/cache/reviews");

async function fetchCandidates() {
  const out = await collect(await token());
  await writePrivate(path.join(WORK, "candidates.json"), out);
  const flats = new Set(out.candidates.map((c) => c.listingId)).size;
  console.log(`New candidates since ${out.since}: ${out.candidates.length} across ${flats} flats`);
  console.log(`Scores now: Airbnb ${out.scores.airbnb.score} (${out.scores.airbnb.count}), Booking.com ${out.scores.booking.score} (${out.scores.booking.count})`);
  console.log("Written to .next/cache/reviews/candidates.json; decisions go in .next/cache/reviews/decisions.json");
}

async function apply() {
  const { scores, candidates } = (await readJson(path.join(WORK, "candidates.json"), null)) ?? {};
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
  const asOf = await save(trim(reviews), scores, rejected);
  console.log(`Added ${added}, dropped ${Object.values(decisions).filter((d) => d === "DROP").length}; scores as of ${asOf}`);
}

const command = process.argv[2];
if (command === "fetch") await fetchCandidates();
else if (command === "apply") await apply();
else console.log("Usage: node scripts/reviews.mjs fetch | apply");
