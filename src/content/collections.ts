import type { ListingTag, Localized } from "@/lib/data/types";

/**
 * Collections = curated views over listing tags. Featured ones appear on the home page as a pair of
 * photos (a wide room shot and a detail); all of them are filters on the apartments page.
 */
export interface Collection {
  tag: ListingTag;
  featured: boolean;
  title: Localized;
  blurb: Localized;
  image: { src: string; alt: Localized };
  /** Close-up shown beside the wide shot on the home page (placeholder until the detail shoot). */
  detail: { src: string; alt: Localized };
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
    detail: {
      src: "/images/placeholder/sao-bento-ii-08.jpg",
      alt: { pt: "Cabeceira azul e almofadas de linho, em São Bento", en: "A blue headboard and linen cushions, at São Bento" },
    },
  },
  {
    tag: "families",
    featured: true,
    title: { pt: "Para famílias", en: "For families" },
    blurb: { pt: "Dois quartos ou mais, com berço e cadeira de bebé a pedido.", en: "Two bedrooms or more, with a cot and high chair on request." },
    image: {
      src: "/images/placeholder/breiner-skylight-02.jpg",
      alt: { pt: "Sala ampla com sofá e mesa de jantar no Breiner 210", en: "Spacious living room with sofa and dining table at Breiner 210" },
    },
    detail: {
      src: "/images/placeholder/breiner-skylight-06.jpg",
      alt: { pt: "Mesa de jantar posta para a família, no Breiner 210", en: "A dining table laid for the family, at Breiner 210" },
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
    detail: {
      src: "/images/placeholder/casa-do-farol-07.jpg",
      alt: { pt: "Cadeirões no terraço sobre o mar, na Casa do Farol", en: "Armchairs on the terrace over the sea, at Casa do Farol" },
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
    detail: {
      src: "/images/placeholder/sao-bento-duplex-06.jpg",
      alt: { pt: "Mesa no pátio de azulejo, em São Bento", en: "A table on the tiled patio, at São Bento" },
    },
  },
  {
    tag: "views",
    featured: true,
    title: { pt: "Com vista", en: "With a view" },
    blurb: { pt: "Rio, mar, jardins ou a estação de São Bento.", en: "River, sea, gardens or São Bento station." },
    image: {
      src: "/images/placeholder/mouzinho-rooftop-e-01.jpg",
      alt: { pt: "Sala com janelas em arco sobre a Praça do Infante, no Mouzinho 32", en: "A living room with arched windows over Praça do Infante, at Mouzinho 32" },
    },
    detail: {
      src: "/images/placeholder/cordoaria-garden-06.jpg",
      alt: { pt: "Janelas abertas sobre as árvores do Jardim da Cordoaria", en: "Windows open onto the trees of the Cordoaria gardens" },
    },
  },
  {
    tag: "remote-work",
    featured: true,
    title: { pt: "Para trabalhar", en: "For remote work" },
    blurb: { pt: "Wi-Fi rápido e uma secretária com luz natural.", en: "Fast Wi-Fi and a desk in natural light." },
    image: {
      src: "/images/placeholder/breiner-heritage-03.jpg",
      alt: { pt: "Sala clara com sofá e mesa de trabalho, no Breiner 210", en: "A bright living room with a sofa and a work table, at Breiner 210" },
    },
    detail: {
      src: "/images/placeholder/casa-do-farol-11.jpg",
      alt: { pt: "Secretária com candeeiro junto à janela, na Casa do Farol", en: "A desk and lamp by the window, at Casa do Farol" },
    },
  },
];
