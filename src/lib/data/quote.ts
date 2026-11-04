import { eachNight, isISODate, nightsBetween, parseISODate } from "@/lib/dates";
import { isRangeAvailable } from "./availability";
import { isGuestyConfigured } from "./guesty/client";
import { fetchGuestyQuote } from "./guesty/quotes";
import { getRawListing } from "./listings";
import type { GuestyListing, GuestyQuote, Quote, QuoteRequest, QuoteResult } from "./types";

/**
 * Quotes: live from Guesty's Booking Engine API when keys are set (`guesty/quotes.ts`), else this
 * MOCK engine, which builds a response shaped like Guesty's quote. Both go through
 * `fromGuestyQuote`, so the widget sees one shape.
 *
 * Mock pricing rules (INVENTED, for realism only; Guesty's dynamic pricing will replace them):
 * - nightly rate = Guesty base price × seasonal factor × 1.12 on Friday/Saturday nights
 * - weekly (7+) / monthly (28+) factors from Guesty listing settings
 * - extra guest fee per night above `guestsIncludedInRegularFee`
 * - Porto tourist tax: €3 per guest per night, capped at 7 nights (TO CONFIRM: assumes all guests 13+)
 */
const SEASON = [0.8, 0.8, 0.9, 1.0, 1.05, 1.15, 1.2, 1.25, 1.15, 1.0, 0.85, 0.95];
const WEEKEND = 1.12;
const TOURIST_TAX_PER_NIGHT = 3;
const TOURIST_TAX_MAX_NIGHTS = 7;

function nightlyRate(listing: GuestyListing, date: string): number {
  const d = parseISODate(date);
  const weekday = d.getUTCDay();
  const weekend = weekday === 5 || weekday === 6 ? WEEKEND : 1;
  return Math.round(listing.prices.basePrice * (SEASON[d.getUTCMonth()] ?? 1) * weekend);
}

function buildGuestyQuote(listing: GuestyListing, req: QuoteRequest): GuestyQuote {
  const currency = listing.prices.currency;
  const nights = eachNight(req.checkIn, req.checkOut);
  const days = nights.map((date) => {
    const price = nightlyRate(listing, date);
    return { date, price, currency, basePrice: listing.prices.basePrice };
  });
  const gross = days.reduce((sum, d) => sum + d.price, 0);
  const factor =
    nights.length >= 28
      ? (listing.prices.monthlyPriceFactor ?? 1)
      : nights.length >= 7
        ? (listing.prices.weeklyPriceFactor ?? 1)
        : 1;
  const discount = Math.round(gross * (1 - factor));
  const extraGuests = Math.max(0, req.guests - (listing.prices.guestsIncludedInRegularFee ?? listing.accommodates));
  const extraGuestFee = extraGuests * (listing.prices.extraPersonFee ?? 0) * nights.length;
  const fareAccommodation = gross - discount + extraGuestFee;
  const fareCleaning = listing.prices.cleaningFee ?? 0;
  const tax = req.guests * TOURIST_TAX_PER_NIGHT * Math.min(nights.length, TOURIST_TAX_MAX_NIGHTS);

  const invoiceItems: GuestyQuote["rates"]["ratePlans"][number]["ratePlan"]["money"]["invoiceItems"] = [
    { title: "Accommodation fare", amount: gross, currency, type: "ACCOMMODATION_FARE", normalType: "AF" },
    ...(extraGuestFee
      ? [{ title: "Extra guest fee", amount: extraGuestFee, currency, type: "ACCOMMODATION_FARE" as const, normalType: "EGF" }]
      : []),
    ...(discount
      ? [{ title: "Length of stay discount", amount: -discount, currency, type: "DISCOUNT" as const, normalType: "LOS" }]
      : []),
    { title: "Cleaning fee", amount: fareCleaning, currency, type: "CLEANING_FEE", normalType: "CF" },
    { title: "City tax", amount: tax, currency, type: "TAX", normalType: "CITY_TAX" },
  ];

  return {
    _id: `mock-quote-${listing._id}-${req.checkIn}-${req.checkOut}-${req.guests}`,
    createdAt: "2026-10-26T00:00:00.000Z",
    expiresAt: "2026-10-27T00:00:00.000Z",
    rates: {
      ratePlans: [
        {
          ratePlan: {
            _id: "mock-rate-plan-direct",
            name: "Direct booking",
            cancellationPolicy: "flexible",
            money: {
              currency,
              fareAccommodation,
              fareCleaning,
              totalFees: fareCleaning,
              subTotalPrice: fareAccommodation + fareCleaning,
              totalTaxes: tax,
              hostPayout: fareAccommodation + fareCleaning + tax,
              invoiceItems,
            },
          },
          days,
        },
      ],
    },
  };
}

