import type { Localized } from "@/lib/data/types";

/**
 * Buildings (our own content, not in Guesty). Facts used here come from the client's Guesty
 * listing copy (stone façade at Mouzinho, Francisco's restorations at Cordoaria, the Breiner
 * house being in the family since the 19th century, the São Bento station view).
 * `era` values are INVENTED approximations until the client supplies real building history.
 */
export interface BuildingContent {
  id: string;
  slug: string;
  name: string;
  street: string;
  neighbourhoodSlug: string;
  /** The client's Guesty listing tag for this building; links Guesty listings to it. */
  guestyTag: string;
  // The fields below are optional: buildings we haven't written up yet show none of them.
  era?: Localized; // INVENTED, to confirm
  historyLine?: Localized;
  story?: Localized;
  /** Defaults to the cover of the building's first home. */
  heroImage?: { src: string; alt: Localized };
  /** Detail shot for the story block on apartment pages (avoids repeating a listing's cover). */
  storyImage?: { src: string; alt: Localized };
  /** null when unknown: nothing is said about lifts then. */
  hasLift: boolean | null;
}

export const buildings: BuildingContent[] = [
  {
    id: "mouzinho-32",
    slug: "mouzinho-32",
    guestyTag: "Mouzinho",
    name: "Mouzinho 32",
    street: "Rua de Mouzinho da Silveira 32",
    neighbourhoodSlug: "ribeira",
    era: { pt: "Final do século XIX", en: "Late 19th century" },
    historyLine: {
      pt: "Uma fachada de pedra original, guardada por inteiro, a olhar para o Palácio da Bolsa.",
      en: "An original stone façade, kept whole, looking out at the Palácio da Bolsa.",
    },
    story: {
      pt: "A Rua de Mouzinho da Silveira desce da estação de São Bento até ao rio. No número 32, a renovação manteve a fachada de granito e refez tudo o resto: escadas em madeira clara, casas de banho em azulejo verde-garrafa, mobiliário feito em Portugal. As janelas abrem para a Praça do Infante, o Mercado Ferreira Borges e as ruas que descem à Ribeira.",
      en: "Rua de Mouzinho da Silveira runs from São Bento station down to the river. At number 32 the renovation kept the granite façade and rebuilt everything else: pale-timber stairs, bottle-green tiled bathrooms, furniture made in Portugal. The windows open onto Praça do Infante, the Ferreira Borges market and the lanes leading down to Ribeira.",
    },
    heroImage: {
      src: "/images/placeholder/mouzinho-rooftop-e-01.jpg",
      alt: { pt: "Sala com janelas em arco e soalho claro no Mouzinho 32", en: "Living room with arched windows and pale floors at Mouzinho 32" },
    },
    storyImage: {
      src: "/images/placeholder/mouzinho-3d-03.jpg",
      alt: { pt: "Escada em madeira clara e parede de betão no Mouzinho 32", en: "Pale-timber staircase and concrete wall at Mouzinho 32" },
    },
    hasLift: false,
  },
  {
    id: "cordoaria",
    slug: "cordoaria",
    guestyTag: "Cordoaria",
    name: "Cordoaria",
    street: "Campo dos Mártires da Pátria 27",
    neighbourhoodSlug: "cordoaria-cedofeita",
    era: { pt: "Século XIX", en: "19th century" },
    historyLine: {
      pt: "Restaurado por um romântico moderno, com o jardim de um lado e o Douro do outro.",
      en: "Restored by a modern romantic, with the gardens on one side and the Douro on the other.",
    },
    story: {
      pt: "O Francisco passa os dias de trotinete pela cidade, a parar diante de pormenores de fachadas. Fez desta casa clássica da Cordoaria uma missão: recuperou-a piso a piso e deixou à vista a pedra original. Nós mobilámos os estúdios com peças de jovens designers, artistas e produtores portugueses — à frente, as árvores do jardim; atrás, o rio.",
      en: "Francisco spends his days scootering around the city, stopping to study façade details. Restoring this classic Cordoaria house became his mission, floor by floor, with the original stone left exposed. We furnished the studios with pieces by young Portuguese designers, artists and makers: garden trees at the front, the river at the back.",
    },
    heroImage: {
      src: "/images/placeholder/cordoaria-garden-01.jpg",
      alt: { pt: "Janelas altas de sacada sobre o Jardim da Cordoaria", en: "Tall French windows over the Cordoaria gardens" },
    },
    storyImage: {
      src: "/images/placeholder/cordoaria-mezzanine-05.jpg",
      alt: { pt: "Parede de granito original à vista na casa da Cordoaria", en: "Original granite wall left exposed in the Cordoaria house" },
    },
    hasLift: false,
  },
  {
    id: "breiner-210",
    slug: "breiner-210",
    guestyTag: "Breiner",
    name: "Breiner 210",
    street: "Rua do Breiner 210",
    neighbourhoodSlug: "cordoaria-cedofeita",
    era: { pt: "Século XIX", en: "19th century" },
    historyLine: {
      pt: "Na mesma família desde o século XIX — e mesmo ao lado do nosso escritório.",
      en: "In the same family since the 19th century — and right next door to our office.",
    },
    story: {
      pt: "Esta casa pertence à mesma família desde o século XIX e foi sendo renovada sem pressa: soalho de madeira, mobiliário feito à medida, loiça e linhos portugueses, uma casa de banho pequena que guarda os pormenores originais. No inverno pede uma manta e uma bebida quente. Fica no bairro das galerias, a dois passos do nosso escritório.",
      en: "This house has belonged to the same family since the 19th century and has been renovated slowly: timber floors, made-to-measure furniture, Portuguese ceramics and linen, a small bathroom that keeps its original details. In winter it asks for a blanket and a warm drink. It sits in the gallery quarter, a few steps from our office.",
    },
    heroImage: {
      src: "/images/placeholder/breiner-heritage-03.jpg",
      alt: { pt: "Sala com soalho de madeira e janelas de sacada no Breiner 210", en: "Living room with timber floors and French windows at Breiner 210" },
    },
    storyImage: {
      src: "/images/placeholder/breiner-heritage-08.jpg",
      alt: { pt: "Mesa de jantar junto à janela de sacada no Breiner 210", en: "Dining table by the French windows at Breiner 210" },
    },
    hasLift: false, // TO CONFIRM
  },
  {
    id: "sao-bento",
    slug: "sao-bento",
    guestyTag: "São Bento",
    name: "São Bento",
    street: "Praça de Almeida Garrett 24",
    neighbourhoodSlug: "baixa",
    era: { pt: "Século XIX", en: "19th century" },
    historyLine: {
      pt: "Em frente à estação mais bonita do país, com os azulejos à vista da cama.",
      en: "Facing the country's most beautiful station, its tiles in view from bed.",
    },
    story: {
      pt: "Do outro lado da praça fica a estação de São Bento e o seu átrio de azulejo azul e branco. O edifício guarda os traços do século XIX — tetos altos, janelas de sacada — com interiores calmos e contemporâneos. Daqui chega-se a pé à Sé, à Rua das Flores e ao rio; e os comboios para o Douro partem a um minuto.",
      en: "Across the square stands São Bento station and its blue-and-white tiled hall. The building keeps its 19th-century bones (high ceilings, French windows) with calm, contemporary interiors. The Cathedral, Rua das Flores and the river are all a walk away, and trains to the Douro leave a minute from the door.",
    },
    heroImage: {
      src: "/images/placeholder/sao-bento-ii-01.jpg",
      alt: { pt: "Estúdio com três janelas de sacada viradas para a estação de São Bento", en: "Studio with three French windows facing São Bento station" },
    },
    storyImage: {
      src: "/images/placeholder/sao-bento-duplex-06.jpg",
      alt: { pt: "Pátio forrado a azulejo azul e branco no edifício de São Bento", en: "Patio lined with blue-and-white azulejo in the São Bento building" },
    },
    hasLift: false, // TO CONFIRM
  },
  {
    id: "casa-do-farol",
    slug: "casa-do-farol",
    guestyTag: "Passeio Alegre",
    name: "Casa do Farol",
    street: "Rua do Passeio Alegre 516",
    neighbourhoodSlug: "foz",
    era: { pt: "Reconstruída recentemente", en: "Newly rebuilt" },
    historyLine: {
      pt: "Uma casa de azulejo verde na Foz Velha, de frente para o sítio onde o Douro encontra o mar.",
      en: "A green-tiled house in Foz Velha, facing the spot where the Douro meets the sea.",
    },
    story: {
      pt: "Na Rua do Passeio Alegre, entre o jardim e o rio, a Casa do Farol foi reconstruída por inteiro por trás da sua fachada de azulejo verde. Lá dentro há soalho de carvalho, obras de Maria Souto de Moura, David Pher e David Gonçalves, e um terraço virado ao Atlântico. O elétrico histórico passa à porta e leva-o ao centro ao longo do rio.",
      en: "On Rua do Passeio Alegre, between the garden and the river, Casa do Farol was rebuilt from the inside out behind its green azulejo façade. Inside: oak floors, works by Maria Souto de Moura, David Pher and David Gonçalves, and a terrace facing the Atlantic. The vintage tram stops at the door and runs along the river to the centre.",
    },
    heroImage: {
      src: "/images/placeholder/casa-do-farol-01.jpg",
      alt: { pt: "Fachada de azulejo verde da Casa do Farol, na Foz", en: "Green azulejo façade of Casa do Farol in Foz" },
    },
    storyImage: {
      src: "/images/placeholder/casa-do-farol-09.jpg",
      alt: { pt: "O elétrico histórico em frente à Casa do Farol", en: "The vintage tram passing Casa do Farol" },
    },
    hasLift: false, // TO CONFIRM (three floors)
  },
  // Buildings from Guesty's tags, not written up yet (no history copy, lift unknown).
  // Neighbourhood assignments are ours, by street: TO CONFIRM with the client.
  { id: "taipas-47", slug: "taipas-47", guestyTag: "Taipas", name: "Taipas 47", street: "Rua das Taipas 47", neighbourhoodSlug: "cordoaria-cedofeita", hasLift: null },
  { id: "almada-505", slug: "almada-505", guestyTag: "Almada", name: "Almada 505", street: "Rua do Almada 505", neighbourhoodSlug: "baixa", hasLift: null },
  { id: "santa-catarina", slug: "santa-catarina", guestyTag: "Santa Catarina", name: "Santa Catarina", street: "Rua da Firmeza 410", neighbourhoodSlug: "baixa", hasLift: null },
  { id: "clerigos", slug: "clerigos", guestyTag: "Clérigos", name: "Clérigos", street: "Campo dos Mártires da Pátria 103", neighbourhoodSlug: "cordoaria-cedofeita", hasLift: null },
  { id: "sa-da-bandeira-198", slug: "sa-da-bandeira-198", guestyTag: "Sá da Bandeira", name: "Sá da Bandeira 198", street: "Rua de Sá da Bandeira 198", neighbourhoodSlug: "baixa", hasLift: null },
  { id: "santa-teresa-40", slug: "santa-teresa-40", guestyTag: "Santa Teresa", name: "Santa Teresa 40", street: "Rua de Santa Teresa 40", neighbourhoodSlug: "cordoaria-cedofeita", hasLift: null },
];
