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
