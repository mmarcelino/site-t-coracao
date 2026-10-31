import type { Localized } from "@/lib/data/types";

/**
 * Home page showcase (branch showcase): a few specific homes, each with a wide shot and a detail,
 * and a strip of close-ups that show the furnishing at a glance. Placeholders from the client's
 * listings until the high-res originals and a detail shoot arrive (CLAUDE.md §15).
 */
export const featuredHomes: Array<{ slug: string; wide: string; detail: string; detailAlt: Localized }> = [
  {
    slug: "mouzinho-32-rooftop-e",
    wide: "/images/placeholder/mouzinho-rooftop-e-02.jpg",
    detail: "/images/placeholder/mouzinho-rooftop-e-06.jpg",
    detailAlt: { pt: "Quarto com almofadas vermelhas e cadeirão junto à janela, no Rooftop E", en: "A bedroom with red cushions and an armchair by the window, at Rooftop E" },
  },
  {
    slug: "breiner-heritage-apartment",
    wide: "/images/placeholder/breiner-heritage-03.jpg",
    detail: "/images/placeholder/breiner-heritage-08.jpg",
    detailAlt: { pt: "Mesa de madeira posta com copos, junto à janela, no Breiner 210", en: "A timber table laid with glasses by the window, at Breiner 210" },
  },
  {
    slug: "sao-bento-duplex",
    wide: "/images/placeholder/sao-bento-duplex-02.jpg",
    detail: "/images/placeholder/sao-bento-duplex-06.jpg",
    detailAlt: { pt: "Mesa posta diante de uma parede de azulejo azul e branco, em São Bento", en: "A laid table against a blue-and-white tiled wall, at São Bento" },
  },
  {
    slug: "cordoaria-garden-view-studio",
    wide: "/images/placeholder/cordoaria-garden-02.jpg",
    detail: "/images/placeholder/cordoaria-garden-06.jpg",
    detailAlt: { pt: "Janelas abertas sobre as árvores do Jardim da Cordoaria", en: "Windows open onto the trees of the Cordoaria gardens" },
  },
];

export const details: Array<{ src: string; alt: Localized }> = [
  { src: "/images/placeholder/breiner-heritage-06.jpg", alt: { pt: "Cadeirão em pele e mesa de apoio junto à janela", en: "A leather armchair and side table by the window" } },
  { src: "/images/placeholder/cordoaria-mezzanine-05.jpg", alt: { pt: "Parede de granito original e lavatório branco", en: "An original granite wall and a white basin" } },
  { src: "/images/placeholder/mouzinho-3d-04.jpg", alt: { pt: "Azulejo verde-garrafa na casa de banho", en: "Bottle-green tiles in the bathroom" } },
  { src: "/images/placeholder/casa-do-farol-08.jpg", alt: { pt: "Recanto de leitura com cadeirão e uma obra de arte vermelha", en: "A reading corner with an armchair and a red artwork" } },
  { src: "/images/placeholder/sao-bento-ii-08.jpg", alt: { pt: "Cabeceira azul e almofadas de linho", en: "A blue headboard and linen cushions" } },
  { src: "/images/placeholder/cordoaria-garden-07.jpg", alt: { pt: "Cozinha em madeira clara com flores na mesa", en: "A pale timber kitchen with flowers on the table" } },
];
