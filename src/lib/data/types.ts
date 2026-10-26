/**
 * Domain types used by pages and components (CLAUDE.md §6).
 *
 * Two layers:
 * - `Guesty*` types mirror the raw shapes returned by Guesty (Open API listings and the
 *   Booking Engine API quote). Verify field names against Guesty's docs when access arrives.
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
}

/** Shape of a Guesty Booking Engine API quote (subset we render). */
export interface GuestyQuote {
  _id: string;
  createdAt: string;
  expiresAt: string;
  listingId: string;
  checkInDateLocalized: string;
  checkOutDateLocalized: string;
  guestsCount: number;
  rates: {
    ratePlans: Array<{
      ratePlan: {
        _id: string;
        name: string;
        cancellationPolicy: string;
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
            type: "ACCOMMODATION_FARE" | "CLEANING_FEE" | "TAX" | "DISCOUNT";
            normalType: string;
          }>;
        };
      };
      days: Array<{ date: string; price: number; currency: string; basePrice: number }>;
    }>;
  };
}

/* ------------------------------------------------------------------ Domain */

export type ListingCategory = "studio" | "one-bed" | "two-bed" | "house";

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
  /** Normalised to a 0–10 scale (Booking.com style); Google/Airbnb 0–5 are doubled. */
  score: number;
  count: number;
  /** True when the numbers are placeholders, not real client data. */
  mock: boolean;
}

export interface Listing {
  id: string;
  slug: string;
  /** Guest-facing name, e.g. "Rooftop E". */
  title: string;
  /** Original Guesty title, kept for reference/search. */
  guestyTitle: string;
  nickname: string | null;
  category: ListingCategory;
  propertyType: string;
  accommodates: number;
  bedrooms: number;
  bathrooms: number;
  beds: number | null;
  /** INVENTED for the mock: Guesty does not expose this for these listings. */
  areaSqm: number;
  floor: string;
  hasLift: boolean;
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
  /** e.g. "Late 19th century" — INVENTED until the client supplies history. */
  era: string;
  historyLine: string;
  story: string;
  heroImage: Picture;
  storyImage: Picture;
  listingIds: string[];
  hasLift: boolean;
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
  touristTax: number;
  total: number;
  cancellationPolicy: "flexible" | "moderate" | "strict";
  mock: true;
}

export type QuoteResult =
  | { ok: true; quote: Quote }
  | { ok: false; reason: "unavailable" | "min-nights" | "max-guests" | "invalid-dates"; minNights?: number };

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
