import { apartmentReviews } from "@/content/apartment-reviews";
import { reviewScores, type CuratedReview } from "@/content/reviews";
import type { Locale, Review, ReviewAggregate, ReviewSource } from "./types";

/**
 * Reviews: each apartment's hand-picked real guest reviews (`src/content/apartment-reviews.ts`,
 * refreshed every few months with `pnpm reviews:fetch` / `reviews:apply`) and a snapshot of the
 * platform scores; no live feed. Quotes in another language than the page's are our translation,
 * flagged with `translatedFrom`.
 */

/** Home quotes: drawn from the apartments' own, so each refresh updates the home page too. */
const HOME_COUNT = 12;
/** Only reviews from the last three months (counted back from the newest) go on the home page. */
const HOME_WINDOW_DAYS = 90;
/** What makes a quote worth leading with: about the place and the people, not just "great stay". */
const STRONG = /beautiful|stunning|gorgeous|view|design|histor|charm|light|detail|thoughtful|welcome|recommend|river|douro|tiles?|building|host|team|special|home/gi;

function strength(r: CuratedReview): number {
  const words = new Set((r.text.en.match(STRONG) ?? []).map((w) => w.toLowerCase())).size;
  const length = r.text.en.length;
  return Math.min(words, 6) + (length >= 180 && length <= 420 ? 3 : length >= 120 ? 1 : 0);
}

/**
 * The strongest recent reviews across all homes, one per home so they cover different flats, shown
 * newest first: recent dates are what reassure, but the home page leads with the best of them.
 */
function homeSelection(): CuratedReview[] {
  const all = Object.values(apartmentReviews).flat();
  const newest = all.reduce((max, r) => (r.date > max ? r.date : max), "");
  const since = new Date(Date.parse(newest) - HOME_WINDOW_DAYS * 864e5).toISOString().slice(0, 10);
  const byDate = (a: CuratedReview, b: CuratedReview) => b.date.localeCompare(a.date);
  // Recent ones by strength, then (if a quiet season leaves too few) the rest by date.
  const ranked = [
    ...all.filter((r) => r.date >= since).sort((a, b) => strength(b) - strength(a) || byDate(a, b)),
    ...all.filter((r) => r.date < since).sort(byDate),
  ];
  const seen = new Set<string | undefined>();
  return ranked
    .filter((r) => !seen.has(r.listingId) && seen.add(r.listingId))
    .slice(0, HOME_COUNT)
    .sort(byDate);
}

/**
 * One page of quotes plus how many there are, for "Show more reviews", newest first. With
 * `listingId`: that apartment's own reviews; otherwise the home selection.
 */
export async function getReviewPage(
  locale: Locale,
  opts: { listingId?: string; source?: ReviewSource; offset?: number; limit?: number } = {},
): Promise<{ reviews: Review[]; total: number }> {
  const selection = opts.listingId ? (apartmentReviews[opts.listingId] ?? []) : homeSelection();
  const pool: Review[] = selection
    .filter((r) => !opts.source || r.source === opts.source)
    .map((r) => {
      const original = r.language ?? "en";
      return {
        ...r,
        text: r.text[locale],
        language: locale,
        ...(original === locale ? {} : { translatedFrom: original }),
        mock: false,
      };
    });
  const offset = opts.offset ?? 0;
  return { reviews: pool.slice(offset, offset + (opts.limit ?? pool.length)), total: pool.length };
}

/** Per-platform scores, each on its own scale (guests can check them at the source). */
export async function getReviewSummary(): Promise<{
  bySource: { google: ReviewAggregate } & Partial<Record<ReviewSource, ReviewAggregate>>;
}> {
  const bySource = Object.fromEntries(reviewScores.map((s) => [s.source, s]));
  const google = reviewScores.find((s) => s.source === "google");
  if (!google) throw new Error("reviewScores needs the Google score");
  return { bySource: { ...bySource, google } };
}
