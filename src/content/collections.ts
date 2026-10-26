import type { ListingTag, Localized } from "@/lib/data/types";

/**
 * Collections = curated views over listing tags. The first four are featured on the home page;
 * all of them are filters on the apartments page.
 */
export interface Collection {
  tag: ListingTag;
  featured: boolean;
  title: Localized;
  blurb: Localized;
  image: { src: string; alt: Localized };
}

export const collections: Collection[] = [
  {
    tag: "couples",
    featured: true,
    title: { pt: "Para dois", en: "For two" },
    blurb: { pt: "Estúdios e T1 para viajar a sós ou a dois.", en: "Studios and one-bedrooms for one or two." },
    image: {
      src: "/images/placeholder/sao-bento-ii-01.jpg",
      alt: { pt: "Estúdio com janelas de sacada viradas para a estação de São Bento", en: "Studio with French windows facing São Bento station" },
    },
  },
  {
    tag: "families",
    featured: true,
    title: { pt: "Para famílias", en: "For families" },
    blurb: { pt: "Dois quartos ou mais, com berço e cadeira de bebé a pedido.", en: "Two bedrooms or more, with a cot and high chair on request." },
    image: {
      src: "/images/placeholder/breiner-skylight-01.jpg",
      alt: { pt: "Sala ampla com sofá e mesa de jantar no Breiner 210", en: "Spacious living room with sofa and dining table at Breiner 210" },
    },
  },
  {
    tag: "sea",
    featured: true,
    title: { pt: "Junto ao mar", en: "By the sea" },
    blurb: { pt: "A Foz, onde o Douro encontra o Atlântico.", en: "Foz, where the Douro meets the Atlantic." },
    image: {
      src: "/images/placeholder/casa-do-farol-02.jpg",
      alt: { pt: "Terraço com vista para o mar e o rio na Casa do Farol", en: "Terrace with sea and river views at Casa do Farol" },
    },
  },
  {
    tag: "outdoor",
    featured: true,
    title: { pt: "Com espaço exterior", en: "With outdoor space" },
    blurb: { pt: "Varandas, um pátio de azulejo e um terraço sobre o mar.", en: "Balconies, a tiled patio and a terrace over the sea." },
    image: {
      src: "/images/placeholder/cordoaria-river-balcony-03.jpg",
      alt: { pt: "Varanda com espreguiçadeira e vista para o Douro", en: "Balcony with a deckchair and a view of the Douro" },
    },
  },
  {
    tag: "views",
    featured: false,
    title: { pt: "Com vista", en: "With a view" },
    blurb: { pt: "Rio, mar, jardins ou a estação de São Bento.", en: "River, sea, gardens or São Bento station." },
    image: {
      src: "/images/placeholder/casa-do-farol-06.jpg",
      alt: { pt: "Vista da janela sobre a marginal da Foz", en: "View from the window over the Foz seafront" },
    },
  },
  {
    tag: "remote-work",
    featured: false,
    title: { pt: "Para trabalhar", en: "For remote work" },
    blurb: { pt: "Wi-Fi rápido e uma secretária com luz natural.", en: "Fast Wi-Fi and a desk in natural light." },
    image: {
      src: "/images/placeholder/breiner-heritage-08.jpg",
      alt: { pt: "Mesa junto à janela de sacada no Breiner 210", en: "Table by the French windows at Breiner 210" },
    },
  },
];
