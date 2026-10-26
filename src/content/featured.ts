import type { ListingTag } from "@/lib/data/types";

/**
 * Hero slideshow: one slide per collection. Each shows a home from that collection, with the
 * photo that works best full-bleed behind white type, and that home's guest review.
 * The page checks the home really carries the tag. (Mouzinho 32 photos are only 1200px wide,
 * too soft for full-bleed: add once hi-res arrive.)
 */
export const heroSlides: Array<{ tag: ListingTag; slug: string; image: string }> = [
  { tag: "couples", slug: "cordoaria-garden-view-studio", image: "/images/placeholder/cordoaria-garden-01.jpg" },
  { tag: "families", slug: "breiner-skylight-apartment", image: "/images/placeholder/breiner-skylight-01.jpg" },
  { tag: "sea", slug: "casa-do-farol", image: "/images/placeholder/casa-do-farol-02.jpg" },
  { tag: "outdoor", slug: "sao-bento-duplex", image: "/images/placeholder/sao-bento-duplex-06.jpg" },
  { tag: "views", slug: "sao-bento-station-view-studio", image: "/images/placeholder/sao-bento-ii-01.jpg" },
  { tag: "remote-work", slug: "breiner-heritage-apartment", image: "/images/placeholder/breiner-heritage-08.jpg" },
];
