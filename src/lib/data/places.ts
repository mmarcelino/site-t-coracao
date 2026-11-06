import { buildings } from "@/content/buildings";
import { neighbourhoods } from "@/content/neighbourhoods";
import { getListingBuildings } from "./listings";
import type { Building, Locale, Neighbourhood } from "./types";

/**
 * Buildings and neighbourhoods are our own content (not Guesty), resolved per locale. A building's
 * homes come from the listings (Guesty tags), so new flats appear without editing content.
 */

export async function getBuildings(): Promise<Building[]> {
  const homes = await getListingBuildings();
  return buildings.map((b) => {
    const own = homes.filter((h) => h.buildingId === b.id);
    return {
      id: b.id,
      slug: b.slug,
      name: b.name,
      street: b.street,
      neighbourhoodSlug: b.neighbourhoodSlug,
      heroImage: { src: own[0]?.raw.pictures[0]?.original ?? "", alt: b.name },
      listingIds: own.map((h) => h.listingId),
      hasLift: b.hasLift,
    };
  });
}

export async function getBuilding(idOrSlug: string): Promise<Building | null> {
  return (await getBuildings()).find((b) => b.id === idOrSlug || b.slug === idOrSlug) ?? null;
}

export async function getNeighbourhoods(locale: Locale): Promise<Neighbourhood[]> {
  return neighbourhoods.map((n) => ({ slug: n.slug, name: n.name[locale], intro: n.intro[locale] }));
}

export async function getNeighbourhood(locale: Locale, slug: string): Promise<Neighbourhood | null> {
  return (await getNeighbourhoods(locale)).find((n) => n.slug === slug) ?? null;
}
