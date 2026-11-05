import { buildings } from "@/content/buildings";
import { neighbourhoods } from "@/content/neighbourhoods";
import { getListingBuildings } from "./listings";
import type { Building, Locale, Neighbourhood } from "./types";

/**
 * Buildings and neighbourhoods are our own content (not Guesty), resolved per locale. A building's
 * homes come from the listings (Guesty tags), so new flats appear without editing content.
 */

export async function getBuildings(locale: Locale): Promise<Building[]> {
  const homes = await getListingBuildings();
  return buildings.map((b) => {
    const own = homes.filter((h) => h.buildingId === b.id);
    const cover = own[0]?.raw.pictures[0];
    return {
      id: b.id,
      slug: b.slug,
      name: b.name,
      street: b.street,
      neighbourhoodSlug: b.neighbourhoodSlug,
      era: b.era?.[locale] ?? "",
      historyLine: b.historyLine?.[locale] ?? "",
      story: b.story?.[locale] ?? "",
      heroImage: b.heroImage
        ? { src: b.heroImage.src, alt: b.heroImage.alt[locale] }
        : { src: cover?.original ?? "", alt: b.name },
      storyImage: b.storyImage
        ? { src: b.storyImage.src, alt: b.storyImage.alt[locale] }
        : { src: cover?.original ?? "", alt: b.name },
      listingIds: own.map((h) => h.listingId),
      hasLift: b.hasLift,
    };
  });
}

export async function getBuilding(locale: Locale, idOrSlug: string): Promise<Building | null> {
  return (await getBuildings(locale)).find((b) => b.id === idOrSlug || b.slug === idOrSlug) ?? null;
}

export async function getNeighbourhoods(locale: Locale): Promise<Neighbourhood[]> {
  return neighbourhoods.map((n) => ({
    slug: n.slug,
    name: n.name[locale],
    tagline: n.tagline[locale],
    intro: n.intro[locale],
    guide: n.guide.map((g) => ({ category: g.category, name: g.name, note: g.note[locale] })),
    coordinates: n.coordinates,
    image: { src: n.image.src, alt: n.image.alt[locale] },
  }));
}

export async function getNeighbourhood(locale: Locale, slug: string): Promise<Neighbourhood | null> {
  return (await getNeighbourhoods(locale)).find((n) => n.slug === slug) ?? null;
}
