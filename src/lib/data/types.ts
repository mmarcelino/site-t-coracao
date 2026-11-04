/**
 * Domain types used by pages and components (CLAUDE.md §6).
 *
 * Two layers:
 * - `Guesty*` types mirror the shapes returned by Guesty's Booking Engine API (listings are
 *   normalized slightly in `guesty/listings.ts`, e.g. the licence object → string).
 * - Domain types (`Listing`, `Building`, `Quote`, ...) are what the UI consumes, already
 *   resolved for one locale. Mappers in `src/lib/data/*` turn raw data into domain types,
 *   so swapping mock → Guesty only touches the data layer.
 */
import type { Locale } from "@/i18n/routing";

export type { Locale };
export type Localized<T = string> = Record<Locale, T>;

/* ------------------------------------------------------------------ Guesty (raw) */

export interface GuestyPicture {
  original: string;
  caption: string;
}

export interface GuestyAddress {
  full: string;
  street: string;
  city: string;
  zipcode: string;
  country: string;
  lat: number;
  lng: number;
  floor?: string | null;
  neighborhood?: string | null;
}

export interface GuestyListing {
  _id: string;
  title: string;
  nickname: string | null;
  propertyType: string;
  roomType: string;
  accommodates: number;
  bedrooms: number;
  bathrooms: number;
  beds: number | null;
  address: GuestyAddress;
  pictures: GuestyPicture[];
  publicDescription: {
    summary?: string;
    space?: string;
    access?: string;
    neighborhood?: string;
    transit?: string;
    notes?: string;
    houseRules?: string;
  };
  amenities: string[];
  prices: {
    basePrice: number;
    currency: string;
    cleaningFee: number | null;
    extraPersonFee: number | null;
    guestsIncludedInRegularFee: number | null;
    weeklyPriceFactor: number | null;
    monthlyPriceFactor: number | null;
  };
  terms: { minNights: number; maxNights: number };
  defaultCheckInTime: string;
  defaultCheckOutTime: string;
  license: string | null;
  /** Guesty's aggregate across channels, 0–10 scale. */
  reviews: { avg: number | null; total: number };
  /** The client tags each listing with its building ("Taipas", "Sá da Bandeira"...). */
  tags?: string[];
  areaSquareFeet?: number | null;
}

/** Shape of a Guesty Booking Engine API quote (subset we use; checked against a live quote 2026-11-04). */
export interface GuestyQuote {
  _id: string;
  createdAt: string;
  expiresAt: string;
  rates: {
    ratePlans: Array<{
      ratePlan: {
        _id: string;
        name: string;
        /** e.g. "flexible", "semi_moderate", "strict", "super_strict" (non-refundable). */
        cancellationPolicy: string;
        priceAdjustment?: { type: string; direction: "increase" | "decrease"; amount: number };
        money: {
          currency: string;
          fareAccommodation: number;
          fareCleaning: number;
          totalFees: number;
          subTotalPrice: number;
          totalTaxes: number;
          hostPayout: number;
          invoiceItems: Array<{
            title: string;
            amount: number;
            currency: string;
            /** ACCOMMODATION_FARE, CLEANING_FEE, TAX, DISCOUNT, ... */
            type: string;
            normalType: string;
          }>;
        };
      };
      /** Per-night rates before the booking-engine adjustments: they don't add up to the fare. */
      days: Array<{ date: string; price: number; currency: string; basePrice: number }>;
    }>;
  };
}

/* ------------------------------------------------------------------ Domain */

export type ListingCategory = "studio" | "one-bed" | "two-bed" | "three-bed" | "house";

/** Tags behind collections and apartment filters. */
export type ListingTag = "couples" | "families" | "sea" | "outdoor" | "views" | "remote-work";
export const listingTags: ListingTag[] = ["couples", "families", "sea", "outdoor", "views", "remote-work"];

export interface Picture {
  src: string;
  alt: string;
}

export interface Money {
  amount: number;
  currency: string;
}

export interface ReviewAggregate {
  source: ReviewSource | "guesty";
  /** On the source's own scale (see `outOf`), never converted: guests can check it at the source. */
  score: number;
  /** Google and Airbnb rate out of 5; Booking.com and Guesty's aggregates out of 10. */
  outOf: 5 | 10;
  count: number;
  /** True when the numbers are placeholders, not real client data. */
  mock: boolean;
}

