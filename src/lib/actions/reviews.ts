"use server";

import { isLocale } from "@/i18n/routing";
import { getReviewPage, type Review } from "@/lib/data";

/**
 * "Show more reviews" on the home page (four at a time) and on apartment pages (`listingId`, three
 * at a time), from the hand-picked reviews in `src/content/`. Inputs are validated because server
 * actions are public endpoints.
 */
export async function requestReviews(locale: string, offset: number, listingId?: string): Promise<Review[]> {
  if (!isLocale(locale) || !Number.isInteger(offset) || offset < 0) return [];
  if (listingId !== undefined && (typeof listingId !== "string" || !/^[a-f0-9]{24}$/.test(listingId))) return [];
  return (await getReviewPage(locale, { offset, limit: listingId ? 3 : 4, listingId })).reviews;
}
