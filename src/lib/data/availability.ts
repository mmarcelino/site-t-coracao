import { addDays, eachNight } from "@/lib/dates";
import type { AvailabilityDay } from "./types";

/**
 * MOCK availability: a deterministic pseudo-random booking calendar per listing, so screenshots
 * and tests are stable and nothing depends on "today". Roughly 60% occupancy, stays of 2–6
 * nights. Replace with Guesty's calendar endpoint later.
 */
const CALENDAR_START = "2026-01-01";
const CALENDAR_DAYS = 365 * 3;

function seedFrom(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const bookedCache = new Map<string, Set<string>>();

function bookedNights(listingId: string): Set<string> {
  const cached = bookedCache.get(listingId);
  if (cached) return cached;
  const random = mulberry32(seedFrom(listingId));
  const booked = new Set<string>();
  let day = 0;
  while (day < CALENDAR_DAYS) {
    day += 1 + Math.floor(random() * 5); // free gap: 1–5 nights
    const stay = 2 + Math.floor(random() * 5); // booked stay: 2–6 nights
    for (let i = 0; i < stay && day < CALENDAR_DAYS; i++, day++) booked.add(addDays(CALENDAR_START, day));
  }
  bookedCache.set(listingId, booked);
  return booked;
}

export async function getAvailability(listingId: string, from: string, to: string): Promise<AvailabilityDay[]> {
  const booked = bookedNights(listingId);
  return eachNight(from, to).map((date) => ({ date, available: !booked.has(date) }));
}

/** Nights (YYYY-MM-DD) that cannot be booked between `from` and `to`. */
export async function getBlockedNights(listingId: string, from: string, to: string): Promise<string[]> {
  return (await getAvailability(listingId, from, to)).filter((d) => !d.available).map((d) => d.date);
}

export async function isRangeAvailable(listingId: string, checkIn: string, checkOut: string): Promise<boolean> {
  const booked = bookedNights(listingId);
  return eachNight(checkIn, checkOut).every((night) => !booked.has(night));
}