/** Guesty's cancellation policies, most lenient first (unknown ones count as strict). */
const POLICY_ORDER = ["flexible", "semi_flexible", "moderate", "semi_moderate", "strict", "super_strict"];

function leniency(policy: string): number {
  const i = POLICY_ORDER.indexOf(policy);
  return i === -1 ? POLICY_ORDER.indexOf("strict") : i;
}

/**
 * Guesty BE quote → our Quote. A listing can have several rate plans (e.g. Daily, Early Book,
 * Non-Refundable): we show the most lenient one, matching the "flexible cancellation" perk
 * (TO CONFIRM with the client which plans the site should offer).
 */
export function fromGuestyQuote(raw: GuestyQuote, req: QuoteRequest, mock: boolean): Quote {
  const plan = [...raw.rates.ratePlans].sort(
    (a, b) => leniency(a.ratePlan.cancellationPolicy) - leniency(b.ratePlan.cancellationPolicy),
  )[0];
  if (!plan) throw new Error("Quote has no rate plans");
  const { money } = plan.ratePlan;
  const sum = (match: (item: (typeof money.invoiceItems)[number]) => boolean) =>
    money.invoiceItems.filter(match).reduce((s, i) => s + i.amount, 0);
  const lengthOfStayAdjustment = sum((i) => i.type === "DISCOUNT");
  const extraGuestFee = sum((i) => i.normalType === "EGF");
  const otherFees = money.totalFees - money.fareCleaning;
  const rank = leniency(plan.ratePlan.cancellationPolicy);

  return {
    id: raw._id,
    listingId: req.listingId,
    checkIn: req.checkIn,
    checkOut: req.checkOut,
    guests: req.guests,
    nights: nightsBetween(req.checkIn, req.checkOut),
    currency: money.currency,
    nightly: plan.days.map((d) => ({ date: d.date, price: d.price })),
    // Whatever Guesty itemises, the lines must add up to its total: the stay is the remainder.
    accommodation: money.subTotalPrice - money.fareCleaning - otherFees - extraGuestFee - lengthOfStayAdjustment,
    lengthOfStayAdjustment,
    cleaningFee: money.fareCleaning,
    extraGuestFee,
    otherFees,
    touristTax: money.totalTaxes,
    total: money.subTotalPrice + money.totalTaxes,
    cancellationPolicy: rank <= 1 ? "flexible" : rank <= 3 ? "moderate" : "strict",
    ratePlanId: plan.ratePlan._id,
    ratePlanName: plan.ratePlan.name,
    expiresAt: raw.expiresAt,
    mock,
  };
}

export async function getQuote(req: QuoteRequest): Promise<QuoteResult> {
  if (!isISODate(req.checkIn) || !isISODate(req.checkOut) || req.checkOut <= req.checkIn) {
    return { ok: false, reason: "invalid-dates" };
  }
  const listing = await getRawListing(req.listingId);
  if (!listing) return { ok: false, reason: "invalid-dates" };
  if (!Number.isInteger(req.guests) || req.guests < 1 || req.guests > listing.accommodates) {
    return { ok: false, reason: "max-guests" };
  }
  if (isGuestyConfigured()) {
    // Guesty applies the minimum stay, blocked dates and its own pricing rules itself.
    try {
      const result = await fetchGuestyQuote(req.listingId, req.checkIn, req.checkOut, req.guests);
      if (result.ok) return { ok: true, quote: fromGuestyQuote(result.quote, req, false) };
      return result.reason === "min-nights"
        ? { ok: false, reason: "min-nights", minNights: listing.terms.minNights }
        : { ok: false, reason: "unavailable" };
    } catch (error) {
      console.error(`[guesty] ${error instanceof Error ? error.message : "quote failed"}`);
      return { ok: false, reason: "error" };
    }
  }
  if (nightsBetween(req.checkIn, req.checkOut) < listing.terms.minNights) {
    return { ok: false, reason: "min-nights", minNights: listing.terms.minNights };
  }
  if (!(await isRangeAvailable(listing._id, req.checkIn, req.checkOut))) {
    return { ok: false, reason: "unavailable" };
  }
  return { ok: true, quote: fromGuestyQuote(buildGuestyQuote(listing, req), req, true) };
}
