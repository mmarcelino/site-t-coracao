#!/usr/bin/env node
/**
 * Keep the PT-PT translations of Guesty's listing descriptions in step (CLAUDE.md §16, 2026-11-05).
 * Run with the quarterly reviews refresh, or whenever the client edits a description in Guesty:
 *
 *   pnpm listings:texts          Downloads every listing's summary and "space" text and writes the
 *                                new or changed ones to .next/cache/listings/pending.json.
 *   (Claude, or a person, translates them into .next/cache/listings/translated.json:
 *    { "<listing id>": { "summary": "<PT-PT>", "space": "<PT-PT>" } })
 *   pnpm listings:texts apply    Writes them into src/content/listing-translations.json, together
 *                                with the English they were made from.
 *
 * Until a changed description is translated again, the PT page shows Guesty's new English.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { API, ROOT, readJson, token, writePrivate } from "./guesty-shared.mjs";

const WORK = path.join(ROOT, ".next/cache/listings");
const TRANSLATIONS = path.join(ROOT, "src/content/listing-translations.json");

async function fetchPending() {
  const auth = await token();
  const res = await fetch(`${API}/listings?limit=100&fields=_id%20title%20publicDescription`, { headers: { authorization: `Bearer ${auth}` } });
  if (!res.ok) throw new Error(`Guesty GET /listings failed (${res.status})`);
  const { results } = await res.json();
  const current = await readJson(TRANSLATIONS, {});
  const pending = {};
  for (const l of results) {
    const en = { summary: (l.publicDescription?.summary ?? "").trim(), space: (l.publicDescription?.space ?? "").trim() };
    const t = current[l._id];
    if (!t || t.en.summary !== en.summary || t.en.space !== en.space) pending[l._id] = { title: l.title, en, previous: t?.en ?? null };
  }
  await writePrivate(path.join(WORK, "pending.json"), pending);
  console.log(`${results.length} listings; ${Object.keys(pending).length} new or changed descriptions to translate.`);
  if (Object.keys(pending).length) console.log("Written to .next/cache/listings/pending.json; translations go in .next/cache/listings/translated.json");
}

async function apply() {
  const pending = await readJson(path.join(WORK, "pending.json"), null);
  const translated = await readJson(path.join(WORK, "translated.json"), null);
  if (!pending || !translated) throw new Error("Run listings:texts first and write .next/cache/listings/translated.json");
  const current = await readJson(TRANSLATIONS, {});
  let n = 0;
  for (const [id, pt] of Object.entries(translated)) {
    if (!pending[id]) throw new Error(`Unknown listing in translations: ${id}`);
    const { en } = pending[id];
    if ((en.summary && !pt.summary) || (en.space && !pt.space)) throw new Error(`Missing text for ${id}`);
    current[id] = { en, pt: { summary: pt.summary ?? "", space: pt.space ?? "" } };
    n++;
  }
  await writeFile(TRANSLATIONS, JSON.stringify(current, null, 1) + "\n");
  console.log(`Updated ${n} translations.`);
}

if (process.argv[2] === "apply") await apply();
else await fetchPending();
