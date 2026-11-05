import type { Localized } from "@/lib/data/types";

/**
 * Owner services in six steps, carried over from tripas-coracao.pt/pt/listwithus (CLAUDE.md §9)
 * and rewritten for the new voice, with what each step covers (`details`, from the same page).
 */
export interface OwnerService {
  id: string;
  title: Localized;
  body: Localized;
  details: Localized[];
}

export const ownerServices: OwnerService[] = [
  {
    id: "feasibility",
    title: { pt: "Análise de viabilidade", en: "Feasibility" },
    body: {
      pt: "Requisitos legais, previsão de receita com dados de mercado e o que muda a ocupação.",
      en: "Legal requirements, a market-based revenue forecast and what moves occupancy.",
    },
    details: [
      { pt: "Requisitos legais e regulamentares do imóvel", en: "The property's legal and regulatory requirements" },
      { pt: "Previsão de receita com dados reais de mercado", en: "A revenue forecast built on real market data" },
      { pt: "O que pode aumentar a ocupação", en: "What could raise occupancy" },
    ],
  },
  {
    id: "licensing",
    title: { pt: "Registo e licença", en: "Registration & licence" },
    body: {
      pt: "Registo como Alojamento Local e todos os procedimentos junto das autoridades.",
      en: "Alojamento Local registration and every step with the local authorities.",
    },
    details: [
      { pt: "Registo como Alojamento Local", en: "Alojamento Local registration" },
      { pt: "Procedimentos junto das autoridades locais", en: "Procedures with the local authorities" },
    ],
  },
  {
    id: "setup",
    title: { pt: "Preparação do imóvel", en: "Property set-up" },
    body: {
      pt: "Interiores, fotografia profissional e anúncios pensados para serem encontrados.",
      en: "Interiors, professional photography and listings built to be found.",
    },
    details: [
      { pt: "Recomendações de interiores e equipamento", en: "Interior and equipment recommendations" },
      { pt: "Fotografia profissional", en: "Professional photography" },
      { pt: "Criação e otimização dos anúncios", en: "Listings created and optimised" },
    ],
  },
  {
    id: "operations",
    title: { pt: "Operação diária", en: "Daily operations" },
    body: {
      pt: "Hóspedes, limpezas, manutenção e resolução no local, antes que se torne um problema.",
      en: "Guests, cleaning, maintenance and on-site fixes, before they become problems.",
    },
    details: [
      { pt: "Comunicação com os hóspedes", en: "Guest communication" },
      { pt: "Limpeza e lavandaria", en: "Cleaning and laundry" },
      { pt: "Manutenção preventiva e corretiva", en: "Preventive and corrective maintenance" },
      { pt: "Resolução de imprevistos no local", en: "On-site problem solving" },
    ],
  },
  {
    id: "revenue",
    title: { pt: "Gestão de receita", en: "Revenue management" },
    body: {
      pt: "Preços dinâmicos, disponibilidade e reputação geridos todos os dias.",
      en: "Dynamic pricing, availability and reputation, managed daily.",
    },
    details: [
      { pt: "Preços dinâmicos", en: "Dynamic pricing" },
      { pt: "Gestão da disponibilidade", en: "Availability management" },
      { pt: "Acompanhamento das avaliações", en: "Review monitoring" },
    ],
  },
  {
    id: "reporting",
    title: { pt: "Relação com o investidor", en: "Investor relations" },
    body: {
      pt: "Reuniões regulares, relatórios claros e total transparência.",
      en: "Regular reviews, clear reporting and full transparency.",
    },
    details: [
      { pt: "Reuniões regulares de acompanhamento", en: "Regular review meetings" },
      { pt: "Relatórios financeiros e de desempenho", en: "Financial and performance reports" },
      { pt: "Transparência total nas contas", en: "Full transparency on the numbers" },
    ],
  },
];

/**
 * Owners page copy (tripas-coracao.pt/pt/listwithus, rewritten): the positioning, the two kinds of
 * owner it speaks to, and what sets the company apart. No fees, figures or testimonials are
 * published there, so none are given here.
 */
