import { listingContent, type ListingContent, type RoomKey } from "@/content/listings";
import { buildings } from "@/content/buildings";
import snapshot from "./mock/guesty-listings.snapshot.json";
import type { AmenityKey, GuestyListing, Listing, ListingTag, Locale, Localized } from "./types";

/**
 * MOCK SOURCE: a trimmed snapshot of the client's public Guesty listings (2026-10-26),
 * with photos re-hosted locally. Swap `loadGuestyListings()` for the Guesty Open API later;
 * everything below it stays.
 */
async function loadGuestyListings(): Promise<GuestyListing[]> {
  return snapshot as GuestyListing[];
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
function deriveTags(raw: GuestyListing, content: ListingContent, amenities: AmenityKey[]): ListingTag[] {
  const tags = new Set<ListingTag>(content.features);
  if (raw.accommodates <= 2) tags.add("couples");
  if (raw.bedrooms >= 2 || raw.accommodates >= 4) tags.add("families");
  if (amenities.includes("workspace")) tags.add("remote-work");
  return [...tags];
}

function toListing(raw: GuestyListing, content: ListingContent, locale: Locale): Listing {
  const building = buildings.find((b) => b.id === content.buildingId);
  const title = content.title[locale];
  const placeName = building ? `${title}, ${building.name}` : title;
  const pictures = content.pictures
    .map(({ n, room }) => {
      const pic = raw.pictures[n - 1];
      return pic ? { src: pic.original, alt: `${roomLabels[room][locale]} · ${placeName}` } : null;
    })
    .filter((p): p is Listing["pictures"][number] => p !== null);
  const currency = raw.prices.currency;
  const amenities = mapAmenities(raw.amenities);

  return {
    id: raw._id,
    slug: content.slug,
    title,
    guestyTitle: raw.title,
    nickname: raw.nickname,
    category: content.category,
    tags: deriveTags(raw, content, amenities),
    propertyType: raw.propertyType,
    accommodates: raw.accommodates,
    bedrooms: raw.bedrooms,
    bathrooms: raw.bathrooms,
    beds: raw.beds,
    areaSqm: content.areaSqm,
    floor: content.floor?.[locale] ?? floorLabel(raw.address.floor, locale),
    hasLift: building?.hasLift ?? false,
    address: {
      street: raw.address.street,
      zipcode: raw.address.zipcode,
      city: raw.address.city,
      lat: raw.address.lat,
      lng: raw.address.lng,
    },
    buildingId: content.buildingId,
    neighbourhoodSlug: building?.neighbourhoodSlug ?? "",
    pictures,
    tagline: content.tagline[locale],
    description: {
      summary: content.summary[locale],
      space: content.space[locale],
      // Guesty only holds English neighbourhood copy; the neighbourhood page content is used instead.
      neighbourhood: "",
      notes: "",
    },
    highlights: content.highlights[locale],
    amenities,
    price: {
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
        ? { source: "guesty", score: raw.reviews.avg, count: raw.reviews.total, mock: false }
        : null,
  };
}

async function resolveAll(locale: Locale): Promise<Listing[]> {
  const raw = await loadGuestyListings();
  return listingContent
    .map((content) => {
      const r = raw.find((l) => l._id === content.id);
      return r ? toListing(r, content, locale) : null;
    })
    .filter((l): l is Listing => l !== null);
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
  return (await resolveAll(locale)).find((l) => l.id === id) ?? null;
}

export async function getListingBySlug(locale: Locale, slug: string): Promise<Listing | null> {
  return (await resolveAll(locale)).find((l) => l.slug === slug) ?? null;
}

export async function getListingSlugs(): Promise<string[]> {
  return listingContent.map((c) => c.slug);
}

/** Internal: pricing inputs for the quote engine. */
export async function getRawListing(id: string): Promise<GuestyListing | null> {
  return (await loadGuestyListings()).find((l) => l._id === id) ?? null;
}
