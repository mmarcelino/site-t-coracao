import type { ListingCategory, Localized } from "@/lib/data/types";

/**
 * Editorial overlay for Guesty listings: things Guesty doesn't hold (slug, building, collection
 * features, photo order). Merged with Guesty data in `src/lib/data/listings.ts`, keyed by Guesty
 * listing ID. All listing text (title, summary, space) is Guesty's own, as-is (client decision
 * 2026-11-04); our earlier PT/EN rewrites are in git history (before that date).
 */
export type RoomKey =
  | "exterior"
  | "terrace"
  | "living"
  | "dining"
  | "kitchen"
  | "bedroom"
  | "bathroom"
  | "entrance"
  | "stairs"
  | "view"
  | "balcony"
  | "patio"
  | "detail";

/**
 * Editorial features behind the collections/filters. Other tags are derived from Guesty data
 * (see `deriveTags` in src/lib/data/listings.ts).
 */
export type ListingFeature = "sea" | "outdoor" | "views";

export interface ListingContent {
  id: string;
  slug: string;
  buildingId: string;
  category: ListingCategory;
  features: ListingFeature[];
  /** Overrides the floor label from Guesty (e.g. a whole house). */
  floor?: Localized;
  /** Photo order: `n` is the index in the Guesty pictures array (1-based). */
  pictures: Array<{ n: number; room: RoomKey }>;
}





export const listingContent: ListingContent[] = [
  {
    id: "64de2984ec3b510037fc32b6",
    slug: "mouzinho-32-rooftop-e",
    buildingId: "mouzinho-32",
    category: "two-bed",
    features: ["views"],
    pictures: [
      { n: 1, room: "living" }, { n: 2, room: "dining" }, { n: 6, room: "bedroom" }, { n: 7, room: "bedroom" },
      { n: 8, room: "bedroom" }, { n: 4, room: "stairs" }, { n: 3, room: "entrance" }, { n: 5, room: "stairs" },
    ],
  },
  {
    id: "64de2984ec3b510037fc32c1",
    slug: "mouzinho-32-apartment-3d",
    buildingId: "mouzinho-32",
    category: "two-bed",
    features: ["views"],
    pictures: [
      { n: 1, room: "living" }, { n: 6, room: "bedroom" }, { n: 4, room: "bathroom" }, { n: 7, room: "bathroom" },
      { n: 3, room: "stairs" }, { n: 5, room: "entrance" }, { n: 8, room: "bathroom" }, { n: 2, room: "entrance" },
    ],
  },
  {
    id: "64de2984ec3b510037fc32a0",
    slug: "mouzinho-32-apartment-2e",
    buildingId: "mouzinho-32",
    category: "one-bed",
    features: ["views"],
    pictures: [
      { n: 1, room: "living" }, { n: 2, room: "living" }, { n: 6, room: "living" }, { n: 4, room: "living" },
      { n: 5, room: "living" }, { n: 7, room: "living" }, { n: 8, room: "living" }, { n: 3, room: "stairs" },
    ],
  },
  {
    id: "60f82c3d7aba91002d2ccd0f",
    slug: "cordoaria-river-view-studio",
    buildingId: "cordoaria",
    category: "studio",
    features: ["outdoor", "views"],
    pictures: [
      { n: 3, room: "balcony" }, { n: 1, room: "living" }, { n: 2, room: "living" }, { n: 4, room: "bedroom" },
      { n: 6, room: "living" }, { n: 5, room: "kitchen" }, { n: 7, room: "living" }, { n: 8, room: "detail" },
    ],
  },
  {
    id: "60f82c3cb82a7e002f865672",
    slug: "cordoaria-garden-view-studio",
    buildingId: "cordoaria",
    category: "studio",
    features: ["views"],
    pictures: [
      { n: 1, room: "living" }, { n: 6, room: "view" }, { n: 2, room: "living" }, { n: 3, room: "living" },
      { n: 5, room: "bedroom" }, { n: 7, room: "kitchen" }, { n: 4, room: "living" }, { n: 8, room: "detail" },
    ],
  },
  {
    id: "60f82cd97aba91002d2cfe72",
    slug: "cordoaria-mezzanine-studio",
    buildingId: "cordoaria",
    category: "studio",
    features: ["outdoor"],
    pictures: [
      { n: 1, room: "living" }, { n: 5, room: "bathroom" }, { n: 3, room: "living" }, { n: 2, room: "living" },
      { n: 8, room: "kitchen" }, { n: 7, room: "living" }, { n: 6, room: "bathroom" }, { n: 4, room: "detail" },
    ],
  },
  {
    id: "60f827e3b82a7e002f852152",
    slug: "breiner-heritage-apartment",
    buildingId: "breiner-210",
    category: "two-bed",
    features: [],
    pictures: [
      { n: 3, room: "living" }, { n: 7, room: "dining" }, { n: 2, room: "living" }, { n: 4, room: "living" },
      { n: 8, room: "dining" }, { n: 5, room: "living" }, { n: 6, room: "detail" }, { n: 1, room: "living" },
    ],
  },
  {
    id: "60f827e57aba91002d2bdc3c",
    slug: "breiner-skylight-apartment",
    buildingId: "breiner-210",
    category: "two-bed",
    features: [],
    pictures: [
      { n: 1, room: "living" }, { n: 6, room: "dining" }, { n: 2, room: "living" }, { n: 7, room: "dining" },
      { n: 3, room: "living" }, { n: 4, room: "living" }, { n: 8, room: "dining" }, { n: 5, room: "living" },
    ],
  },
  {
    id: "60f82c06c8730e002dc84744",
    slug: "sao-bento-station-view-studio",
    buildingId: "sao-bento",
    category: "one-bed",
    features: ["views"],
    pictures: [
      { n: 1, room: "bedroom" }, { n: 6, room: "dining" }, { n: 4, room: "bedroom" }, { n: 2, room: "bedroom" },
      { n: 3, room: "bedroom" }, { n: 5, room: "bedroom" }, { n: 7, room: "bedroom" }, { n: 8, room: "detail" },
    ],
  },
  {
    id: "60f828533b29f7002f8ee8dc",
    slug: "sao-bento-duplex",
    buildingId: "sao-bento",
    category: "one-bed",
    features: ["outdoor"],
    pictures: [
      { n: 2, room: "living" }, { n: 6, room: "patio" }, { n: 1, room: "dining" }, { n: 3, room: "bedroom" },
      { n: 5, room: "kitchen" }, { n: 7, room: "bedroom" }, { n: 4, room: "bathroom" }, { n: 8, room: "bedroom" },
    ],
  },
  {
    id: "683036ac17f8820013f84e69",
    slug: "casa-do-farol",
    buildingId: "casa-do-farol",
    category: "house",
    features: ["sea", "outdoor", "views"],
    floor: { pt: "Moradia em 3 pisos", en: "House on 3 floors" },
    pictures: [
      { n: 68, room: "terrace" }, { n: 81, room: "exterior" }, { n: 9, room: "living" }, { n: 2, room: "dining" },
      { n: 56, room: "bedroom" }, { n: 70, room: "terrace" }, { n: 46, room: "view" }, { n: 49, room: "detail" },
      { n: 85, room: "exterior" }, { n: 88, room: "view" },
    ],
  },
];

