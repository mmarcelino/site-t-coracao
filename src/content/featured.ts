import type { ListingTag, Localized } from "@/lib/data/types";

/**
 * Hero slideshow: one slide per collection. The photo must show the collection's word at a
 * glance. The page checks the home really carries the tag.
 * cordoaria-river-balcony-03 is only 1024px wide (soft full-bleed): replace when hi-res arrive.
 */
export const heroSlides: Array<{ tag: ListingTag; slug: string; image: string; alt: Localized}> = [
  {
    tag: "families",
    slug: "breiner-skylight-apartment",
    image: "/images/placeholder/breiner-skylight-02.jpg",
    alt: { pt: "Sofá fundo com almofadas verdes, tapete verde e luz quente no Breiner 210", en: "Deep sofa with green cushions, a green rug and warm light at Breiner 210" },
  },
  {
    tag: "couples",
    slug: "sao-bento-station-view-studio",
    image: "/images/placeholder/sao-bento-ii-01.jpg",
    alt: { pt: "Cama de casal virada para três janelas de sacada, em São Bento", en: "Double bed facing three French windows, at São Bento" },
  },
  {
    tag: "sea",
    slug: "casa-do-farol",
    image: "/images/placeholder/casa-do-farol-02.jpg",
    alt: { pt: "Terraço com vista para o mar e a foz do Douro, na Casa do Farol", en: "Terrace overlooking the sea and the mouth of the Douro, at Casa do Farol" },
  },
  {
    tag: "outdoor",
    slug: "cordoaria-river-view-studio",
    image: "/images/placeholder/cordoaria-river-balcony-03.jpg",
    alt: { pt: "Varanda com espreguiçadeira e vista para o rio, na Cordoaria", en: "Balcony with a deckchair and a river view, at Cordoaria" },
  },
  {
    tag: "views",
    slug: "cordoaria-garden-view-studio",
    image: "/images/placeholder/cordoaria-garden-06.jpg",
    alt: { pt: "Janelas abertas sobre as árvores do Jardim da Cordoaria", en: "Windows open onto the trees of the Cordoaria gardens" },
  },
  {
    tag: "remote-work",
    slug: "casa-do-farol",
    image: "/images/placeholder/casa-do-farol-11.jpg",
    alt: { pt: "Escritório com secretária, candeeiro e janela, na Casa do Farol", en: "Study with a desk, lamp and window, at Casa do Farol" },
  },
];
