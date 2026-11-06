import type { Localized } from "@/lib/data/types";

/**
 * Buildings (our grouping, not a Guesty record): name, street, neighbourhood and the Guesty tag that
 * links listings to them. `fromGuesty` is one factual line about the building taken from the client's
 * own Guesty descriptions (nothing invented): it closes the description of any flat in the building
 * whose own text doesn't already say it (`marker`, a case-insensitive pattern on Guesty's English).
 */
export interface BuildingContent {
  id: string;
  slug: string;
  name: string;
  street: string;
  neighbourhoodSlug: string;
  /** The client's Guesty listing tag for this building; links Guesty listings to it. */
  guestyTag: string;
  fromGuesty?: { marker: string; text: Localized };
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
    neighbourhoodSlug: "sao-bento-ribeira",
    fromGuesty: { marker: "original (stone )?fa[c\u00e7]ade", text: { pt: "O edifício foi totalmente renovado, mantendo a fachada original em pedra.", en: "The building was fully renovated, keeping its original stone façade." } },
    hasLift: false,
  },
  {
    id: "cordoaria",
    slug: "cordoaria",
    guestyTag: "Cordoaria",
    name: "Cordoaria",
    street: "Campo dos Mártires da Pátria 27",
    neighbourhoodSlug: "clerigos-cordoaria",
    fromGuesty: { marker: "Francisco", text: { pt: "As casas da Cordoaria são do Francisco, que abraçou a missão de renovar edifícios antigos e clássicos da Baixa do Porto.", en: "The Cordoaria homes belong to Francisco, who has made it his mission to renovate classic old buildings in downtown Porto." } },
    hasLift: false,
  },
  {
    id: "breiner-210",
    slug: "breiner-210",
    guestyTag: "Breiner",
    name: "Breiner 210",
    street: "Rua do Breiner 210",
    neighbourhoodSlug: "cedofeita-galerias",
    fromGuesty: { marker: "since the 19th century", text: { pt: "A casa pertence à mesma família desde o século XIX e foi sendo renovada ao longo dos anos.", en: "The house has belonged to the same family since the 19th century and has been renovated over the years." } },
    hasLift: false, // TO CONFIRM
  },
  {
    id: "sao-bento",
    slug: "sao-bento",
    guestyTag: "São Bento",
    name: "São Bento",
    street: "Praça de Almeida Garrett 24",
    neighbourhoodSlug: "sao-bento-ribeira",
    fromGuesty: { marker: "19th[- ]century|nineteenth century", text: { pt: "O edifício, em frente à estação de São Bento, guarda os traços arquitetónicos do século XIX e não tem elevador.", en: "The building, across from São Bento station, keeps its 19th-century architectural features and has no lift." } },
    hasLift: false, // TO CONFIRM
  },
  {
    id: "casa-do-farol",
    slug: "casa-do-farol",
    guestyTag: "Passeio Alegre",
    name: "Casa do Farol",
    street: "Rua do Passeio Alegre 516",
    neighbourhoodSlug: "foz",
    fromGuesty: { marker: "rebuilt", text: { pt: "A Casa do Farol é uma moradia acabada de reconstruir, à beira-mar, na Foz Velha.", en: "Casa do Farol is a newly rebuilt villa on the seafront in Foz Velha." } },
    hasLift: false, // TO CONFIRM (three floors)
  },
  // Buildings from Guesty's tags, not written up yet (no history copy, lift unknown).
  // Neighbourhood assignments are ours, by street: TO CONFIRM with the client.
  { id: "taipas-47", slug: "taipas-47", guestyTag: "Taipas", name: "Taipas 47", street: "Rua das Taipas 47", neighbourhoodSlug: "clerigos-cordoaria", fromGuesty: { marker: "early 20th[- ]century building", text: { pt: "O edifício, do início do século XX, foi renovado há pouco tempo e não tem elevador.", en: "The building dates from the early 20th century, was recently renovated and has no lift." } }, hasLift: null },
  { id: "almada-505", slug: "almada-505", guestyTag: "Almada", name: "Almada 505", street: "Rua do Almada 505", neighbourhoodSlug: "aliados-bolhao", hasLift: null },
  { id: "santa-catarina", slug: "santa-catarina", guestyTag: "Santa Catarina", name: "Santa Catarina", street: "Rua da Firmeza 410", neighbourhoodSlug: "aliados-bolhao", fromGuesty: { marker: "Francisco|20th century building", text: { pt: "As casas de Santa Catarina são do Francisco, que abraçou a missão de renovar edifícios antigos e clássicos da Baixa do Porto.", en: "The Santa Catarina homes belong to Francisco, who has made it his mission to renovate classic old buildings in downtown Porto." } }, hasLift: null },
  { id: "clerigos", slug: "clerigos", guestyTag: "Clérigos", name: "Clérigos", street: "Campo dos Mártires da Pátria 103", neighbourhoodSlug: "clerigos-cordoaria", fromGuesty: { marker: "historic (Porto )?building", text: { pt: "O apartamento fica num edifício histórico, sem elevador, junto à Torre dos Clérigos.", en: "The apartment is in a historic building, without a lift, by the Clérigos Tower." } }, hasLift: null },
  { id: "sa-da-bandeira-198", slug: "sa-da-bandeira-198", guestyTag: "Sá da Bandeira", name: "Sá da Bandeira 198", street: "Rua de Sá da Bandeira 198", neighbourhoodSlug: "aliados-bolhao", fromGuesty: { marker: "19th century", text: { pt: "O edifício junta traços arquitetónicos do final do século XIX a interiores modernos.", en: "The building combines late 19th-century architectural features with modern interiors." } }, hasLift: null },
  { id: "santa-teresa-40", slug: "santa-teresa-40", guestyTag: "Santa Teresa", name: "Santa Teresa 40", street: "Rua de Santa Teresa 40", neighbourhoodSlug: "cedofeita-galerias", hasLift: null },
];
