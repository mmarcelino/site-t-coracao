import type { ListingCategory, Localized } from "@/lib/data/types";

/**
 * Editorial overlay for Guesty listings: things Guesty doesn't hold (slug, building, story copy
 * in PT/EN, photo order) or holds only in English. Merged with the Guesty snapshot in
 * `src/lib/data/listings.ts`. When Guesty is live, this file keeps working: it's keyed by
 * Guesty listing ID.
 *
 * - `areaSqm` is INVENTED (Guesty has no area for these listings); ranges follow the current
 *   site (studios 30–50 m², 1-bed 50–60 m², 2-bed up to 150 m²). TO CONFIRM with the client.
 * - Copy is rewritten from the client's own Guesty descriptions.
 */
export type RoomKey =
  | "living"
  | "dining"
  | "kitchen"
  | "bedroom"
  | "bathroom"
  | "entrance"
  | "stairs"
  | "view"
  | "balcony"
  | "patio"
  | "detail";

export interface ListingContent {
  id: string;
  slug: string;
  buildingId: string;
  category: ListingCategory;
  areaSqm: number; // INVENTED
  title: Localized;
  tagline: Localized;
  summary: Localized;
  space: Localized;
  highlights: Localized<string[]>;
  /** Photo order: `n` is the index in the Guesty pictures array (1-based). */
  pictures: Array<{ n: number; room: RoomKey }>;
}

const mouzinhoSpace: Localized = {
  pt: "Pedra por fora, luz por dentro: paredes brancas, madeira clara e mobiliário e têxteis feitos em Portugal. A casa tem tudo para uma estadia longa, e um berço disponível a pedido.",
  en: "Stone outside, light within: white walls, pale timber and Portuguese-made furniture and textiles. Everything you need for a longer stay, and a cot on request.",
};

const cordoariaSpace: Localized = {
  pt: "Mobilado com peças de jovens designers, artistas e produtores portugueses, para sentir o Porto sem sair de casa. Como em muitos edifícios históricos, não há elevador, e a casa de banho tem um desenho próprio: sanita privada e duche e lavatório integrados no espaço.",
  en: "Furnished with pieces by young Portuguese designers, artists and makers, so Porto is felt even indoors. Like many heritage buildings there is no lift, and the bathroom has its own layout: a private WC, with shower and basin set into the room.",
};

const breinerSpace: Localized = {
  pt: "Soalho de madeira, mobiliário feito à medida, loiça e linhos portugueses. Dois quartos (o segundo com duas camas individuais ou uma de casal, à escolha) e duas casas de banho completas, uma delas com pormenores originais. Junto à cozinha, uma secretária com muita luz natural para quem trabalha à distância.",
  en: "Timber floors, made-to-measure furniture, Portuguese ceramics and linen. Two bedrooms (the second set up as twin or queen, your choice) and two full bathrooms, one keeping its original details. By the kitchen, a desk in plenty of natural light for remote work.",
};

const saoBentoSpace: Localized = {
  pt: "No centro histórico, Património Mundial da UNESCO: traços de arquitetura do século XIX com linhas contemporâneas, calmas e quentes. Tudo o que vale a pena ver no Porto fica a poucos passos.",
  en: "In the UNESCO-listed historic centre: 19th-century architecture with calm, warm contemporary lines. Everything worth seeing in Porto is a short walk away.",
};

