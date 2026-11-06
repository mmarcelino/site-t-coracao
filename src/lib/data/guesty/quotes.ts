import "server-only";
import { cacheLife } from "next/cache";
import type { GuestyQuote } from "../types";
import { GuestyError, guestyRequest } from "./client";

/**
 * Price quotes from the Guesty Booking Engine API (POST /reservations/quotes).
 *
 * A quote is a priced offer valid for 24 hours. It doesn't block the nights (checked 2026-11-04:
 * the calendar is unchanged after a quote) and creates no reservation. The same stay is reused
 * for up to an hour instead of asking Guesty again every time a guest re-opens the widget.
 */
export type GuestyQuoteResult =
  | { ok: true; quote: GuestyQuote }
  | { ok: false; reason: "unavailable" | "min-nights" };

interface NotApplicable {
  notApplicable?: { minNights?: boolean };
}

export async function fetchGuestyQuote(
  listingId: string,
  checkIn: string,
  checkOut: string,
  guests: number,
): Promise<GuestyQuoteResult> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 900, expire: 3600 });
  const res = await guestyRequest<GuestyQuote>("POST", "/reservations/quotes", {
    listingId,
    checkInDateLocalized: checkIn,
    checkOutDateLocalized: checkOut,
    guestsCount: guests,
  });
  if (res.ok) return { ok: true, quote: res.data };
  if (res.error?.code === "LISTING_IS_NOT_AVAILABLE") {
    // Guesty says which rule failed for each rate plan: when the only problem is the minimum stay,
    // say so; anything else (booked, blocked, closed) reads as unavailable.
    const plans = (res.error.data?.moreDetails as { notApplicableRatePlans?: NotApplicable[] } | undefined)
      ?.notApplicableRatePlans;
    const onlyMinNights = plans?.length
      ? plans.every((p) => {
          const flags = Object.entries(p.notApplicable ?? {}).filter(([, v]) => v === true).map(([k]) => k);
          return flags.length === 1 && flags[0] === "minNights";
        })
      : false;
    return { ok: false, reason: onlyMinNights ? "min-nights" : "unavailable" };
  }
  // Thrown, not returned, so a passing failure isn't cached as an answer.
  throw new GuestyError(`Guesty quote failed (${res.status}${res.error?.code ? `, ${res.error.code}` : ""})`, res.status);
}
