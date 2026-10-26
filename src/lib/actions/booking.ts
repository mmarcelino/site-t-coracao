"use server";

import { addDays, isISODate } from "@/lib/dates";
import { getBlockedNights, getQuote } from "@/lib/data";
import type { QuoteRequest, QuoteResult } from "@/lib/data";

/**
 * Server actions called by the booking widget. They are the seam for the real integration:
 * later these call Guesty's Booking Engine API (live availability and quotes) instead of mocks.
 * Inputs are validated here because server actions are public endpoints.
 */
const LISTING_ID = /^[0-9a-f]{24}$/;

export async function requestQuote(req: QuoteRequest): Promise<QuoteResult> {
  if (!LISTING_ID.test(req.listingId)) return { ok: false, reason: "invalid-dates" };
  return getQuote({
    listingId: req.listingId,
    checkIn: String(req.checkIn),
    checkOut: String(req.checkOut),
    guests: Number(req.guests),
  });
}

/** Blocked nights for the next ~13 months starting at `from` (YYYY-MM-DD). */
export async function requestBlockedNights(listingId: string, from: string): Promise<string[]> {
  if (!LISTING_ID.test(listingId) || !isISODate(from)) return [];
  return getBlockedNights(listingId, from, addDays(from, 400));
}
