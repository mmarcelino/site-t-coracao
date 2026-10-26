import type { Localized } from "@/lib/data/types";

/**
 * Partner experiences, carried over from tripas-coracao.pt/pt/experiences-your-guest-portal
 * (CLAUDE.md §9). Prices are "from" prices as published there. Durations are not published
 * on the current site: `duration: null` until the client confirms. Images: only one placeholder
 * exists today; per-experience photography TO CONFIRM.
 */
export interface Experience {
  id: string;
  category: "porto" | "beyond";
  partner: string | null;
  priceFrom: { amount: number; per: "person" | "group" } | null;
  duration: Localized | null;
  title: Localized;
  summary: Localized;
}

export const experiences: Experience[] = [
  {
    id: "food-walk",
    category: "porto",
    partner: "Helena",
    priceFrom: { amount: 60, per: "person" },
    duration: null,
    title: { pt: "Passeio gastronómico a pé", en: "Food walking tour" },
    summary: {
      pt: "Tascas, mercados e pastelarias pelo centro, com a Helena a contar a cidade pelo que se come.",
      en: "Taverns, markets and pastry shops through the centre, with Helena telling the city through its food.",
    },
  },
  {
    id: "douro-boat",
    category: "porto",
    partner: "Capitão Paulo",
    priceFrom: { amount: 150, per: "group" },
    duration: null,
    title: { pt: "Barco privado no Douro", en: "Private Douro boat trip" },
    summary: {
      pt: "As seis pontes vistas do rio, só para si, com o Capitão Paulo ao leme.",
      en: "The six bridges from the water, just for you, with Captain Paulo at the helm.",
    },
  },
  {
    id: "cooking-class",
    category: "porto",
    partner: "Helena",
    priceFrom: { amount: 80, per: "person" },
    duration: null,
    title: { pt: "Aula de cozinha portuguesa", en: "Portuguese cooking class" },
    summary: {
      pt: "Cozinhar e sentar à mesa: receitas de casa, aprendidas com quem as faz há anos.",
      en: "Cook, then sit down to eat: home recipes, learned from someone who has made them for years.",
    },
  },
  {
    id: "yacht",
    category: "porto",
    partner: null,
    priceFrom: { amount: 690, per: "group" },
    duration: null,
    title: { pt: "Cruzeiro privado de iate", en: "Private yacht cruise" },
    summary: {
      pt: "O Douro e a foz num iate só para o seu grupo.",
      en: "The Douro and its mouth on a yacht reserved for your group.",
    },
  },
  {
    id: "surf",
    category: "porto",
    partner: null,
    priceFrom: { amount: 30, per: "person" },
    duration: null,
    title: { pt: "Surf em Matosinhos", en: "Surf in Matosinhos" },
    summary: {
      pt: "Aulas privadas ou em grupo na praia mais próxima da cidade.",
      en: "Private or group lessons on the beach closest to the city.",
    },
  },
  {
    id: "wheels",
    category: "porto",
    partner: null,
    priceFrom: null,
    duration: null,
    title: { pt: "O Porto sobre rodas", en: "Porto on wheels" },
    summary: {
      pt: "Bicicleta, e-bike, Segway ou tuk-tuk, sempre com guia local.",
      en: "Bike, e-bike, Segway or tuk-tuk, always with a local guide.",
    },
  },
  {
    id: "hop-on",
    category: "porto",
    partner: null,
    priceFrom: null,
    duration: null,
    title: { pt: "Hop-on hop-off", en: "Hop-on hop-off" },
    summary: {
      pt: "Para ver a cidade inteira ao seu ritmo; o preço depende do bilhete.",
      en: "See the whole city at your own pace; price depends on the ticket.",
    },
  },
  {
    id: "douro-valley",
    category: "beyond",
    partner: null,
    priceFrom: { amount: 110, per: "person" },
    duration: { pt: "Dia inteiro", en: "Full day" },
    title: { pt: "Vinhos do Vale do Douro", en: "Douro Valley wine tour" },
    summary: {
      pt: "Quintas, provas, almoço e um passeio de barco no vale onde nasce o vinho do Porto.",
      en: "Estates, tastings, lunch and a boat trip in the valley where port is born.",
    },
  },
  {
    id: "aveiro-coimbra",
    category: "beyond",
    partner: null,
    priceFrom: { amount: 95, per: "person" },
    duration: { pt: "Dia inteiro", en: "Full day" },
    title: { pt: "Aveiro e Coimbra", en: "Aveiro & Coimbra" },
    summary: {
      pt: "Os canais de Aveiro de manhã, a universidade de Coimbra à tarde.",
      en: "Aveiro's canals in the morning, Coimbra's university in the afternoon.",
    },
  },
  {
    id: "braga-guimaraes",
    category: "beyond",
    partner: null,
    priceFrom: { amount: 89, per: "person" },
    duration: { pt: "Dia inteiro", en: "Full day" },
    title: { pt: "Braga e Guimarães", en: "Braga & Guimarães" },
    summary: {
      pt: "O Bom Jesus de Braga e o castelo onde Portugal começou.",
      en: "Braga's Bom Jesus and the castle where Portugal began.",
    },
  },
];
