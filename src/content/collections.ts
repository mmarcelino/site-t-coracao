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
    blurb: {
      pt: "Estúdios e T1 acolhedores, perfeitos para descobrir o Porto a dois.",
      en: "Cosy studios and one-bedrooms, perfect for exploring Porto together.",
    },
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
    title: { pt: "Para famílias e amigos", en: "For families & friends" },
    blurb: {
      pt: "Casas amplas com dois ou mais quartos, ideais para grupos.",
      en: "Spacious homes with two or more bedrooms, ideal for groups.",
    },
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
    tag: "views",
    featured: true,
    title: { pt: "Com vista", en: "With a view" },
    blurb: {
      pt: "Acorde com vista para o rio, o mar, jardins ou a histórica estação de São Bento.",
      en: "Wake up to the river, sea, gardens or historic São Bento station.",
    },
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
    tag: "outdoor",
    featured: true,
    title: { pt: "Com espaço exterior", en: "With outdoor space" },
    blurb: {
      pt: "Varandas e terraços para o café de manhã e os fins de tarde longos.",
      en: "Balconies and terraces for morning coffees and long evenings.",
    },
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
    tag: "sea",
    featured: true,
    title: { pt: "Junto ao mar", en: "By the sea" },
    blurb: {
      pt: "Casas na Foz, perto do Atlântico e de um outro lado do Porto.",
      en: "Homes in Foz, close to the Atlantic and a different side of Porto.",
    },
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
    tag: "remote-work",
    featured: true,
    title: { pt: "Para trabalhar", en: "For remote work" },
    blurb: {
      pt: "Um espaço de trabalho próprio e tudo o que precisa para trabalhar com conforto.",
      en: "A dedicated workspace and everything you need to work comfortably.",
    },
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
