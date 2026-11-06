import type { CuratedReview } from "./reviews";
import data from "./apartment-reviews.json";

/**
 * Each apartment's reviews (up to 20, newest first), keyed by Guesty listing ID, kept in
 * `apartment-reviews.json` and refreshed every few months with `pnpm reviews:fetch` and
 * `pnpm reviews:apply` (`scripts/reviews.mjs`). Picked from the client's Guesty account (Airbnb and
 * Booking.com) for top score (Airbnb 5, Booking.com 9–10) and no complaints; English first, then
 * other languages where a home had too few. Wording is the guest's own, with small typos corrected
 * in some English quotes; text in other languages, and the Portuguese of English quotes, is our
 * translation (`language` is what the guest wrote in, "en" when omitted), labelled on the site.
 * TO CONFIRM with the client: permission to reuse platform reviews on the site.
 */
export const apartmentReviews = data as Record<string, CuratedReview[]>;