/**
 * Collection features for homes without an entry above, read from their Guesty titles, descriptions
 * and amenities (2026-11-04). TO CONFIRM with the client. "outdoor" only where the text promises a
 * balcony, terrace, patio or rooftop you can sit out on: Guesty's "Patio or balcony" amenity also
 * covers Juliet balconies (Almada II, Taipas 1º/3º, São Bento III/IV), which don't count. The
 * Santa Catarina flats have that amenity but no text: left out until confirmed.
 */
export const listingFeatures: Record<string, ListingFeature[]> = {
  "64de2984ec3b510037fc32ab": ["views"], // Mouzinho32 2D: views over Praça do Infante
  "64de2984ec3b510037fc3295": ["views"], // Mouzinho32 1D
  "64de2984ec3b510037fc328a": ["views"], // Mouzinho32 1E
  "60f82c3fc8730e002dc86013": ["views"], // Clérigos: Clérigos Tower and Jardim das Oliveiras
  "60f82c3bb82a7e002f865336": ["views", "outdoor"], // Cord Ground River: balcony over the Douro
  "60f82c35c8730e002dc85624": ["views", "outdoor"], // Cord 3rd Back River
  "60f82c307aba91002d2cc7cb": ["views", "outdoor"], // Cord 1st Back River
  "60f82c3ac8730e002dc85a14": ["views"], // Cord 2nd F Garden: garden view
  "60f82c3ac8730e002dc859cd": ["views"], // Cord 3rd F Garden
  "60f82c0bb82a7e002f863ef6": ["views"], // São Bento I: station view
  "60f82bffb82a7e002f8639e6": ["views"], // São Bento III
  "60f828697aba91002d2bfc2f": ["views"], // São Bento IV
  "61003aa1f6277f002d1e4070": ["views", "outdoor"], // Sta Catarina T2 - 3º: rooftop with city views
  "60f82c0b7aba91002d2cbc62": ["views"], // Sá da Bandeira II: city view
  "60f82c0ac8730e002dc84a34": ["views"], // Sá da Bandeira I: city view
  "60f82c0c3b29f7002f900e5c": ["views", "outdoor"], // Sá da Bandeira Duplex: rooftop balcony
  "60f82c29b82a7e002f864d16": ["outdoor"], // Sá da Bandeira I balc.
  "60f82c0a3b29f7002f900ad4": ["outdoor"], // Sá da Bandeira II balc.
  "60f82c15b82a7e002f8643ca": ["outdoor"], // Sá da Bandeira 3rd floor Pateo
  "62a1cc5d812755003358f88d": ["outdoor"], // Almada I: terrace and garden
  "60f827a8b82a7e002f8515dd": ["outdoor"], // Santa Teresa: terrace
};
