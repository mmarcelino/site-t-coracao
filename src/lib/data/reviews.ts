import { curatedReviews, reviewScores } from "@/content/reviews";
import type { Locale, Review, ReviewAggregate, ReviewSource } from "./types";

/**
 * Reviews: a fixed, hand-picked selection of real guest reviews and a snapshot of the platform
 * scores (`src/content/reviews.ts`), refreshed by hand; no live feed. The quotes were written in
 * English; other locales get our translation, flagged with `translatedFrom`.
 */

/** One page of quotes plus how many there are, for "Show more reviews". Platforms take turns. */
export async function getReviewPage(
  locale: Locale,
  opts: { source?: ReviewSource; offset?: number; limit?: number } = {},
): Promise<{ reviews: Review[]; total: number }> {
  const pool: Review[] = curatedReviews
    .filter((r) => !opts.source || r.source === opts.source)
    .map((r) => ({
      ...r,
      text: r.text[locale],
      language: locale,
      ...(locale === "en" ? {} : { translatedFrom: "en" }),
      mock: false,
    }));
  const bySource = [...Map.groupBy(pool, (r) => r.source).values()];
  const rounds = Math.max(0, ...bySource.map((l) => l.length));
  const ordered = Array.from({ length: rounds }, (_, i) => bySource.flatMap((l) => l[i] ?? [])).flat();
  const offset = opts.offset ?? 0;
  return { reviews: ordered.slice(offset, offset + (opts.limit ?? ordered.length)), total: ordered.length };
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
