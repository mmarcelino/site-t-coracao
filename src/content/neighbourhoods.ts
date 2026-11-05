import type { Localized } from "@/lib/data/types";

/**
 * Neighbourhoods (our own grouping, not in Guesty): the area name and a short introduction shown in
 * each apartment's "Location" section. There are no neighbourhood pages (client decision 2026-11-05).
 */
export interface NeighbourhoodContent {
  slug: string;
  name: Localized;
  intro: Localized;
}

export const neighbourhoods: NeighbourhoodContent[] = [
  {
    slug: "sao-bento-ribeira",
    name: { pt: "São Bento e Ribeira", en: "São Bento & Ribeira" },
    intro: {
      pt: "Da estação de São Bento, forrada a azulejo, a Rua de Mouzinho da Silveira e a Rua das Flores descem até à Praça do Infante, ao Palácio da Bolsa e ao cais da Ribeira. É o Porto mais antigo, de granito e varandas de ferro: de manhã é dos moradores, ao fim da tarde é do rio.",
      en: "From São Bento station, lined in azulejo, Rua de Mouzinho da Silveira and Rua das Flores run down to Praça do Infante, the Palácio da Bolsa and the Ribeira quay. This is Porto at its oldest, all granite and iron balconies: mornings belong to the neighbours, evenings to the river.",
    },
  },
  {
    slug: "clerigos-cordoaria",
    name: { pt: "Clérigos e Cordoaria", en: "Clérigos & Cordoaria" },
    intro: {
      pt: "A Torre dos Clérigos marca as horas sobre o Jardim da Cordoaria, com as suas árvores centenárias. Daqui, a Rua das Taipas desce para as Virtudes, onde os moradores se juntam ao fim do dia para ver o sol a pôr-se sobre o rio. Tudo fica a pé: a Livraria Lello, a Baixa e a Ribeira.",
      en: "The Clérigos Tower keeps time over the Cordoaria gardens and their old trees. From here, Rua das Taipas drops towards Virtudes, where locals gather at dusk to watch the sun set over the river. Everything is walkable: Livraria Lello, the Baixa and Ribeira.",
    },
  },
  {
    slug: "cedofeita-galerias",
    name: { pt: "Cedofeita e Galerias", en: "Cedofeita & Galerias" },
    intro: {
      pt: "Entre a Praça Carlos Alberto e a Rua de Miguel Bombarda fica o Porto das galerias, do design e das lojas independentes. Ao fim do dia, a Rua da Galeria de Paris e as ruas à volta enchem-se de bares; de manhã, volta a ser um bairro de cafés e de vizinhos.",
      en: "Between Praça Carlos Alberto and Rua de Miguel Bombarda lies the Porto of galleries, design and independent shops. At night, Rua da Galeria de Paris and the streets around it fill with bars; by morning it's a neighbourhood of cafés and neighbours again.",
    },
  },
  {
    slug: "aliados-bolhao",
    name: { pt: "Aliados e Bolhão", en: "Aliados & Bolhão" },
    intro: {
      pt: "É o centro que funciona todos os dias: a Avenida dos Aliados e a Câmara, o Mercado do Bolhão com as suas bancas, e a Rua de Santa Catarina com o Café Majestic e a Capela das Almas. O metro do Bolhão e da Trindade leva diretamente ao aeroporto, e quase tudo fica a pé.",
      en: "This is the centre that works every day: Avenida dos Aliados and the City Hall, Bolhão Market and its stalls, and Rua de Santa Catarina with Café Majestic and the Capela das Almas. The metro at Bolhão and Trindade runs straight to the airport, and almost everything is walkable.",
    },
  },
  {
    slug: "foz",
    name: { pt: "Foz do Douro", en: "Foz do Douro" },
    intro: {
      pt: "A Foz é o Porto à beira-mar: ruas tranquilas de moradias antigas, o Jardim do Passeio Alegre e o paredão até ao farol. O centro histórico fica a dez minutos pela marginal ou no elétrico 1, que segue o rio.",
      en: "Foz is Porto by the sea: quiet streets of old villas, the Passeio Alegre garden and the seawall out to the lighthouse. The historic centre is ten minutes away along the riverside road, or on tram 1, which follows the river.",
    },
  },
];