export const ownersPage = {
  meta: {
    title: { pt: "Gestão de alojamento local no Porto", en: "Short-term rental management in Porto" },
    description: {
      pt: "Gestão completa de alojamento local no Porto desde 2015: viabilidade, licença, preparação, operação, receita e relatórios. Um número limitado de imóveis.",
      en: "Full short-term rental management in Porto since 2015: feasibility, licensing, set-up, operations, revenue and reporting. A limited number of properties.",
    },
  },
  eyebrow: { pt: "Para proprietários", en: "For owners" },
  title: { pt: "Não gerimos imóveis. Gerimos ativos.", en: "We don't manage properties. We manage assets." },
  lead: {
    pt: "Gestão de alojamento local no Porto, de ponta a ponta, para proprietários que querem resultados consistentes e saber sempre onde estão.",
    en: "End-to-end short-term rental management in Porto, for owners who want consistent results and always know where they stand.",
  },
  image: {
    src: "/images/placeholder/breiner-heritage-03.jpg",
    alt: {
      pt: "Sala reabilitada com soalho antigo, sofá de madeira e candeeiros de cobre",
      en: "A restored living room with old wooden floors, a timber sofa and copper lamps",
    },
  },
  audiences: {
    title: { pt: "Para dois tipos de proprietário", en: "For two kinds of owner" },
    items: [
      {
        label: { pt: "Já em funcionamento", en: "Already operating" },
        title: { pt: "Bons meses, maus meses, e pouca certeza.", en: "Good months, bad months, and little certainty." },
        body: {
          pt: "Muitos imóveis funcionam, mas sem a estrutura para render de forma consistente: ocupação irregular, avaliações a oscilar, demasiado tempo gasto em imprevistos. É aí que entramos.",
          en: "Many properties work, but without the structure to perform consistently: patchy occupancy, swinging reviews, too much time lost to the unexpected. That's where we come in.",
        },
      },
      {
        label: { pt: "A pensar começar", en: "Thinking of starting" },
        title: { pt: "Começar certo, desde o primeiro dia.", en: "Start right, from day one." },
        body: {
          pt: "Se está a ponderar o alojamento local pela primeira vez, ajudamos a perceber se faz sentido e, se fizer, a montá-lo com estratégia desde o início: licença, casa, anúncios e preço.",
          en: "If you're considering short-term rental for the first time, we help you see whether it makes sense and, if it does, set it up with a strategy from the start: licence, home, listings and pricing.",
        },
      },
    ] satisfies Array<{ label: Localized; title: Localized; body: Localized }>,
  },
  approach: {
    title: { pt: "O que nos distingue", en: "What sets us apart" },
    items: [
      {
        title: { pt: "Poucos imóveis, de propósito", en: "Few properties, on purpose" },
        body: {
          pt: "Trabalhamos com um número limitado de imóveis, para dar a cada um a atenção de que precisa.",
          en: "We work with a limited number of properties, so each one gets the attention it needs.",
        },
      },
      {
        title: { pt: "Prevenir, não remediar", en: "Prevent, don't patch" },
        body: {
          pt: "Uma abordagem preventiva protege o imóvel, as avaliações e a receita, antes de haver um problema.",
          en: "A preventive approach protects the property, its reviews and its revenue, before anything goes wrong.",
        },
      },
      {
        title: { pt: "Perto e transparente", en: "Close and transparent" },
        body: {
          pt: "Uma equipa no Porto, contacto direto e números claros. Sabe sempre como está o seu imóvel.",
          en: "A team in Porto, direct contact and clear numbers. You always know how your property is doing.",
        },
      },
    ] satisfies Array<{ title: Localized; body: Localized }>,
  },
  services: {
    title: { pt: "Do primeiro estudo a cada relatório", en: "From the first study to every report" },
    intro: {
      pt: "Seis etapas, uma só equipa. Pode começar em qualquer uma.",
      en: "Six steps, one team. You can start at any of them.",
    },
  },
  form: {
    title: { pt: "Fale-nos do seu imóvel", en: "Tell us about your property" },
    body: {
      pt: "Uma primeira conversa não compromete. Diga-nos onde fica e em que ponto está, e respondemos com os próximos passos.",
      en: "A first conversation commits you to nothing. Tell us where it is and where things stand, and we'll reply with the next steps.",
    },
  },
};
