import type { Localized, Review, ReviewAggregate } from "@/lib/data/types";
import scores from "./review-scores.json";

/**
 * A hand-picked guest review as stored in the content files (each apartment's in
 * `apartment-reviews.json`; the home page draws the newest of them). `language`: what the guest
 * wrote in ("en" when omitted); the other locale shows our translation.
 */
export type CuratedReview = Omit<Review, "text" | "language" | "translatedFrom" | "mock"> & {
  text: Localized;
  language?: string;
};

/**
 * Scores, each on its platform's own scale. Airbnb and Booking.com: averages of every guest review
 * in Guesty on the date in `review-scores.json` (not the platforms' own displayed figures, which can
 * weigh recent reviews differently), updated by `pnpm reviews:apply`. Google: read by hand from
 * "Tripas-Coração (Office)" on 2026-10-30. TO CONFIRM before launch.
 */
export const reviewScores: ReviewAggregate[] = [
  { source: "google", score: 4.9, outOf: 5, count: 516, mock: false },
  { source: "airbnb", score: scores.airbnb.score, outOf: 5, count: scores.airbnb.count, mock: false },
  { source: "booking", score: scores.booking.score, outOf: 10, count: scores.booking.count, mock: false },
];
