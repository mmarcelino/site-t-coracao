import { listingContent, listingFeatures, type ListingContent, type RoomKey } from "@/content/listings";
import { buildings } from "@/content/buildings";
import translations from "@/content/listing-translations.json";
import snapshot from "./mock/guesty-listings.snapshot.json";
import { isGuestyConfigured } from "./guesty/client";
import { fetchGuestyFromRates } from "./guesty/availability";
import { fetchGuestyListing, fetchGuestyListings } from "./guesty/listings";
import type { AmenityKey, GuestyListing, Listing, ListingCategory, ListingTag, Locale, Localized } from "./types";

const snapshotListings = snapshot as GuestyListing[];

/**
 * Listing source: the Guesty Booking Engine API when credentials are set (`.env.local`), else the
 * mock snapshot of the public booking site (2026-10-26, photos re-hosted locally). If Guesty fails,
 * pages fall back to the snapshot rather than break.
 */
async function loadGuestyListings(): Promise<GuestyListing[]> {
  if (!isGuestyConfigured()) return snapshotListings;
  try {
    return (await fetchGuestyListings()).map(withSnapshotFloor);
  } catch (error) {
    console.error(`[guesty] ${errorMessage(error)}; showing mock listings`);
    return snapshotListings;
  }
}

/** One listing with the detail-only fields (terms, licence, check-in/out). */
async function loadGuestyListing(id: string): Promise<GuestyListing | null> {
  if (!isGuestyConfigured()) return snapshotListings.find((l) => l._id === id) ?? null;
  try {
    const listing = await fetchGuestyListing(id);
    return listing ? withSnapshotFloor(listing) : null;
  } catch (error) {
    console.error(`[guesty] ${errorMessage(error)}; using list data for ${id}`);
    return (await loadGuestyListings()).find((l) => l._id === id) ?? null;
  }
}

