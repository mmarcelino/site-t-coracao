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
  guide: Array<{ category: GuideCategory; name: string; note: Localized }>;
  coordinates: { lat: number; lng: number };
  image: { src: string; alt: Localized };
}

export const neighbourhoods: NeighbourhoodContent[] = [
  {
    slug: "sao-bento-ribeira",
    name: { pt: "São Bento e Ribeira", en: "São Bento & Ribeira" },
    tagline: {
      pt: "A cidade antiga a descer da estação até ao rio.",
      en: "The old city, falling from the station to the river.",
    },
    intro: {
      pt: "Da estação de São Bento, forrada a azulejo, a Rua de Mouzinho da Silveira e a Rua das Flores descem até à Praça do Infante, ao Palácio da Bolsa e ao cais da Ribeira. É o Porto mais antigo, de granito e varandas de ferro: de manhã é dos moradores, ao fim da tarde é do rio.",
      en: "From São Bento station, lined in azulejo, Rua de Mouzinho da Silveira and Rua das Flores run down to Praça do Infante, the Palácio da Bolsa and the Ribeira quay. This is Porto at its oldest, all granite and iron balconies: mornings belong to the neighbours, evenings to the river.",
    },
    guide: [
      { category: "see", name: "Estação de São Bento", note: { pt: "Cerca de 20\u00a0000 azulejos de Jorge Colaço contam a história do país no átrio.", en: "Around 20\u00a0000 tiles by Jorge Colaço tell Portugal's story across the main hall." } },
      { category: "see", name: "Palácio da Bolsa", note: { pt: "Visita guiada ao Salão Árabe, o interior mais extravagante da cidade.", en: "Take the guided tour for the Arab Room, the city's most extravagant interior." } },
      { category: "see", name: "Rua das Flores", note: { pt: "Pedonal, de fachadas restauradas, entre lojas antigas e esplanadas.", en: "Pedestrian, with restored façades, old shops and café terraces." } },
      { category: "drink", name: "Caves de Vinho do Porto, Gaia", note: { pt: "Atravesse a Ponte Luís I a pé e prove o vinho onde envelhece.", en: "Walk across the Luís I Bridge and taste port where it ages." } },
      { category: "practical", name: "Comboio para o Douro", note: { pt: "Linhas para a Régua e o Pinhão saem de São Bento: o vale sem carro.", en: "Trains to Régua and Pinhão leave from São Bento: the valley, no car needed." } },
    ],
    coordinates: { lat: 41.1436, lng: -8.6128 },
    image: {
      src: "/images/placeholder/mouzinho-rooftop-e-01.jpg",
      alt: { pt: "Sala luminosa com janelas em arco num edifício histórico da Rua de Mouzinho da Silveira", en: "Bright living room with arched windows in a historic building on Rua de Mouzinho da Silveira" },
    },
  },
  {
    slug: "clerigos-cordoaria",
    name: { pt: "Clérigos e Cordoaria", en: "Clérigos & Cordoaria" },
    tagline: {
      pt: "A torre, os jardins e o melhor pôr do sol sobre o Douro.",
      en: "The tower, the gardens and the best sunset over the Douro.",
    },
    intro: {
      pt: "A Torre dos Clérigos marca as horas sobre o Jardim da Cordoaria, com as suas árvores centenárias. Daqui, a Rua das Taipas desce para as Virtudes, onde os moradores se juntam ao fim do dia para ver o sol a pôr-se sobre o rio. Tudo fica a pé: a Livraria Lello, a Baixa e a Ribeira.",
      en: "The Clérigos Tower keeps time over the Cordoaria gardens and their old trees. From here, Rua das Taipas drops towards Virtudes, where locals gather at dusk to watch the sun set over the river. Everything is walkable: Livraria Lello, the Baixa and Ribeira.",
    },
    guide: [
      { category: "see", name: "Torre dos Clérigos", note: { pt: "Barroco de Nasoni; 240 degraus até à melhor vista do centro.", en: "Nasoni's baroque tower; 240 steps to the best view of the centre." } },
      { category: "see", name: "Centro Português de Fotografia", note: { pt: "Exposições gratuitas na antiga Cadeia da Relação.", en: "Free exhibitions inside the former Relação prison." } },
      { category: "see", name: "Livraria Lello", note: { pt: "A escadaria vermelha mais fotografada do Porto; compre o bilhete antes.", en: "Porto's most photographed red staircase; book a ticket ahead." } },
      { category: "drink", name: "Passeio das Virtudes", note: { pt: "Leve um copo e fique para o pôr do sol.", en: "Bring a glass and stay for the sunset." } },
    ],
    coordinates: { lat: 41.1444, lng: -8.6166 },
    image: {
      src: "/images/placeholder/cordoaria-garden-06.jpg",
      alt: { pt: "Janela de sacada aberta sobre as árvores do Jardim da Cordoaria", en: "French windows open onto the trees of the Cordoaria gardens" },
    },
  },
  {
    slug: "cedofeita-galerias",
    name: { pt: "Cedofeita e Galerias", en: "Cedofeita & Galerias" },
    tagline: {
      pt: "Galerias de arte, livrarias e a noite do Porto.",
      en: "Art galleries, bookshops and Porto's nightlife.",
    },
    intro: {
      pt: "Entre a Praça Carlos Alberto e a Rua de Miguel Bombarda fica o Porto das galerias, do design e das lojas independentes. Ao fim do dia, a Rua da Galeria de Paris e as ruas à volta enchem-se de bares; de manhã, volta a ser um bairro de cafés e de vizinhos.",
      en: "Between Praça Carlos Alberto and Rua de Miguel Bombarda lies the Porto of galleries, design and independent shops. At night, Rua da Galeria de Paris and the streets around it fill with bars; by morning it's a neighbourhood of cafés and neighbours again.",
    },
    guide: [
      { category: "see", name: "Rua de Miguel Bombarda", note: { pt: "Galerias, design e lojas independentes, rua após rua.", en: "Galleries, design and independent shops, street after street." } },
      { category: "see", name: "Igreja do Carmo", note: { pt: "A fachada lateral de azulejo azul é das mais bonitas da cidade.", en: "Its blue-tiled side wall is one of the finest in the city." } },
      { category: "drink", name: "Rua da Galeria de Paris", note: { pt: "O coração da noite do Porto, a dois passos de casa.", en: "The heart of Porto's nightlife, a short walk from home." } },
      { category: "practical", name: "Rua de Cedofeita", note: { pt: "Rua pedonal de comércio de bairro, das mercearias às lojas de roupa.", en: "A pedestrian street of neighbourhood shops, from grocers to clothing." } },
    ],
    coordinates: { lat: 41.1495, lng: -8.6172 },
    image: {
      src: "/images/placeholder/breiner-heritage-01.jpg",
      alt: { pt: "Interior de um apartamento num edifício do século XIX na Rua do Breiner", en: "Inside an apartment in a 19th-century building on Rua do Breiner" },
    },
  },
  {
    slug: "aliados-bolhao",
    name: { pt: "Aliados e Bolhão", en: "Aliados & Bolhão" },
    tagline: {
      pt: "A avenida, o mercado e a rua das compras.",
      en: "The avenue, the market and the shopping street.",
    },
    intro: {
      pt: "É o centro que funciona todos os dias: a Avenida dos Aliados e a Câmara, o Mercado do Bolhão com as suas bancas, e a Rua de Santa Catarina com o Café Majestic e a Capela das Almas. O metro do Bolhão e da Trindade leva diretamente ao aeroporto, e quase tudo fica a pé.",
      en: "This is the centre that works every day: Avenida dos Aliados and the City Hall, Bolhão Market and its stalls, and Rua de Santa Catarina with Café Majestic and the Capela das Almas. The metro at Bolhão and Trindade runs straight to the airport, and almost everything is walkable.",
    },
    guide: [
      { category: "eat", name: "Mercado do Bolhão", note: { pt: "Renovado, mas ainda de bancas: fruta, peixe, flores e petiscos ao balcão.", en: "Renovated but still a market of stalls: fruit, fish, flowers and snacks at the counter." } },
      { category: "drink", name: "Café Majestic", note: { pt: "Arte Nova de 1921 na Rua de Santa Catarina. Vá cedo.", en: "1921 art nouveau on Rua de Santa Catarina. Go early." } },
      { category: "see", name: "Capela das Almas", note: { pt: "Toda forrada a azulejo azul e branco, na esquina de Santa Catarina.", en: "Clad in blue-and-white azulejo, on the corner of Santa Catarina." } },
      { category: "practical", name: "Metro para o aeroporto", note: { pt: "A linha violeta sai da Trindade e do Bolhão; cerca de meia hora até às partidas.", en: "The violet line leaves from Trindade and Bolhão; about half an hour to departures." } },
    ],
    coordinates: { lat: 41.1499, lng: -8.6085 },
    image: {
      src: "/images/placeholder/sao-bento-duplex-06.jpg",
      alt: { pt: "Parede de azulejo azul e branco num pátio no centro do Porto", en: "Blue-and-white azulejo wall on a patio in central Porto" },
    },
  },
  {
    slug: "foz",
    name: { pt: "Foz do Douro", en: "Foz do Douro" },
    tagline: {
      pt: "Onde o rio encontra o mar: jardins, farol e o elétrico à porta.",
      en: "Where the river meets the sea: gardens, a lighthouse and the tram at the door.",
    },
    intro: {
      pt: "A Foz é o Porto à beira-mar: ruas tranquilas de moradias antigas, o Jardim do Passeio Alegre e o paredão até ao farol. O centro histórico fica a dez minutos pela marginal ou no elétrico 1, que segue o rio.",
      en: "Foz is Porto by the sea: quiet streets of old villas, the Passeio Alegre garden and the seawall out to the lighthouse. The historic centre is ten minutes away along the riverside road, or on tram 1, which follows the river.",
    },
    guide: [
      { category: "see", name: "Jardim do Passeio Alegre", note: { pt: "Palmeiras, coreto e um minigolfe de família, mesmo em frente.", en: "Palm trees, a bandstand and a family mini-golf, right opposite." } },
      { category: "see", name: "Farol de Felgueiras", note: { pt: "Caminhe pelo paredão até ao farol ao pôr do sol.", en: "Walk the seawall out to the lighthouse at sunset." } },
      { category: "practical", name: "Elétrico 1", note: { pt: "O elétrico histórico liga a Foz ao centro ao longo do rio.", en: "The vintage tram links Foz to the centre along the river." } },
    ],
    coordinates: { lat: 41.1476, lng: -8.6707 },
    image: {
      src: "/images/placeholder/casa-do-farol-10.jpg",
      alt: { pt: "O rio e o Jardim do Passeio Alegre, na Foz", en: "The river and the Passeio Alegre garden in Foz" },
    },
  },
];
