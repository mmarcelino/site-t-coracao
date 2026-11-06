import "server-only";
import { cacheLife } from "next/cache";
import type { GuestyListing } from "../types";
import { guestyGet } from "./client";
import { sharedData } from "./shared-data";

/**
 * Listings from the Guesty Booking Engine API, normalized to `GuestyListing`.
 *
 * - The list endpoint returns everything the cards and filters need in one call (with `fields`),
 *   but not terms, licence or check-in times: those come from the single-listing endpoint, only
 *   when one home is shown or quoted.
 * - Both are cached for hours (`cacheLife("hours")`), so pages are pre-rendered and visitors never
 *   wait on Guesty; prices and availability that must be live go through the quote/calendar calls.
 */

interface BeListing {
  _id: string;
  title: string;
  nickname?: string | null;
  propertyType: string;
  roomType: string;
  accommodates: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  beds?: number | null;
  address: {
    full?: string;
    street?: string;
    city?: string;
    country?: string;
    lat: number;
    lng: number;
    floor?: string | null;
    neighborhood?: string | null;
  };
  pictures?: Array<{ original: string; caption?: string | null }>;
  publicDescription?: GuestyListing["publicDescription"];
  amenities?: string[];
  prices: {
    basePrice: number;
    currency: string;
    cleaningFee?: number | null;
    extraPersonFee?: number | null;
    guestsIncludedInRegularFee?: number | null;
    weeklyPriceFactor?: number | null;
    monthlyPriceFactor?: number | null;
  };
  terms?: { minNights: number; maxNights: number };
  defaultCheckInTime?: string;
  defaultCheckOutTime?: string;
  license?: { licenseNumber?: string | null } | null;
  reviews?: { avg: number | null; total: number };
  tags?: string[];
  areaSquareFeet?: number | null;
}

const LIST_FIELDS = [
  "_id",
  "title",
  "nickname",
  "propertyType",
  "roomType",
  "accommodates",
  "bedrooms",
  "bathrooms",
  "beds",
  "address",
  "pictures",
  "publicDescription",
  "amenities",
  "prices",
  "reviews",
  "tags",
  "areaSquareFeet",
].join(" ");

function normalize(raw: BeListing): GuestyListing {
  const full = raw.address.full ?? "";
  return {
    _id: raw._id,
    title: raw.title,
    nickname: raw.nickname ?? null,
    propertyType: raw.propertyType,
    roomType: raw.roomType,
    accommodates: raw.accommodates,
    bedrooms: raw.bedrooms ?? 0,
    bathrooms: raw.bathrooms ?? 1,
    beds: raw.beds ?? null,
    address: {
      full,
      street: raw.address.street ?? "",
      city: raw.address.city ?? "Porto",
      // Guesty has no separate postcode field for these listings; it's inside the full address.
      zipcode: full.match(/\b\d{4}-\d{3}\b/)?.[0] ?? "",
      country: raw.address.country ?? "Portugal",
      lat: raw.address.lat,
      lng: raw.address.lng,
      floor: raw.address.floor ?? null,
      neighborhood: raw.address.neighborhood ?? null,
    },
    pictures: (raw.pictures ?? []).map((p) => ({ original: p.original, caption: p.caption ?? "" })),
    publicDescription: raw.publicDescription ?? {},
    amenities: raw.amenities ?? [],
    prices: {
      basePrice: raw.prices.basePrice,
      currency: raw.prices.currency,
      cleaningFee: raw.prices.cleaningFee ?? null,
      extraPersonFee: raw.prices.extraPersonFee ?? null,
      guestsIncludedInRegularFee: raw.prices.guestsIncludedInRegularFee ?? null,
      weeklyPriceFactor: raw.prices.weeklyPriceFactor ?? null,
      monthlyPriceFactor: raw.prices.monthlyPriceFactor ?? null,
    },
    // List responses don't carry these; `fetchGuestyListing` fills them in.
    terms: raw.terms ?? { minNights: 1, maxNights: 365 },
    defaultCheckInTime: raw.defaultCheckInTime ?? "",
    defaultCheckOutTime: raw.defaultCheckOutTime ?? "",
    license: raw.license?.licenseNumber ?? null,
    reviews: raw.reviews ?? { avg: null, total: 0 },
    tags: raw.tags ?? [],
    areaSquareFeet: raw.areaSquareFeet ?? null,
  };
}

export async function fetchGuestyListings(): Promise<GuestyListing[]> {
  "use cache";
  cacheLife("hours");
  return sharedData("listings", 3600, loadListings);
}

async function loadListings(): Promise<GuestyListing[]> {
  const all: BeListing[] = [];
  let cursor: string | undefined;
  // Cursor pagination; 42 listings fit in one page, the cap only guards against a loop.
  for (let page = 0; page < 10; page++) {
    const query = new URLSearchParams({ limit: "100", fields: LIST_FIELDS, ...(cursor ? { cursor } : {}) });
    const res = await guestyGet<{ results: BeListing[]; pagination?: { total?: number; cursor?: { next?: string | null } } }>(
      `/listings?${query}`,
    );
    all.push(...res.results);
    cursor = res.pagination?.cursor?.next ?? undefined;
    if (!cursor || !res.results.length || all.length >= (res.pagination?.total ?? Infinity)) break;
  }
  return all.map(normalize);
}

/** One listing with its terms, licence and check-in/out times. */
export async function fetchGuestyListing(id: string): Promise<GuestyListing | null> {
  "use cache";
  cacheLife("hours");
  if (!/^[a-f0-9]{24}$/.test(id)) return null;
  return normalize(await guestyGet<BeListing>(`/listings/${id}`));
}