export const listingContent: ListingContent[] = [
  {
    id: "64de2984ec3b510037fc32b6",
    slug: "mouzinho-32-rooftop-e",
    buildingId: "mouzinho-32",
    category: "two-bed",
    areaSqm: 95,
    title: { pt: "Rooftop E", en: "Rooftop E" },
    tagline: {
      pt: "O último piso do Mouzinho 32, com janelas em arco sobre a Praça do Infante.",
      en: "The top floor of Mouzinho 32, with arched windows over Praça do Infante.",
    },
    summary: {
      pt: "Num edifício totalmente renovado que manteve a fachada de pedra original, o Rooftop E ocupa o topo da casa. Da sala vê-se o Palácio da Bolsa, o Mercado Ferreira Borges e as ruas que descem à Ribeira.",
      en: "In a fully renovated building that kept its original stone façade, Rooftop E sits at the very top. From the living room you look out at the Palácio da Bolsa, the Ferreira Borges market and the lanes running down to Ribeira.",
    },
    space: mouzinhoSpace,
    highlights: {
      pt: ["Janelas em arco sobre a Praça do Infante", "Duas suites com casa de banho privada", "Mobiliário feito em Portugal"],
      en: ["Arched windows over Praça do Infante", "Two en-suite bedrooms", "Furniture made in Portugal"],
    },
    pictures: [
      { n: 1, room: "living" }, { n: 2, room: "dining" }, { n: 6, room: "bedroom" }, { n: 7, room: "bedroom" },
      { n: 8, room: "bedroom" }, { n: 4, room: "stairs" }, { n: 3, room: "entrance" }, { n: 5, room: "stairs" },
    ],
  },
  {
    id: "64de2984ec3b510037fc32c1",
    slug: "mouzinho-32-apartment-3d",
    buildingId: "mouzinho-32",
    category: "two-bed",
    areaSqm: 90,
    title: { pt: "Apartamento 3D", en: "Apartment 3D" },
    tagline: {
      pt: "Um open space em pedra e luz, com casas de banho em azulejo verde-garrafa.",
      en: "An open-plan floor of stone and light, with bottle-green tiled bathrooms.",
    },
    summary: {
      pt: "O terceiro piso do Mouzinho 32 é um grande open space virado para a Praça do Infante, com duas suites e uma casa de banho de serviço. A fachada de pedra original ficou; o interior é novo, sereno e muito claro.",
      en: "The third floor of Mouzinho 32 is one generous open-plan room facing Praça do Infante, with two en-suite bedrooms and a guest WC. The original stone façade stayed; the interior is new, quiet and full of light.",
    },
    space: mouzinhoSpace,
    highlights: {
      pt: ["Open space com vista para a praça", "Duas suites e casa de banho de serviço", "Casas de banho em azulejo verde"],
      en: ["Open-plan room facing the square", "Two en-suites plus a guest WC", "Green-tiled bathrooms"],
    },
    pictures: [
      { n: 1, room: "living" }, { n: 6, room: "bedroom" }, { n: 4, room: "bathroom" }, { n: 7, room: "bathroom" },
      { n: 3, room: "stairs" }, { n: 5, room: "entrance" }, { n: 8, room: "bathroom" }, { n: 2, room: "entrance" },
    ],
  },
  {
    id: "64de2984ec3b510037fc32a0",
    slug: "mouzinho-32-apartment-2e",
    buildingId: "mouzinho-32",
    category: "one-bed",
    areaSqm: 52,
    title: { pt: "Apartamento 2E", en: "Apartment 2E" },
    tagline: {
      pt: "Para dois, com janelas de sacada sobre a praça onde começa a Ribeira.",
      en: "For two, with French windows over the square where Ribeira begins.",
    },
    summary: {
      pt: "No segundo piso do Mouzinho 32, um apartamento para dois com sala de pé-direito alto e janelas de sacada viradas para a Praça do Infante. A dois minutos do Palácio da Bolsa e a cinco do rio.",
      en: "On the second floor of Mouzinho 32, an apartment for two with a high-ceilinged living room and French windows facing Praça do Infante. Two minutes from the Palácio da Bolsa, five from the river.",
    },
    space: mouzinhoSpace,
    highlights: {
      pt: ["Janelas de sacada sobre a praça", "Pé-direito alto", "Cinco minutos a pé do rio"],
      en: ["French windows over the square", "High ceilings", "Five minutes' walk to the river"],
    },
    pictures: [
      { n: 1, room: "living" }, { n: 2, room: "living" }, { n: 6, room: "living" }, { n: 4, room: "living" },
      { n: 5, room: "living" }, { n: 7, room: "living" }, { n: 8, room: "living" }, { n: 3, room: "stairs" },
    ],
  },
  {
    id: "60f82c3d7aba91002d2ccd0f",
    slug: "cordoaria-river-view-studio",
    buildingId: "cordoaria",
    category: "studio",
    areaSqm: 34,
    title: { pt: "Estúdio com varanda sobre o rio", en: "River-view studio with balcony" },
    tagline: {
      pt: "Uma varanda nas traseiras com o Douro inteiro à frente.",
      en: "A balcony at the back with the whole Douro in front of you.",
    },
    summary: {
      pt: "No segundo piso da casa da Cordoaria, este estúdio abre para uma varanda com vista larga sobre o Douro — o sítio certo para o fim do dia. A Torre dos Clérigos e os jardins da Cordoaria e das Virtudes ficam a dois passos.",
      en: "On the second floor of the Cordoaria house, this studio opens onto a balcony with a wide view over the Douro: the right place to end the day. The Clérigos Tower and the Cordoaria and Virtudes gardens are steps away.",
    },
    space: cordoariaSpace,
    highlights: {
      pt: ["Varanda com vista para o Douro", "Peças de designers portugueses", "Torre dos Clérigos a 3 minutos"],
      en: ["Balcony overlooking the Douro", "Pieces by Portuguese designers", "Clérigos Tower 3 minutes away"],
    },
    pictures: [
      { n: 3, room: "balcony" }, { n: 1, room: "living" }, { n: 2, room: "living" }, { n: 4, room: "bedroom" },
      { n: 6, room: "living" }, { n: 5, room: "kitchen" }, { n: 7, room: "living" }, { n: 8, room: "detail" },
    ],
  },
  {
    id: "60f82c3cb82a7e002f865672",
    slug: "cordoaria-garden-view-studio",
    buildingId: "cordoaria",
    category: "studio",
    areaSqm: 32,
    title: { pt: "Estúdio sobre o jardim", en: "Garden-view studio" },
    tagline: {
      pt: "Janelas altas abertas para as árvores do Jardim da Cordoaria.",
      en: "Tall windows opening onto the trees of the Cordoaria gardens.",
    },
    summary: {
      pt: "No primeiro piso, virado para a frente, este estúdio tem janelas de sacada que se abrem sobre o Jardim da Cordoaria, onde estudantes, artistas e moradores se cruzam todo o dia. Cafés, livrarias e a Lello à volta da esquina.",
      en: "On the first floor at the front, this studio has French windows opening over the Cordoaria gardens, where students, artists and neighbours cross paths all day. Cafés, bookshops and Livraria Lello around the corner.",
    },
    space: cordoariaSpace,
    highlights: {
      pt: ["Janelas de sacada sobre o jardim", "Cozinha em madeira feita à medida", "Livraria Lello a 4 minutos"],
      en: ["French windows over the gardens", "Made-to-measure timber kitchen", "Livraria Lello 4 minutes away"],
    },
    pictures: [
      { n: 1, room: "living" }, { n: 6, room: "view" }, { n: 2, room: "living" }, { n: 3, room: "living" },
      { n: 5, room: "bedroom" }, { n: 7, room: "kitchen" }, { n: 4, room: "living" }, { n: 8, room: "detail" },
    ],
  },
  {
    id: "60f82cd97aba91002d2cfe72",
    slug: "cordoaria-mezzanine-studio",
    buildingId: "cordoaria",
    category: "studio",
    areaSqm: 38,
    title: { pt: "Estúdio mezanino", en: "Mezzanine studio" },
    tagline: {
      pt: "Granito original à vista, dois níveis e uma pequena varanda.",
      en: "Original granite on show, two levels and a small balcony.",
    },
    summary: {
      pt: "No piso mezanino da casa da Cordoaria, a parede de granito original ficou à vista na casa de banho. Dois níveis, uma pequena varanda para o ar fresco e duas casas de banho: uma com duche, outra com sanita e lavatório.",
      en: "On the mezzanine level of the Cordoaria house, the original granite wall was left exposed in the bathroom. Two levels, a small balcony for fresh air, and two bathrooms: one with a shower, one with WC and basin.",
    },
    space: cordoariaSpace,
    highlights: {
      pt: ["Parede de granito original", "Duas casas de banho", "Pequena varanda"],
      en: ["Original granite wall", "Two bathrooms", "Small balcony"],
    },
    pictures: [
      { n: 1, room: "living" }, { n: 5, room: "bathroom" }, { n: 3, room: "living" }, { n: 2, room: "living" },
      { n: 8, room: "kitchen" }, { n: 7, room: "living" }, { n: 6, room: "bathroom" }, { n: 4, room: "detail" },
    ],
  },
  {
    id: "60f827e3b82a7e002f852152",
    slug: "breiner-heritage-apartment",
    buildingId: "breiner-210",
    category: "two-bed",
    areaSqm: 110,
    title: { pt: "Apartamento Heritage", en: "Heritage apartment" },
    tagline: {
      pt: "Uma casa de família desde o século XIX, no primeiro andar.",
      en: "A family house since the 19th century, on the first floor.",
    },
    summary: {
      pt: "O primeiro andar da casa do Breiner, que pertence à mesma família desde o século XIX. Pensado para quatro, com dois quartos, duas casas de banho e uma sala de soalho de madeira e janelas de sacada. Fica no bairro das galerias, com o rio, os Aliados e as Galerias de Paris a uma caminhada.",
      en: "The first floor of the Breiner house, in the same family since the 19th century. Made for four, with two bedrooms, two bathrooms and a timber-floored living room with French windows. It's in the gallery quarter, with the river, Aliados and Galerias de Paris all within walking distance.",
    },
    space: breinerSpace,
    highlights: {
      pt: ["Casa de família desde o século XIX", "Dois quartos, duas casas de banho", "Secretária para teletrabalho"],
      en: ["Family-owned since the 19th century", "Two bedrooms, two bathrooms", "Desk for remote work"],
    },
    pictures: [
      { n: 3, room: "living" }, { n: 7, room: "dining" }, { n: 2, room: "living" }, { n: 4, room: "living" },
      { n: 8, room: "dining" }, { n: 5, room: "living" }, { n: 6, room: "detail" }, { n: 1, room: "living" },
    ],
  },
  {
    id: "60f827e57aba91002d2bdc3c",
    slug: "breiner-skylight-apartment",
    buildingId: "breiner-210",
    category: "two-bed",
    areaSqm: 110,
    title: { pt: "Apartamento Skylight", en: "Skylight apartment" },
    tagline: {
      pt: "O segundo andar, com luz zenital e espaço para a família.",
      en: "The second floor, with a skylight and room for the family.",
    },
    summary: {
      pt: "O segundo andar da casa do Breiner: dois quartos, duas casas de banho e uma sala clara onde a luz entra de cima e pelas janelas de sacada. Berço e cadeira de bebé a pedido. O nosso escritório fica na porta ao lado.",
      en: "The second floor of the Breiner house: two bedrooms, two bathrooms and a bright living room lit from above and through French windows. Cot and high chair on request. Our office is the next door along.",
    },
    space: breinerSpace,
    highlights: {
      pt: ["Luz zenital", "Pensado para famílias", "A nossa equipa na porta ao lado"],
      en: ["Skylight", "Made for families", "Our team next door"],
    },
    pictures: [
      { n: 1, room: "living" }, { n: 6, room: "dining" }, { n: 2, room: "living" }, { n: 7, room: "dining" },
      { n: 3, room: "living" }, { n: 4, room: "living" }, { n: 8, room: "dining" }, { n: 5, room: "living" },
    ],
  },
  {
    id: "60f82c06c8730e002dc84744",
    slug: "sao-bento-station-view-studio",
    buildingId: "sao-bento",
    category: "one-bed",
    areaSqm: 40,
    title: { pt: "Estúdio vista estação", en: "Station-view studio" },
    tagline: {
      pt: "A estação de São Bento vista da cama.",
      en: "São Bento station, seen from your bed.",
    },
    summary: {
      pt: "No segundo andar, virado para a praça, três janelas de sacada enquadram a estação de São Bento, uma das mais bonitas do mundo. O centro histórico inteiro fica a pé.",
      en: "On the second floor facing the square, three French windows frame São Bento station, often called one of the most beautiful in the world. The whole historic centre is on foot.",
    },
    space: saoBentoSpace,
    highlights: {
      pt: ["Vista para a estação de São Bento", "Três janelas de sacada", "Comboios para o Douro a 1 minuto"],
      en: ["View of São Bento station", "Three French windows", "Douro trains a minute away"],
    },
    pictures: [
      { n: 1, room: "bedroom" }, { n: 6, room: "dining" }, { n: 4, room: "bedroom" }, { n: 2, room: "bedroom" },
      { n: 3, room: "bedroom" }, { n: 5, room: "bedroom" }, { n: 7, room: "bedroom" }, { n: 8, room: "detail" },
    ],
  },
  {
    id: "60f828533b29f7002f8ee8dc",
    slug: "sao-bento-duplex",
    buildingId: "sao-bento",
    category: "one-bed",
    areaSqm: 45,
    title: { pt: "Duplex São Bento", en: "São Bento duplex" },
    tagline: {
      pt: "Dois pisos e um pátio de azulejo, nas traseiras e em silêncio.",
      en: "Two floors and a tiled patio, at the quiet back of the house.",
    },
    summary: {
      pt: "Nas traseiras do edifício em frente a São Bento, um duplex com sala e cozinha em baixo, quarto em cima e um pequeno pátio forrado a azulejo azul e branco. O centro à porta; o silêncio lá dentro.",
      en: "At the back of the building facing São Bento, a duplex with living room and kitchen downstairs, bedroom upstairs and a small patio lined in blue-and-white azulejo. The centre at the door; quiet inside.",
    },
    space: saoBentoSpace,
    highlights: {
      pt: ["Pátio de azulejo", "Dois pisos", "Lado tranquilo do edifício"],
      en: ["Azulejo-tiled patio", "Two floors", "Quiet side of the building"],
    },
    pictures: [
      { n: 2, room: "living" }, { n: 6, room: "patio" }, { n: 1, room: "dining" }, { n: 3, room: "bedroom" },
      { n: 5, room: "kitchen" }, { n: 7, room: "bedroom" }, { n: 4, room: "bathroom" }, { n: 8, room: "bedroom" },
    ],
  },
];
