/**
 * The review rules, shared by the manual refresh (reviews.mjs) and the automatic one
 * (auto-refresh.mjs), so both pick reviews the same way: download every Airbnb and Booking.com review
 * from Guesty, average the scores, and keep as candidates only the new, top-scored ones with no hint
 * of a complaint.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { API, ROOT, decode, readJson, sleep } from "./guesty-shared.mjs";

export const REVIEWS = path.join(ROOT, "src/content/apartment-reviews.json");
export const SCORES = path.join(ROOT, "src/content/review-scores.json");
/** Review IDs never to show (dropped by hand, or a bad one the client wants gone). */
export const REJECTED = path.join(ROOT, "scripts/reviews-rejected.json");
export const PER_FLAT = 20;
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
/** Anything hinting at a complaint, naming the platforms, or carrying contact details is left out. */
const BAD = {
  en: /\b(but|however|although|though|unfortunately|noise|noisy|loud|dirty|broken|problem|issues?|complain\w*|wish|could (be|have)|lack\w*|missing|no (ac|a\/c|air|elevator|lift)|cons?|negative|airbnb\w*|air ?b(&|n)b|booking|smell\w*|stairs|steep|except|downside|only thing|pric(e)?y|expensive|bring your own)\b/i,
  pt: /\b(mas|porém|barulho|ruído|sujo|problema|escadas|elevador|airbnb|infelizmente)\b/i,
  es: /\b(pero|ruido|sucio|problema|escaleras|ascensor|airbnb|lamentablemente)\b/i,
  fr: /\b(mais|bruit|bruyant|sale|problème|escaliers?|ascenseur|airbnb|dommage)\b/i,
  de: /\b(aber|leider|laut|lärm|schmutzig|problem|treppen?|aufzug|airbnb)\b/i,
  it: /\b(ma|rumore|rumoroso|sporco|problema|scale|ascensore|airbnb|purtroppo)\b/i,
  nl: /\b(maar|helaas|lawaai|vies|probleem|trappen?|lift|airbnb)\b/i,
};
const CONTACT = /https?:\/\/|www\.|@\S+\.\w|\+?\d[\d\s]{7,}/;

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
    if (process.stdout.isTTY) process.stdout.write(`\r${channelId}: ${all.length}`);
    if (data.length < 100) break;
    await sleep(700);
  }
  console.log(`${process.stdout.isTTY ? "\r" : ""}${channelId}: ${all.length} reviews`);
  return all;
}

/** Every review from Guesty, the platform scores, and the new candidates that pass the rules. */
export async function collect(auth) {
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

  // The same words twice (a guest posting on two listings) count once.
  const seenText = new Set(Object.values(current).flat().map((r) => r.text.en.toLowerCase()));
  const candidates = rows
    .filter(({ text }) => {
      const key = text.toLowerCase();
      if (seenText.has(key)) return false;
      seenText.add(key);
      return true;
    })
    .filter(
      ({ r, text, language }) =>
        !known.has(r._id) &&
        r.createdAt.slice(0, 10) >= since &&
        language in BAD &&
        text.length >= 80 &&
        text.length <= 480 &&
        !BAD[language].test(text) &&
        !CONTACT.test(text),
    )
    .map(({ r, source, rating, author, text, language }) => ({
      id: r._id, listingId: r.listingId, source, rating, author, date: r.createdAt.slice(0, 10), language, text,
    }))
    // English first, then newest.
    .sort((a, b) => Number(b.language === "en") - Number(a.language === "en") || b.date.localeCompare(a.date));

  const avg = (t) => ({ score: Math.round((t.sum / t.count) * 10) / 10, count: t.count });
  return { since, scores: { airbnb: avg(totals.airbnb), booking: avg(totals.booking) }, candidates };
}

/** Each flat keeps its 20 newest reviews. */
export function trim(reviews) {
  for (const id of Object.keys(reviews)) reviews[id] = reviews[id].sort((a, b) => b.date.localeCompare(a.date)).slice(0, PER_FLAT);
  return reviews;
}

export async function save(reviews, scores, rejected) {
  // Prices typed in reviews keep the number and "€" together (CLAUDE.md §16, 2026-11-03).
  await writeFile(REVIEWS, JSON.stringify(reviews, null, 1).replace(/(\d) €/g, "$1\\u00a0€") + "\n");
  if (rejected) await writeFile(REJECTED, JSON.stringify([...rejected].sort(), null, 1) + "\n");
  const asOf = new Date().toISOString().slice(0, 10);
  await writeFile(SCORES, JSON.stringify({ asOf, airbnb: scores.airbnb, booking: scores.booking }, null, 1) + "\n");
  return asOf;
}
