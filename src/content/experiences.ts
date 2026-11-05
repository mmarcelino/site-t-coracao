import type { Localized } from "@/lib/data/types";

/**
 * Partner experiences, carried over from tripas-coracao.pt/pt/experiences-your-guest-portal
 * (CLAUDE.md §9). Prices are "from" prices as published there. Durations are not published
 * on the current site: `duration: null` until the client confirms. Images: placeholders from the
 * same page (see SOURCES.md) for the tours shown on the home page; the rest TO CONFIRM.
 */
export interface Experience {
  id: string;
  category: "porto" | "beyond";
  partner: string | null;
  priceFrom: { amount: number; per: "person" | "group" } | null;
  duration: Localized | null;
  title: Localized;
  summary: Localized;
  image?: { src: string; alt: Localized };
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
    image: {
      src: "/images/placeholder/exp-food-walk.jpg",
      alt: { pt: "Quatro pessoas a partilhar petiscos numa rua do Porto", en: "Four people sharing food on a street in Porto" },
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
    image: {
      src: "/images/placeholder/exp-douro-boat.jpg",
      alt: { pt: "Passageiro de braços abertos num barco no Douro, com a Ponte Luís I ao fundo", en: "A passenger with arms outstretched on a boat on the Douro, the Luís I Bridge behind" },
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
    image: {
      src: "/images/placeholder/exp-cooking-class.jpg",
      alt: { pt: "A Helena a preparar peixe numa cozinha, com legumes e fruta na bancada", en: "Helena preparing fish in a kitchen, with vegetables and fruit on the counter" },
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
    image: {
      src: "/images/placeholder/exp-yacht.jpg",
      alt: { pt: "Iate a navegar no rio Douro, no Porto", en: "A yacht cruising on the Douro river in Porto" },
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
    image: {
      src: "/images/placeholder/exp-douro-valley.jpg",
      alt: { pt: "Socalcos de vinha no Vale do Douro, junto ao rio", en: "Terraced vineyards in the Douro Valley, beside the river" },
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

/**
 * Experiences page copy (tripas-coracao.pt/pt/experiences-your-guest-portal, rewritten): the three
 * ways in (short stay, longer stay, getting around), the guest portal, and the team's own map and
 * Viator picks. Links are the client's own, as published there.
 */
export const experiencesPage = {
  meta: {
    title: { pt: "Experiências no Porto e no Norte", en: "Experiences in Porto and the North" },
    description: {
      pt: "Passeios, provas e dias fora com os parceiros locais que conhecemos e recomendamos, mais um guia digital para cada estadia.",
      en: "Tours, tastings and days out with the local partners we know and recommend, plus a digital guide for every stay.",
    },
  },
  eyebrow: { pt: "Experiências", en: "Experiences" },
  title: { pt: "O Porto que mostramos aos amigos.", en: "The Porto we show our friends." },
  lead: {
    pt: "Gostamos de partilhar a cidade para lá dos postais: as tascas onde comemos, o rio visto de dentro, os dias fora que valem o caminho. Juntámos as pessoas que conhecemos e em quem confiamos.",
    en: "We like to share the city beyond the postcards: the taverns where we eat, the river seen from the water, the days out worth the drive. These are the people we know and trust.",
  },
  image: {
    src: "/images/placeholder/site-experiences.jpg",
    alt: {
      pt: "Hóspede a abrir um mapa do Porto junto a uma janela, com uma garrafa de vinho do Porto na mesa",
      en: "A guest unfolding a map of Porto by a window, a bottle of port on the table",
    },
  },
  paths: [
    {
      id: "porto",
      title: { pt: "Uns dias na cidade", en: "A few days in the city" },
      body: {
        pt: "Comida, rio e ruas antigas, tudo a pé ou a poucos minutos do apartamento.",
        en: "Food, the river and old streets, all on foot or a few minutes from your door.",
      },
    },
    {
      id: "beyond",
      title: { pt: "Uma estadia mais longa", en: "A longer stay" },
      body: {
        pt: "O Douro, Braga, Guimarães, Aveiro e Coimbra: o Norte cabe num dia de cada vez.",
        en: "The Douro, Braga, Guimarães, Aveiro and Coimbra: the North, one day at a time.",
      },
    },
    {
      id: "plan",
      title: { pt: "Chegar e circular", en: "Getting here and around" },
      body: {
        pt: "Transfers do aeroporto, transportes e reservas: diga-nos o que precisa e tratamos do resto.",
        en: "Airport transfers, getting around and bookings: tell us what you need and we'll handle the rest.",
      },
    },
  ] satisfies Array<{ id: "porto" | "beyond" | "plan"; title: Localized; body: Localized }>,
  porto: {
    title: { pt: "No Porto", en: "In Porto" },
    intro: {
      pt: "Meio dia ou uma noite: o melhor da cidade, com quem a conhece por dentro.",
      en: "Half a day or an evening: the best of the city, with people who know it from the inside.",
    },
  },
  beyond: {
    title: { pt: "Para lá do Porto", en: "Beyond Porto" },
    intro: {
      pt: "Dias inteiros pelo Norte, com recolha no centro e regresso ao fim do dia.",
      en: "Full days across the North, with pick-up in the centre and back by evening.",
    },
  },
  portal: {
    eyebrow: { pt: "Incluído em cada estadia", en: "Included with every stay" },
    title: { pt: "O seu guia digital do Porto", en: "Your digital guide to Porto" },
    body: {
      pt: "Antes de chegar, recebe o acesso ao nosso guia: tudo o que precisa para a estadia, no telemóvel, ao seu ritmo.",
      en: "Before you arrive, you get access to our guide: everything you need for your stay, on your phone, at your own pace.",
    },
    points: [
      { pt: "Check-in e informação prática da casa", en: "Check-in and practical details for your home" },
      { pt: "Os restaurantes, cafés e bares de que gostamos", en: "The restaurants, cafés and bars we like" },
      { pt: "Experiências e serviços extra, reservados em minutos", en: "Experiences and extra services, booked in minutes" },
      { pt: "Ideias para explorar a cidade por conta própria", en: "Ideas for exploring the city on your own" },
    ] satisfies Localized[],
    note: {
      pt: "Nem tudo cabe num guia. Para o resto, a equipa está a uma mensagem de distância.",
      en: "Not everything fits in a guide. For the rest, the team is one message away.",
    },
  },
  links: {
    title: { pt: "Mais ideias nossas", en: "More of our picks" },
    items: [
      {
        href: "https://www.google.com/maps/d/u/0/viewer?mid=1Mg0-zy9K3FjABk3WDnLd534Rej0mb4vj",
        title: { pt: "O nosso mapa do Porto", en: "Our map of Porto" },
        body: { pt: "Os lugares de que gostamos, no Google Maps.", en: "The places we love, on Google Maps." },
      },
      {
        href: "https://www.viator.com/agent-trip-suggestions/W-ef3a3986-c7c6-458e-b799-c812ce861719?currency=EUR",
        title: { pt: "As nossas escolhas no Viator", en: "Our picks on Viator" },
        body: { pt: "Mais passeios que recomendamos, para reservar online.", en: "More tours we recommend, to book online." },
      },
    ] satisfies Array<{ href: string; title: Localized; body: Localized }>,
  },
  form: {
    title: { pt: "Ajudamos a planear", en: "Let us help you plan" },
    body: {
      pt: "Diga-nos quando vem e o que lhe apetece. Respondemos com uma proposta e tratamos das reservas, privadas ou em grupo.",
      en: "Tell us when you're coming and what you're in the mood for. We'll reply with a suggestion and handle the bookings, private or shared.",
    },
  },
};
