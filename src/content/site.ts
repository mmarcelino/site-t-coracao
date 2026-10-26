/**
 * Company facts. Sources: tripas-coracao.pt footer and the public Guesty booking site
 * (2026-10-26). Anything not confirmed by the client is marked TO CONFIRM.
 */
export const site = {
  name: "Tripas-Coração",
  legalName: "Tripas-Coração", // TO CONFIRM: registered company name for legal pages/JSON-LD
  foundedYear: 2015,
  phone: "+351 962 708 740",
  phoneHref: "tel:+351962708740",
  whatsappNumber: "351962708740",
  email: "ola@tripas-coracao.pt",
  address: {
    street: "Rua do Breiner 208",
    postalCode: "4050-124",
    city: "Porto",
    country: "Portugal",
    countryCode: "PT",
  },
  geo: { lat: 41.15095, lng: -8.62002 },
  social: {
    instagram: "https://www.instagram.com/tripas_coracao_porto",
    facebook: "https://www.facebook.com/tripascoracaoporto",
  },
  /** Legally required in Portugal (Decreto-Lei 156/2005). */
  complaintsBookUrl: "https://www.livroreclamacoes.pt/Inicio/",
  /**
   * AL (Alojamento Local) registration numbers. These come from Guesty for the 10 mock listings;
   * the client must supply the full list for all properties. TO CONFIRM
   */
  licencesNote: "53495/AL · 53497/AL · 79651/AL · 79658/AL · 100873/AL · 100882/AL · 100908/AL · 150447/AL · 150452/AL · 150455/AL",
  /** Team availability, from Guesty listing copy ("10am to 10pm"). */
  teamHours: "10:00–22:00",
} as const;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
