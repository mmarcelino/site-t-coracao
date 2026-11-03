import type { Localized } from "@/lib/data/types";

/**
 * Hero slideshow: four interiors chosen for looks alone (magazine-worthy, calm in the lower left
 * where the copy sits), from four buildings in four palettes. Not linked to listings or collections.
 * mouzinho-1e and sao-bento-iii homes aren't in the mock set yet (they arrive with Guesty).
 */
export const heroSlides: Array<{ key: string; image: string; alt: Localized }> = [
  {
    key: "casa-do-farol",
    image: "/images/placeholder/casa-do-farol-05.jpg",
    alt: { pt: "Suite no sótão com vigas brancas e três portas abertas para o mar, na Casa do Farol", en: "Attic suite with white beams and three French windows onto the sea, at Casa do Farol" },
  },
  {
    key: "mouzinho-32",
    image: "/images/placeholder/mouzinho-1e-01.jpg",
    alt: { pt: "Sofá de veludo verde-oliva junto a uma lareira de ferro fundido e a uma janela alta, no Mouzinho 32", en: "Olive velvet sofa beside a cast-iron fireplace and a tall window, at Mouzinho 32" },
  },
  {
    key: "cordoaria",
    image: "/images/placeholder/cordoaria-garden-02.jpg",
    alt: { pt: "Sala em madeira quente com caixilhos originais e uma grande gravura botânica, na Cordoaria", en: "Warm timber living room with original window frames and a large botanical print, at Cordoaria" },
  },
  {
    key: "sao-bento",
    image: "/images/placeholder/sao-bento-iii-01.jpg",
    alt: { pt: "Teto em estuque e uma parede de janelas altas com sol no soalho, em São Bento", en: "Stucco ceiling and a wall of tall windows with sunlight on the floor, at São Bento" },
  },
];