/** Lowest bookable nightly rate per listing (live only; mock data uses the base price). */
async function loadFromRates(): Promise<Record<string, number>> {
  if (!isGuestyConfigured()) return {};
  try {
    return await fetchGuestyFromRates();
  } catch (error) {
    console.error(`[guesty] ${errorMessage(error)}; "from" prices fall back to base prices`);
    return {};
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "unknown error";
}

/** The API has no floor; the snapshot (from the public booking pages) has it for the curated homes. */
function withSnapshotFloor(listing: GuestyListing): GuestyListing {
  if (listing.address.floor) return listing;
  const floor = snapshotListings.find((l) => l._id === listing._id)?.address.floor;
  return floor ? { ...listing, address: { ...listing.address, floor } } : listing;
}

const roomLabels: Record<RoomKey, Localized> = {
  exterior: { pt: "Exterior do edifício", en: "Outside the building" },
  terrace: { pt: "Terraço com vista", en: "Terrace with a view" },
  living: { pt: "Sala de estar", en: "Living room" },
  dining: { pt: "Zona de refeições", en: "Dining area" },
  kitchen: { pt: "Cozinha", en: "Kitchen" },
  bedroom: { pt: "Quarto", en: "Bedroom" },
  bathroom: { pt: "Casa de banho", en: "Bathroom" },
  entrance: { pt: "Entrada", en: "Entrance" },
  stairs: { pt: "Escada interior", en: "Staircase" },
  view: { pt: "Vista da janela", en: "View from the window" },
  balcony: { pt: "Varanda com vista para o rio", en: "Balcony with river view" },
  patio: { pt: "Pátio com azulejo", en: "Tiled patio" },
  detail: { pt: "Pormenor do interior", en: "Interior detail" },
};

/** Guesty amenity strings → our curated keys (unknown strings are dropped). */
const amenityMap: Record<string, AmenityKey> = {
  "Wireless Internet": "wifi",
  Internet: "wifi",
  "Laptop friendly workspace": "workspace",
  "Air conditioning": "air-conditioning",
  Heating: "heating",
  Kitchen: "kitchen",
  Dishwasher: "dishwasher",
  Washer: "washer",
  Dryer: "dryer",
  "Coffee maker": "coffee",
  Oven: "oven",
  TV: "tv",
  "Cable TV": "tv",
  "Bed linens": "linens",
  "Towels provided": "towels",
  "Hair dryer": "hair-dryer",
  Iron: "iron",
  Crib: "crib",
  "Pack ’n Play/travel crib": "crib",
  "High chair": "high-chair",
  "Patio or balcony": "balcony",
  "Outdoor seating (furniture)": "balcony",
  Desk: "workspace",
  "Sea view": "view",
  "Water View": "view",
  "Long term stays allowed": "long-stays",
  "Smoke detector": "smoke-detector",
  "First aid kit": "first-aid",
  "Paid parking off premises": "paid-parking-nearby",
};

function mapAmenities(raw: string[]): AmenityKey[] {
  const keys = raw.map((a) => amenityMap[a]).filter((k): k is AmenityKey => Boolean(k));
  return [...new Set(keys)];
}

function floorLabel(raw: string | null | undefined, locale: Locale): string {
  if (!raw) return "";
  if (/mezzanine/i.test(raw)) return locale === "pt" ? "Mezanino" : "Mezzanine";
  const n = Number(raw.match(/\d+/)?.[0]);
  if (!n) return raw;
  if (locale === "pt") return `${n}.º andar`;
  const suffix = n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
  return `${n}${suffix} floor`;
}

/** Editorial features from the content overlay + tags derived from Guesty data. */
function deriveTags(raw: GuestyListing, features: ListingTag[], amenities: AmenityKey[]): ListingTag[] {
  const tags = new Set<ListingTag>(features);
  if (raw.accommodates <= 2) tags.add("couples");
  if (raw.bedrooms >= 2 || raw.accommodates >= 4) tags.add("families");
  if (amenities.includes("workspace")) tags.add("remote-work");
  return [...tags];
}

function deriveCategory(raw: GuestyListing): ListingCategory {
  if (/villa|house/i.test(raw.propertyType)) return "house";
  if (raw.bedrooms === 0) return "studio";
  if (raw.bedrooms === 1) return "one-bed";
  return raw.bedrooms === 2 ? "two-bed" : "three-bed";
}

/** Guesty's area, unless it's missing or implausible (some listings say 40 sq ft). */
function areaSqm(raw: GuestyListing): number | null {
  if (!raw.areaSquareFeet) return null;
  const sqm = Math.round(raw.areaSquareFeet * 0.092903);
  return sqm >= 15 ? sqm : null;
}

/** Guest-facing title: Guesty's, minus the "Tripas-Coração:" prefix (the brand is in the header). */
function guestyDisplayTitle(raw: GuestyListing): string {
  return raw.title.replace(/^Tripas-Coração:\s*/i, "").trim();
}

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Our building for a listing: the editorial one, else the client's Guesty building tag. */
export function buildingIdFor(raw: GuestyListing, content: ListingContent | null = null): string {
  if (content) return content.buildingId;
  const tags = (raw.tags ?? []).map((t) => t.normalize("NFC"));
  const known = buildings.find((b) => tags.includes(b.guestyTag.normalize("NFC")));
  // A tag we have no building for yet (a new building in Guesty): log it so it gets an entry.
  if (!known) console.warn(`[guesty] no building for listing ${raw._id} (tags: ${tags.join(", ") || "none"})`);
  return known?.id ?? slugify(tags[0] ?? raw.address.street);
}

/** Homes without editorial copy show this many Guesty photos, in Guesty's order. */
const AUTO_PICTURES = 12;

/** Image hosts allowed in next.config.ts (`images.remotePatterns`); local paths are always fine. */
const imageHosts = /^(\/|https:\/\/assets\.guesty\.com\/image\/upload\/|https:\/\/guesty-listing-images\.s3\.amazonaws\.com\/production\/)/;

/** Photos on a host next/image doesn't allow would crash the page: skip them, loudly. */
function servablePictures(raw: GuestyListing): GuestyListing["pictures"] {
  return raw.pictures.map((p) => {
    if (imageHosts.test(p.original)) return p;
    console.warn(`[guesty] photo on an unknown host skipped (listing ${raw._id}): ${new URL(p.original).hostname}`);
    return null;
  }).filter((p): p is GuestyListing["pictures"][number] => p !== null);
}

function toListing(
  raw: GuestyListing,
  content: ListingContent | null,
  slug: string,
  locale: Locale,
  fromRate: number | undefined,
): Listing {
  const buildingId = buildingIdFor(raw, content);
  const building = buildings.find((b) => b.id === buildingId);
  const title = guestyDisplayTitle(raw);
  const placeName = building ? `${title}, ${building.name}` : title;
  const photos = servablePictures(raw);
  const pictures = content
    ? content.pictures
        .map(({ n, room }) => {
          const pic = photos.find((p) => p === raw.pictures[n - 1]);
          return pic ? { src: pic.original, alt: `${roomLabels[room][locale]} · ${placeName}` } : null;
        })
        .filter((p): p is Listing["pictures"][number] => p !== null)
    : // Guesty captions are English only.
      photos.slice(0, AUTO_PICTURES).map((p) => ({ src: p.original, alt: p.caption ? `${p.caption} · ${placeName}` : placeName }));
  const currency = raw.prices.currency;
  const amenities = mapAmenities(raw.amenities);

  return {
    id: raw._id,
    slug,
    title,
    guestyTitle: raw.title,
    nickname: raw.nickname,
    category: content?.category ?? deriveCategory(raw),
    tags: deriveTags(raw, content?.features ?? listingFeatures[raw._id] ?? [], amenities),
    propertyType: raw.propertyType,
    accommodates: raw.accommodates,
    bedrooms: raw.bedrooms,
    bathrooms: raw.bathrooms,
    beds: raw.beds,
    areaSqm: areaSqm(raw),
    floor: content?.floor?.[locale] ?? floorLabel(raw.address.floor, locale),
    hasLift: building?.hasLift ?? null,
    address: {
      street: raw.address.street,
      zipcode: raw.address.zipcode,
      city: raw.address.city,
      lat: raw.address.lat,
      lng: raw.address.lng,
    },
    buildingId,
    neighbourhoodSlug: building?.neighbourhoodSlug ?? "",
    pictures,
    // Listing text is Guesty's own (English); Portuguese pages use our PT-PT translation while it
    // still matches Guesty's text. Neighbourhood copy comes from our neighbourhood pages instead.
    tagline: "",
    description: { ...describe(raw, locale), neighbourhood: "", notes: "" },
    highlights: [],
    amenities,
    price: {
      from: { amount: fromRate ?? raw.prices.basePrice, currency },
      base: { amount: raw.prices.basePrice, currency },
      cleaningFee: { amount: raw.prices.cleaningFee ?? 0, currency },
      extraPersonFee: { amount: raw.prices.extraPersonFee ?? 0, currency },
      guestsIncluded: raw.prices.guestsIncludedInRegularFee ?? raw.accommodates,
      weeklyFactor: raw.prices.weeklyPriceFactor ?? 1,
      monthlyFactor: raw.prices.monthlyPriceFactor ?? 1,
    },
    minNights: raw.terms.minNights,
    checkInTime: raw.defaultCheckInTime,
    checkOutTime: raw.defaultCheckOutTime,
    licence: raw.license,
    reviews:
      raw.reviews.avg !== null
        ? { source: "guesty", outOf: 10, score: raw.reviews.avg, count: raw.reviews.total, mock: false }
        : null,
  };
}

type ListingText = { summary: string; space: string };
const listingTranslations = translations as Record<string, { en: ListingText; pt: ListingText }>;

/**
 * Guesty's summary and "space" text, in Portuguese on PT pages when our translation
 * (`src/content/listing-translations.json`) was made from the text Guesty has now. If the client
 * edits a description in Guesty, that home shows Guesty's new English until it's translated again,
 * so a translation never contradicts the listing.
 */
function describe(raw: GuestyListing, locale: Locale): ListingText {
  const en = { summary: (raw.publicDescription.summary ?? "").trim(), space: (raw.publicDescription.space ?? "").trim() };
  if (locale === "en") return en;
  const t = listingTranslations[raw._id];
  return t && t.en.summary === en.summary && t.en.space === en.space ? t.pt : en;
}

interface Entry {
  raw: GuestyListing;
  content: ListingContent | null;
  slug: string;
}

/**
 * Curated homes first (in content order), then the rest in Guesty's order. Every slug follows the
 * Guesty title, so renaming a listing in Guesty changes its URL; earlier URLs listed as
 * `formerSlugs` in src/content/listings.ts redirect to the new one.
 */
async function entries(): Promise<Entry[]> {
  const raws = await loadGuestyListings();
  const ordered = [
    ...listingContent.flatMap((content) => {
      const raw = raws.find((l) => l._id === content.id);
      return raw ? [{ raw, content }] : [];
    }),
    ...raws.filter((raw) => !listingContent.some((c) => c.id === raw._id)).map((raw) => ({ raw, content: null })),
  ];
  const used = new Set<string>();
  return ordered.map(({ raw, content }) => {
    let slug = slugify(guestyDisplayTitle(raw));
    if (used.has(slug)) slug = `${slug}-${raw._id.slice(-4)}`;
    used.add(slug);
    return { raw, content, slug };
  });
}

/** One home with Guesty's detail-only fields merged in. */
async function resolveOne(entry: Entry | undefined, locale: Locale): Promise<Listing | null> {
  if (!entry) return null;
  const [raw, fromRates] = await Promise.all([loadGuestyListing(entry.raw._id), loadFromRates()]);
  return toListing(raw ?? entry.raw, entry.content, entry.slug, locale, fromRates[entry.raw._id]);
}

async function resolveAll(locale: Locale): Promise<Listing[]> {
  const [all, fromRates] = await Promise.all([entries(), loadFromRates()]);
  return all.map((e) => toListing(e.raw, e.content, e.slug, locale, fromRates[e.raw._id]));
}

export async function getListings(
  locale: Locale,
  filter: { buildingId?: string; neighbourhoodSlug?: string; tag?: ListingTag; guests?: number } = {},
): Promise<Listing[]> {
  const all = await resolveAll(locale);
  return all.filter(
    (l) =>
      (!filter.buildingId || l.buildingId === filter.buildingId) &&
      (!filter.neighbourhoodSlug || l.neighbourhoodSlug === filter.neighbourhoodSlug) &&
      (!filter.tag || l.tags.includes(filter.tag)) &&
      (!filter.guests || l.accommodates >= filter.guests),
  );
}

export async function getListing(locale: Locale, id: string): Promise<Listing | null> {
  return resolveOne((await entries()).find((e) => e.raw._id === id), locale);
}

export async function getListingBySlug(locale: Locale, slug: string): Promise<Listing | null> {
  return resolveOne((await entries()).find((e) => e.slug === slug), locale);
}

/** The current slug of a home that used to live at `slug` (a renamed listing), or null. */
export async function findMovedListing(slug: string): Promise<string | null> {
  const all = await entries();
  if (all.some((e) => e.slug === slug)) return null;
  return all.find((e) => e.content?.formerSlugs?.includes(slug))?.slug ?? null;
}

export async function getListingSlugs(): Promise<string[]> {
  return (await entries()).map((e) => e.slug);
}

/** Internal: pricing inputs for the quote engine. */
export async function getRawListing(id: string): Promise<GuestyListing | null> {
  return loadGuestyListing(id);
}

/** Internal: every listing's building, for building pages and filters (see places.ts). */
export async function getListingBuildings(): Promise<Array<{ listingId: string; buildingId: string; raw: GuestyListing }>> {
  return (await entries()).map((e) => ({ listingId: e.raw._id, buildingId: buildingIdFor(e.raw, e.content), raw: e.raw }));
}
