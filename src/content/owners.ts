import type { Localized } from "@/lib/data/types";

/**
 * Owner services in six steps, carried over from tripas-coracao.pt/pt/listwithus (CLAUDE.md §9)
 * and rewritten for the new voice. Used on the home teaser now, the owners page later.
 */
export interface OwnerService {
  id: string;
  title: Localized;
  body: Localized;
}

export const ownerServices: OwnerService[] = [
  {
    id: "feasibility",
    title: { pt: "Análise de viabilidade", en: "Feasibility" },
    body: {
      pt: "Requisitos legais, previsão de receita com dados de mercado e o que muda a ocupação.",
      en: "Legal requirements, a market-based revenue forecast and what moves occupancy.",
    },
  },
  {
    id: "licensing",
    title: { pt: "Registo e licença", en: "Registration & licence" },
    body: {
      pt: "Registo como Alojamento Local e todos os procedimentos junto das autoridades.",
      en: "Alojamento Local registration and every step with the local authorities.",
    },
  },
  {
    id: "setup",
    title: { pt: "Preparação do imóvel", en: "Property set-up" },
    body: {
      pt: "Interiores, fotografia profissional e anúncios pensados para serem encontrados.",
      en: "Interiors, professional photography and listings built to be found.",
    },
  },
  {
    id: "operations",
    title: { pt: "Operação diária", en: "Daily operations" },
    body: {
      pt: "Hóspedes, limpezas, manutenção e resolução no local, antes que se torne um problema.",
      en: "Guests, cleaning, maintenance and on-site fixes, before they become problems.",
    },
  },
  {
    id: "revenue",
    title: { pt: "Gestão de receita", en: "Revenue management" },
    body: {
      pt: "Preços dinâmicos, disponibilidade e reputação geridos todos os dias.",
      en: "Dynamic pricing, availability and reputation, managed daily.",
    },
  },
  {
    id: "reporting",
    title: { pt: "Relação com o investidor", en: "Investor relations" },
    body: {
      pt: "Reuniões regulares, relatórios claros e total transparência.",
      en: "Regular reviews, clear reporting and full transparency.",
    },
  },
];
