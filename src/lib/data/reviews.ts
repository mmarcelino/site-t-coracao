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
  const pool = opts.listingId ? mockReviews.filter((r) => r.listingId === opts.listingId) : mockReviews;
  // Prefer reviews in the visitor's language, then the rest; keep the newest first within each.
  const sorted = [...pool].sort((a, b) => {
    const lang = Number(b.language === locale) - Number(a.language === locale);
    return lang !== 0 ? lang : b.date.localeCompare(a.date);
  });
  return sorted.slice(0, opts.limit ?? sorted.length);
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
    overall: { source: "guesty", score: count ? Math.round((weighted / count) * 10) / 10 : 0, count, mock: true },
    bySource: mockSourceAggregates,
  };
}
