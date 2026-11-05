"use server";

import { isLocale } from "@/i18n/routing";
import { getReviewPage, type Review } from "@/lib/data";

/**
 * "Show more reviews" (home and apartment pages), four at a time, from the shared Guesty review
 * pool. Inputs are validated because server actions are public endpoints.
 */
export async function requestReviews(locale: string, offset: number): Promise<Review[]> {
  if (!isLocale(locale) || !Number.isInteger(offset) || offset < 0 || offset > 1000) return [];
  return (await getReviewPage(locale, { offset, limit: 4 })).reviews;
}
