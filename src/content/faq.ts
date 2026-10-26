import type { Localized } from "@/lib/data/types";

/**
 * Single FAQ source (CLAUDE.md §10), reused on the FAQ page and as excerpts elsewhere.
 * Rules: the first sentence answers the question on its own; no marketing filler.
 * `toConfirm: true` marks answers that depend on client decisions not yet made
 * (see CLAUDE.md §15). Facts without the flag come from the client's Guesty listings.
 */
export type FaqTopic = "booking" | "arrival" | "stay" | "practical" | "owners";
export type FaqSurface = "home" | "listing" | "owners" | "experiences";

export interface FaqItem {
  id: string;
  topic: FaqTopic;
  surfaces: FaqSurface[];
  question: Localized;
  answer: Localized;
  toConfirm?: boolean;
}

export const faqTopics: Record<FaqTopic, Localized> = {
  booking: { pt: "Reservar", en: "Booking" },
  arrival: { pt: "Chegada e partida", en: "Arrival and departure" },
  stay: { pt: "Durante a estadia", en: "During your stay" },
  practical: { pt: "Informação prática", en: "Practical information" },
  owners: { pt: "Proprietários", en: "Property owners" },
};

export const faq: FaqItem[] = [
  {
    id: "book-direct",
    topic: "booking",
    surfaces: ["home"],
    toConfirm: true,
    question: {
      pt: "Porque reservar diretamente e não no Airbnb ou Booking.com?",
      en: "Why book direct rather than on Airbnb or Booking.com?",
    },
    answer: {
      pt: "Reservar diretamente garante-lhe o melhor preço disponível para o mesmo apartamento, sem comissões de plataforma. Inclui também um presente de boas-vindas, contacto direto com a nossa equipa no Porto por WhatsApp e prioridade na entrada antecipada e saída tardia, sempre que possível.",
      en: "Booking direct gets you the best available rate for the same apartment, with no platform fees. It also includes a welcome gift, a direct WhatsApp line to our Porto team, and priority for early check-in and late check-out whenever possible.",
    },
  },
  {
    id: "safe-direct",
    topic: "booking",
    surfaces: ["home", "listing"],
    toConfirm: true,
    question: {
      pt: "É seguro reservar diretamente?",
      en: "Is it safe to book direct?",
    },
    answer: {
      pt: "Sim. O pagamento é processado por um fornecedor de pagamentos certificado e os dados do cartão nunca passam pelos nossos servidores. Somos uma empresa do Porto, com escritório na Rua do Breiner, e gerimos alojamento local desde 2015; todos os apartamentos têm registo de Alojamento Local.",
      en: "Yes. Payment is handled by a certified payment provider and card details never touch our servers. We are a Porto company with an office on Rua do Breiner, managing short-term rentals since 2015, and every apartment holds an Alojamento Local licence.",
    },
  },
  {
    id: "cancellation",
    topic: "booking",
    surfaces: ["home", "listing"],
    toConfirm: true,
    question: {
      pt: "Qual é a política de cancelamento?",
      en: "What is the cancellation policy?",
    },
    answer: {
      pt: "Nas reservas diretas, o cancelamento é gratuito até 14 dias antes da chegada. Depois disso, cobramos a primeira noite; se precisar de alterar datas, fale connosco e fazemos o possível para ajudar.",
      en: "Direct bookings can be cancelled free of charge up to 14 days before arrival. After that, the first night is charged; if you need to move your dates, talk to us and we'll do our best to help.",
    },
  },
  {
    id: "check-in-times",
    topic: "arrival",
    surfaces: ["home", "listing"],
    question: {
      pt: "A que horas é o check-in e o check-out?",
      en: "What are the check-in and check-out times?",
    },
    answer: {
      pt: "O check-in é a partir das 15h00 e o check-out até às 12h00. Entrada antecipada ou saída tardia são possíveis consoante a disponibilidade, mediante pedido.",
      en: "Check-in is from 3 pm and check-out is by 12 noon. Early check-in or late check-out can be arranged on request, depending on availability.",
    },
  },
  {
    id: "self-check-in",
    topic: "arrival",
    surfaces: ["listing"],
    question: {
      pt: "Como funciona a chegada? Há self check-in?",
      en: "How does arrival work? Is there self check-in?",
    },
    answer: {
      pt: "Combinamos consigo uma hora para o receber no edifício ou, em alguns casos, enviamos instruções de self check-in. Antes da chegada recebe um link para registar os dados dos hóspedes, como exige a lei portuguesa.",
      en: "We agree a time to welcome you at the building or, in some cases, send self check-in instructions. Before arrival you'll receive a link to register guest details, as Portuguese law requires.",
    },
  },
  {
    id: "luggage",
    topic: "arrival",
    surfaces: [],
    toConfirm: true,
    question: {
      pt: "Posso deixar as malas antes do check-in ou depois do check-out?",
      en: "Can I leave luggage before check-in or after check-out?",
    },
    answer: {
      pt: "Sim, guardamos a sua bagagem antes do check-in e depois do check-out. Diga-nos a hora prevista e indicamos-lhe o local.",
      en: "Yes, we can store your luggage before check-in and after check-out. Tell us your expected time and we'll let you know where to drop it.",
    },
  },
  {
    id: "lifts",
    topic: "practical",
    surfaces: ["home", "listing"],
    question: {
      pt: "Os edifícios têm elevador?",
      en: "Do the buildings have lifts?",
    },
    answer: {
      pt: "A maioria não tem: são edifícios históricos no centro do Porto, com escadas originais. Cada apartamento indica o piso; se tiver dificuldades de mobilidade, fale connosco antes de reservar e ajudamos a escolher.",
      en: "Most do not: these are historic buildings in central Porto with their original staircases. Each apartment lists its floor; if you have limited mobility, talk to us before booking and we'll help you choose.",
    },
  },
  {
    id: "parking",
    topic: "practical",
    surfaces: ["listing"],
    question: {
      pt: "Há estacionamento?",
      en: "Is there parking?",
    },
    answer: {
      pt: "Os apartamentos não têm estacionamento próprio, mas há parques pagos perto de todos os edifícios. O centro histórico vive-se melhor a pé, e o metro e os comboios estão a poucos minutos.",
      en: "The apartments have no private parking, but there are paid car parks near every building. The historic centre is best explored on foot, and the metro and trains are a few minutes away.",
    },
  },
  {
    id: "tourist-tax",
    topic: "booking",
    surfaces: ["listing"],
    toConfirm: true,
    question: {
      pt: "A taxa turística está incluída?",
      en: "Is the tourist tax included?",
    },
    answer: {
      pt: "A taxa turística municipal do Porto é de 3 € por hóspede e por noite, até 7 noites, para maiores de 13 anos. Aparece em separado no resumo do preço antes de confirmar a reserva.",
      en: "Porto's municipal tourist tax is €3 per guest per night, up to 7 nights, for guests aged 13 and over. It is shown separately in the price summary before you confirm.",
    },
  },
  {
    id: "long-stays",
    topic: "booking",
    surfaces: ["home"],
    question: {
      pt: "Aceitam estadias longas, de semanas ou meses?",
      en: "Do you accept long stays of weeks or months?",
    },
    answer: {
      pt: "Sim, recebemos estadias de um fim de semana até dois meses. Para estadias de uma semana ou mais, o preço por noite é mais baixo; para mais de um mês, fale connosco.",
      en: "Yes, we host stays from a weekend up to two months. Stays of a week or more have a lower nightly rate; for longer than a month, get in touch.",
    },
  },
  {
    id: "families",
    topic: "stay",
    surfaces: ["listing"],
    question: {
      pt: "Os apartamentos são adequados para famílias com bebés?",
      en: "Are the apartments suitable for families with babies?",
    },
    answer: {
      pt: "Sim. Temos berço e cadeira de bebé disponíveis a pedido, sem custo. Os apartamentos de dois quartos do Breiner 210 e do Mouzinho 32 são os mais confortáveis para famílias.",
      en: "Yes. A cot and high chair are available on request at no charge. The two-bedroom apartments at Breiner 210 and Mouzinho 32 are the most comfortable for families.",
    },
  },
  {
    id: "pets",
    topic: "stay",
    surfaces: ["listing"],
    question: {
      pt: "Posso levar o meu animal de estimação?",
      en: "Can I bring my pet?",
    },
    answer: {
      pt: "Não, de momento não aceitamos animais de estimação nos apartamentos.",
      en: "No, pets are not allowed in the apartments at the moment.",
    },
  },
  {
    id: "wifi",
    topic: "stay",
    surfaces: [],
    question: {
      pt: "Há Wi-Fi e espaço para trabalhar?",
      en: "Is there Wi-Fi and space to work?",
    },
    answer: {
      pt: "Todos os apartamentos têm Wi-Fi. Vários têm uma mesa ou secretária com boa luz natural, como os do Breiner 210, pensados para quem trabalha à distância.",
      en: "Every apartment has Wi-Fi. Several have a proper table or desk in good natural light, such as those at Breiner 210, set up for remote work.",
    },
  },
  {
    id: "cleaning",
    topic: "stay",
    surfaces: [],
    toConfirm: true,
    question: {
      pt: "Há limpeza durante a estadia?",
      en: "Is there cleaning during the stay?",
    },
    answer: {
      pt: "A limpeza final está incluída em todas as reservas. Em estadias mais longas, podemos marcar limpezas intermédias e troca de roupa de cama, com custo adicional.",
      en: "A final clean is included in every booking. For longer stays we can schedule mid-stay cleaning and fresh linen at an extra cost.",
    },
  },
  {
    id: "airport",
    topic: "practical",
    surfaces: [],
    toConfirm: true,
    question: {
      pt: "Podem organizar transfer do aeroporto?",
      en: "Can you arrange an airport transfer?",
    },
    answer: {
      pt: "Sim, organizamos transfer privado do Aeroporto Francisco Sá Carneiro mediante pedido. Em alternativa, a linha E do metro liga o aeroporto ao centro em cerca de 30 minutos.",
      en: "Yes, we can arrange a private transfer from Porto airport on request. Alternatively, metro line E connects the airport to the centre in about 30 minutes.",
    },
  },
  {
    id: "owners-what",
    topic: "owners",
    surfaces: ["owners", "home"],
    question: {
      pt: "Que serviços oferecem a proprietários?",
      en: "What do you offer property owners?",
    },
    answer: {
      pt: "Gerimos todo o ciclo do alojamento local: análise de viabilidade, licenciamento, preparação do imóvel, operação diária, gestão de receita e relatórios regulares ao proprietário. Trabalhamos com um número limitado de imóveis no Porto desde 2015.",
      en: "We manage the whole short-term rental cycle: feasibility, licensing, property set-up, daily operations, revenue management and regular owner reporting. We have worked with a limited number of Porto properties since 2015.",
    },
  },
  {
    id: "owners-licensing",
    topic: "owners",
    surfaces: ["owners"],
    question: {
      pt: "Tratam do registo de Alojamento Local?",
      en: "Do you handle the Alojamento Local registration?",
    },
    answer: {
      pt: "Sim. Tratamos do registo do imóvel como Alojamento Local e dos procedimentos junto das autoridades locais, depois de confirmar que o imóvel cumpre os requisitos legais.",
      en: "Yes. We register the property as Alojamento Local and handle the procedures with local authorities, after confirming the property meets the legal requirements.",
    },
  },
  {
    id: "owners-fees",
    topic: "owners",
    surfaces: ["owners"],
    toConfirm: true,
    question: {
      pt: "Quanto custa a gestão?",
      en: "How much does management cost?",
    },
    answer: {
      pt: "A gestão é cobrada como uma percentagem da receita, definida depois da análise de viabilidade de cada imóvel. Não há custos escondidos: tudo fica no contrato e nos relatórios.",
      en: "Management is charged as a percentage of revenue, set after the feasibility analysis for each property. There are no hidden costs: everything is in the contract and the reports.",
    },
  },
];

export function faqFor(surface: FaqSurface): FaqItem[] {
  return faq.filter((item) => item.surfaces.includes(surface));
}