export interface Listing {
  id: string;
  slug: string;
  /** Guest-facing name: Guesty's title without the brand prefix, e.g. "Mouzinho32 Rooftop E". */
  title: string;
  /** Original Guesty title, kept for reference/search. */
  guestyTitle: string;
  nickname: string | null;
  category: ListingCategory;
  tags: ListingTag[];
  propertyType: string;
  accommodates: number;
  bedrooms: number;
  bathrooms: number;
  beds: number | null;
  /** From Guesty's `areaSquareFeet` when plausible; null when unknown (never shown then). */
  areaSqm: number | null;
  /** Empty when unknown. */
  floor: string;
  /** null when unknown: the UI then says nothing about lifts. */
  hasLift: boolean | null;
  address: { street: string; zipcode: string; city: string; lat: number; lng: number };
  buildingId: string;
  neighbourhoodSlug: string;
  pictures: Picture[];
  tagline: string;
  description: {
    summary: string;
    space: string;
    neighbourhood: string;
    notes: string;
  };
  highlights: string[];
  amenities: AmenityKey[];
  price: {
    /** Lowest nightly rate bookable in the next 120 days (Guesty), else the base price. */
    from: Money;
    base: Money;
    cleaningFee: Money;
    extraPersonFee: Money;
    guestsIncluded: number;
    weeklyFactor: number;
    monthlyFactor: number;
  };
  minNights: number;
  checkInTime: string;
  checkOutTime: string;
  licence: string | null;
  reviews: ReviewAggregate | null;
}

export interface Building {
  id: string;
  slug: string;
  name: string;
  street: string;
  neighbourhoodSlug: string;
  /** e.g. "Late 19th century" — INVENTED until the client supplies history. Empty when unknown. */
  era: string;
  /** Empty for buildings we haven't written up yet (the UI hides them). */
  historyLine: string;
  story: string;
  heroImage: Picture;
  storyImage: Picture;
  listingIds: string[];
  hasLift: boolean | null;
}

export type GuideCategory = "eat" | "drink" | "see" | "practical";

export interface GuideEntry {
  category: GuideCategory;
  name: string;
  note: string;
}

export interface Neighbourhood {
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  nearby: string[];
  guide: GuideEntry[];
  coordinates: { lat: number; lng: number };
  image: Picture;
}

export interface QuoteRequest {
  listingId: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guests: number;
}

export interface QuoteNight {
  date: string;
  price: number;
}

export interface Quote {
  id: string;
  listingId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  currency: string;
  nightly: QuoteNight[];
  accommodation: number;
  /** Length-of-stay adjustment (weekly/monthly factor), as a negative amount. */
  lengthOfStayAdjustment: number;
  cleaningFee: number;
  extraGuestFee: number;
  /** Fees other than cleaning (e.g. a pet fee), so the lines always add up to the total. */
  otherFees: number;
  touristTax: number;
  total: number;
  cancellationPolicy: "flexible" | "moderate" | "strict";
  /** The Guesty rate plan priced here (needed to book it later). */
  ratePlanId: string;
  ratePlanName: string;
  /** Expiry of the Guesty quote (24 h). */
  expiresAt: string;
  mock: boolean;
}

export type QuoteResult =
  | { ok: true; quote: Quote }
  | { ok: false; reason: "unavailable" | "min-nights" | "max-guests" | "invalid-dates" | "error"; minNights?: number };

export interface AvailabilityDay {
  date: string;
  available: boolean;
}

export type ReviewSource = "google" | "airbnb" | "booking";

export interface Review {
  id: string;
  source: ReviewSource;
  /** Native scale of the source: Google/Airbnb 1–5, Booking 1–10. */
  rating: number;
  author: string;
  date: string;
  language: Locale | "fr" | "es" | "de";
  text: string;
  listingId?: string;
  mock: boolean;
}

export type AmenityKey =
  | "wifi"
  | "workspace"
  | "air-conditioning"
  | "heating"
  | "kitchen"
  | "dishwasher"
  | "washer"
  | "dryer"
  | "coffee"
  | "oven"
  | "tv"
  | "linens"
  | "towels"
  | "hair-dryer"
  | "iron"
  | "crib"
  | "high-chair"
  | "balcony"
  | "view"
  | "long-stays"
  | "smoke-detector"
  | "first-aid"
  | "paid-parking-nearby";
