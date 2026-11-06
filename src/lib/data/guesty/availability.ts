import "server-only";
import { cacheLife } from "next/cache";
import { addDays, localDateToISO } from "@/lib/dates";
import { guestyGet } from "./client";
import { sharedData } from "./shared-data";

/**
 * Availability and nightly prices from the Guesty Booking Engine API.
 *
 * - The calendar endpoint has no prices: only status and minimum stay per night.
 * - A search with dates returns the listings bookable for that whole stay, with their nightly rates
 *   (the prices guests pay, before rate-plan discounts). That powers the date search and "from".
 * Cached for minutes: availability changes as bookings come in, and the quote re-checks anyway.
 */

export interface GuestyCalendarDay {
  date: string;
  status: "available" | "unavailable" | "reserved" | "booked";
  minNights: number;
}

export async function fetchGuestyCalendar(listingId: string, from: string, to: string): Promise<GuestyCalendarDay[]> {
  "use cache";
  cacheLife("minutes");
  const days = await guestyGet<GuestyCalendarDay[]>(`/listings/${listingId}/calendar?from=${from}&to=${to}`);
  return days.map((d) => ({ date: d.date, status: d.status, minNights: d.minNights }));
}

interface SearchPage {
  results: Array<{ _id: string; nightlyRates?: Record<string, number> }>;
  pagination?: { total?: number; cursor?: { next?: string | null } };
}

/** Every listing bookable for the whole stay, with its nightly rates (all pages). */
async function searchStay(checkIn: string, checkOut: string, guests?: number): Promise<SearchPage["results"]> {
  const all: SearchPage["results"] = [];
  let cursor: string | undefined;
  for (let page = 0; page < 10; page++) {
    const query = new URLSearchParams({
      checkIn,
      checkOut,
      limit: "100",
      fields: "_id nightlyRates",
      ...(guests ? { minOccupancy: String(guests) } : {}),
      ...(cursor ? { cursor } : {}),
    });
    const res = await guestyGet<SearchPage>(`/listings?${query}`);
    all.push(...res.results);
    cursor = res.pagination?.cursor?.next ?? undefined;
    // Guesty gives a next cursor even when this page has everything (the next page is empty):
    // following it would double the requests, so stop once we hold the total.
    if (!cursor || !res.results.length || all.length >= (res.pagination?.total ?? Infinity)) break;
  }
  return all;
}

/** IDs of the listings bookable for this stay (min stay, closed dates and capacity included). */
export async function fetchAvailableListingIds(checkIn: string, checkOut: string, guests?: number): Promise<string[]> {
  "use cache";
  cacheLife("minutes");
  return (await searchStay(checkIn, checkOut, guests)).map((l) => l._id);
}

/** Days ahead that "from" prices look at, and the length of each sampled stay. */
const FROM_HORIZON_DAYS = 120;
const FROM_STAY_NIGHTS = 3;

/**
 * "From" price per listing: the lowest nightly rate guests can actually book in the next
 * 120 days. Guesty has no "lowest price" endpoint, so this samples back-to-back 3-night stays
 * (40 searches, run in parallel within the rate limit, ≈10 s). Shared across instances and
 * refreshed every 6 hours by one instance while the others serve the previous result; while the
 * very first one is being computed elsewhere, base prices are shown. Listings with no bookable
 * 3-night stay in that window are missing from the result (the caller falls back to the base price).
 */
export async function fetchGuestyFromRates(): Promise<Record<string, number>> {
  "use cache";
  const rates = await sharedData<Record<string, number> | null>("from-rates", 6 * 3600, computeFromRates, () => null);
  if (rates === null) {
    // Another instance is computing them: base prices for now, and ask again shortly.
    cacheLife("seconds");
    return {};
  }
  cacheLife("hours");
  return rates;
}

async function computeFromRates(): Promise<Record<string, number>> {
  const today = localDateToISO(new Date());
  const stays: string[] = [];
  for (let offset = 1; offset + FROM_STAY_NIGHTS <= FROM_HORIZON_DAYS; offset += FROM_STAY_NIGHTS) {
    stays.push(addDays(today, offset));
  }
  // The client's throttle spaces the requests; running them together just removes the waiting.
  const results = await Promise.all(stays.map((checkIn) => searchStay(checkIn, addDays(checkIn, FROM_STAY_NIGHTS))));
  const lowest: Record<string, number> = {};
  for (const listing of results.flat()) {
    for (const rate of Object.values(listing.nightlyRates ?? {})) {
      if (rate > 0 && rate < (lowest[listing._id] ?? Infinity)) lowest[listing._id] = rate;
    }
  }
  return lowest;
}
