import type { GuideCategory, Localized } from "@/lib/data/types";

/**
 * Neighbourhood content (our own, not in Guesty). Guide entries name long-established public
 * places only; the client should add their own favourites (the current guest portal has a
 * curated Google map). Copy is new, written for this site.
 */
export interface NeighbourhoodContent {
  slug: string;
  name: Localized;
  tagline: Localized;
  intro: Localized;
  nearby: Localized<string[]>;
  guide: Array<{ category: GuideCategory; name: string; note: Localized }>;
  coordinates: { lat: number; lng: number };
  image: { src: string; alt: Localized };
}

export const neighbourhoods: NeighbourhoodContent[] = [
  {
    slug: "ribeira",
    name: { pt: "Ribeira", en: "Ribeira" },
    tagline: {
      pt: "Granito, rio e a cidade medieval a descer até ao cais.",
      en: "Granite, river and the medieval city tumbling down to the quay.",
    },
    intro: {
      pt: "A Ribeira é o Porto mais antigo: ruas estreitas que descem até ao Douro, fachadas de azulejo e o Palácio da Bolsa no topo da Praça do Infante. De manhã é dos moradores; ao fim da tarde, do rio.",
      en: "Ribeira is Porto at its oldest: narrow streets falling towards the Douro, tiled façades, and the Palácio da Bolsa at the top of Praça do Infante. Mornings belong to the neighbours; evenings belong to the river.",
    },
    nearby: {
      pt: ["Palácio da Bolsa · 2 min", "Cais da Ribeira · 5 min", "Ponte Luís I · 8 min", "Rua das Flores · 3 min"],
      en: ["Palácio da Bolsa · 2 min", "Ribeira quay · 5 min", "Luís I Bridge · 8 min", "Rua das Flores · 3 min"],
    },
    guide: [
      { category: "see", name: "Palácio da Bolsa", note: { pt: "Visita guiada ao Salão Árabe, o interior mais extravagante da cidade.", en: "Take the guided tour for the Arab Room, the city's most extravagant interior." } },
      { category: "see", name: "Igreja de São Francisco", note: { pt: "Gótica por fora, talha dourada por dentro.", en: "Gothic outside, wall-to-wall gilded woodwork inside." } },
      { category: "drink", name: "Caves de Vinho do Porto, Gaia", note: { pt: "Atravesse a ponte a pé e prove o vinho onde envelhece.", en: "Walk across the bridge and taste port where it ages." } },
      { category: "practical", name: "Elétrico 1", note: { pt: "Parte junto ao Infante e segue o rio até à Foz.", en: "Leaves from near Infante and follows the river to the sea at Foz." } },
    ],
    coordinates: { lat: 41.1417, lng: -8.6144 },
    image: {
      src: "/images/placeholder/mouzinho-rooftop-e-01.jpg",
      alt: { pt: "Sala luminosa com janelas em arco num edifício histórico da Ribeira", en: "Bright living room with arched windows in a historic Ribeira building" },
    },
  },
  {
    slug: "baixa",
    name: { pt: "Baixa e São Bento", en: "Baixa & São Bento" },
    tagline: {
      pt: "O centro que funciona: estação, mercado, cafés com cem anos.",
      en: "The working heart: the station, the market, century-old cafés.",
    },
    intro: {
      pt: "A Baixa é onde o Porto acontece todos os dias. A estação de São Bento, forrada a azulejo azul e branco, abre para a Avenida dos Aliados; daqui chega-se a pé a quase tudo, e os comboios para o Vale do Douro partem à porta.",
      en: "Baixa is where Porto goes about its day. São Bento station, lined in blue-and-white azulejo, opens onto Avenida dos Aliados; almost everything is walkable from here, and trains to the Douro Valley leave from the doorstep.",
    },
    nearby: {
      pt: ["Estação de São Bento · 1 min", "Sé do Porto · 5 min", "Mercado do Bolhão · 8 min", "Avenida dos Aliados · 3 min"],
      en: ["São Bento station · 1 min", "Porto Cathedral · 5 min", "Bolhão Market · 8 min", "Avenida dos Aliados · 3 min"],
    },
    guide: [
      { category: "see", name: "Estação de São Bento", note: { pt: "Cerca de 20 000 azulejos de Jorge Colaço contam a história do país no átrio.", en: "Around 20,000 tiles by Jorge Colaço tell Portugal's story across the main hall." } },
      { category: "eat", name: "Mercado do Bolhão", note: { pt: "Renovado, mas ainda de bancas: fruta, peixe, flores e petiscos ao balcão.", en: "Renovated but still a market of stalls: fruit, fish, flowers and snacks at the counter." } },
      { category: "drink", name: "Café Majestic", note: { pt: "Art nouveau de 1921 na Rua de Santa Catarina. Vá cedo.", en: "1921 art nouveau on Rua de Santa Catarina. Go early." } },
      { category: "practical", name: "Comboio para o Douro", note: { pt: "Linhas para a Régua e o Pinhão saem de São Bento: o vale sem carro.", en: "Trains to Régua and Pinhão leave from São Bento: the valley, no car needed." } },
    ],
    coordinates: { lat: 41.1456, lng: -8.6105 },
    image: {
      src: "/images/placeholder/sao-bento-duplex-06.jpg",
      alt: { pt: "Parede de azulejo azul e branco no pátio de um apartamento junto a São Bento", en: "Blue-and-white azulejo wall on the patio of an apartment by São Bento" },
    },
  },
  {
    slug: "cordoaria-cedofeita",
    name: { pt: "Cordoaria e Cedofeita", en: "Cordoaria & Cedofeita" },
    tagline: {
      pt: "Jardins, a Torre dos Clérigos e o bairro das galerias.",
      en: "Gardens, the Clérigos Tower and the gallery quarter.",
    },
    intro: {
      pt: "Entre o Jardim da Cordoaria e a Rua de Miguel Bombarda fica o Porto dos estudantes, dos ateliers e das livrarias. A Torre dos Clérigos marca as horas; ao fim do dia, o Passeio das Virtudes tem o melhor pôr do sol sobre o rio.",
      en: "Between the Cordoaria gardens and Rua de Miguel Bombarda lies the Porto of students, studios and bookshops. The Clérigos Tower keeps time; at dusk, Passeio das Virtudes has the best sunset over the river.",
    },
    nearby: {
      pt: ["Torre dos Clérigos · 3 min", "Livraria Lello · 4 min", "Jardim da Cordoaria · 1 min", "Rua de Miguel Bombarda · 10 min"],
      en: ["Clérigos Tower · 3 min", "Livraria Lello · 4 min", "Cordoaria gardens · 1 min", "Rua de Miguel Bombarda · 10 min"],
    },
    guide: [
      { category: "see", name: "Torre dos Clérigos", note: { pt: "Barroco de Nasoni; 240 degraus até à melhor vista do centro.", en: "Nasoni's baroque tower; 240 steps to the best view of the centre." } },
      { category: "see", name: "Centro Português de Fotografia", note: { pt: "Exposições gratuitas na antiga Cadeia da Relação.", en: "Free exhibitions inside the former Relação prison." } },
      { category: "see", name: "Rua de Miguel Bombarda", note: { pt: "Galerias, design e lojas independentes, rua após rua.", en: "Galleries, design and independent shops, street after street." } },
      { category: "drink", name: "Passeio das Virtudes", note: { pt: "Leve um copo e fique para o pôr do sol.", en: "Bring a glass and stay for the sunset." } },
    ],
    coordinates: { lat: 41.1462, lng: -8.6166 },
    image: {
      src: "/images/placeholder/cordoaria-garden-06.jpg",
      alt: { pt: "Janela de sacada aberta sobre as árvores do Jardim da Cordoaria", en: "French windows open onto the trees of the Cordoaria gardens" },
    },
  },
];
