"use server";

import { isLocale } from "@/i18n/routing";
import { getReviewPage, type Review } from "@/lib/data";

/**
 * "Show more reviews" on the home page. The seam for the real sources: later this pages through
 * Guesty/Google instead of the mocks. Inputs are validated because server actions are public endpoints.
 */
export async function requestReviews(locale: string, offset: number): Promise<Review[]> {
  if (!isLocale(locale) || !Number.isInteger(offset) || offset < 0) return [];
  return (await getReviewPage(locale, { offset, limit: 4 })).reviews;
}
