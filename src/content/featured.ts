import type { Localized } from "@/lib/data/types";

/**
 * Hero slideshow: interiors chosen for looks alone (magazine-worthy, calm in the lower left where
 * the copy sits). Not linked to listings or collections. Full-bleed, so 2400px sources only.
 * The mouzinho-1e home isn't in the mock set yet (it arrives with Guesty).
 */
export const heroSlides: Array<{ key: string; image: string; alt: Localized }> = [
  {
    key: "casa-do-farol",
    image: "/images/placeholder/casa-do-farol-05.jpg",
    alt: { pt: "Suite no sótão com vigas brancas e três portas abertas para o mar, na Casa do Farol", en: "Attic suite with white beams and three French windows onto the sea, at Casa do Farol" },
  },
  {
    key: "mouzinho-32",
    // Mirrored so the fireplace sits on the right, clear of the copy (flip the final original too).
    image: "/images/placeholder/mouzinho-1e-02-flipped.jpg",
    alt: { pt: "Sala com lareira de ferro fundido, sofá de veludo verde-oliva e duas janelas altas sobre a rua, no Mouzinho 32", en: "Living room with a cast-iron fireplace, an olive velvet sofa and two tall windows onto the street, at Mouzinho 32" },
  },
  {
    key: "casa-do-farol-living",
    image: "/images/placeholder/casa-do-farol-03.jpg",
    alt: { pt: "Sala com sofá cinzento e três janelas altas abertas para o mar, na Casa do Farol", en: "Living room with a grey sofa and three tall windows onto the sea, at Casa do Farol" },
  },
];
