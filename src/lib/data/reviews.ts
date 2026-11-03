import { getListings } from "./listings";
import { mockReviews, mockSourceAggregates } from "./mock/reviews";
import type { Locale, Review, ReviewAggregate, ReviewSource } from "./types";

/**
 * Reviews. Excerpts and per-platform aggregates are MOCK (see ./mock/reviews.ts).
 * The overall figure is computed from real Guesty per-listing aggregates, but only over the
 * 10 listings in the mock set, so it is flagged mock too until it covers the whole portfolio.
 */
export async function getReviews(
  locale: Locale,
  opts: { listingId?: string; limit?: number } = {},
): Promise<Review[]> {
  return (await getReviewPage(locale, opts)).reviews;
}

/**
 * One page of reviews plus the total that matches, for "Show more" on the home page. Shaped for the real sources,
 * which page by offset (Guesty) or return a handful per place (Google).
 */
export async function getReviewPage(
  locale: Locale,
  opts: { listingId?: string; source?: ReviewSource; offset?: number; limit?: number } = {},
): Promise<{ reviews: Review[]; total: number }> {
  const pool = mockReviews.filter(
    (r) => (!opts.listingId || r.listingId === opts.listingId) && (!opts.source || r.source === opts.source),
  );
  // Prefer reviews in the visitor's language, then the rest; keep the newest first within each.
  const sorted = [...pool].sort((a, b) => {
    const lang = Number(b.language === locale) - Number(a.language === locale);
    return lang !== 0 ? lang : b.date.localeCompare(a.date);
  });
  // Unless one platform is asked for, take turns across platforms so no single one fills a page.
  const bySource = [...Map.groupBy(sorted, (r) => r.source).values()];
  const rounds = Math.max(0, ...bySource.map((l) => l.length));
  const ordered = opts.source ? sorted : Array.from({ length: rounds }, (_, i) => bySource.flatMap((l) => l[i] ?? [])).flat();
  const offset = opts.offset ?? 0;
  return { reviews: ordered.slice(offset, offset + (opts.limit ?? ordered.length)), total: ordered.length };
}

export async function getReviewSummary(locale: Locale): Promise<{
  overall: ReviewAggregate;
  bySource: Record<ReviewSource, ReviewAggregate>;
}> {
  const listings = await getListings(locale);
  const rated = listings.filter((l) => l.reviews);
  const count = rated.reduce((s, l) => s + (l.reviews?.count ?? 0), 0);
  const weighted = rated.reduce((s, l) => s + (l.reviews?.score ?? 0) * (l.reviews?.count ?? 0), 0);
  return {
    overall: { source: "guesty", outOf: 10, score: count ? Math.round((weighted / count) * 10) / 10 : 0, count, mock: true },
    bySource: mockSourceAggregates,
  };
}
