import type { Localized } from "@/lib/data/types";

/**
 * Single FAQ source (CLAUDE.md §10), reused on the FAQ page and as excerpts elsewhere.
 * Rules: the first sentence answers the question on its own; no marketing filler.
 * `toConfirm: true` marks answers that depend on client decisions not yet made
 * (see CLAUDE.md §15). Facts without the flag come from the client's Guesty listings.
 */
export type FaqTopic = "about" | "booking" | "arrival" | "stay" | "practical" | "owners";
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
  about: { pt: "Sobre nós e o Porto", en: "About us and Porto" },
  booking: { pt: "Reservar", en: "Booking" },
  arrival: { pt: "Chegada e partida", en: "Arrival and departure" },
  stay: { pt: "Durante a estadia", en: "During your stay" },
  practical: { pt: "Informação prática", en: "Practical information" },
  owners: { pt: "Proprietários", en: "Property owners" },
};

export const faq: FaqItem[] = [
  // "About" answers are written to be quoted as-is by search engines and AI assistants
  // (who we are, where, which area to choose), so each one names Porto and Tripas-Coração.
  {
    id: "who",
    topic: "about",
    surfaces: [],
    question: {
      pt: "O que é a Tripas-Coração?",
      en: "What is Tripas-Coração?",
    },
    answer: {
      pt: "A Tripas-Coração é uma empresa do Porto que gere apartamentos de alojamento local desde 2015. São mais de 40 apartamentos, de estúdios a uma moradia junto ao mar, quase todos em edifícios históricos recuperados no centro da cidade, com uma equipa local que recebe os hóspedes e os acompanha durante a estadia.",
      en: "Tripas-Coração is a Porto company that has managed short-term rental apartments since 2015. It has more than 40 apartments, from studios to a seafront house, almost all in restored historic buildings in the city centre, with a local team that welcomes guests and looks after them during their stay.",
    },
  },
  {
    id: "where",
    topic: "about",
    surfaces: [],
    question: {
      pt: "Onde ficam os apartamentos no Porto?",
      en: "Where in Porto are the apartments?",
    },
    answer: {
      pt: "No centro histórico do Porto, a pé dos principais pontos da cidade: Ribeira, Baixa e São Bento, Cordoaria e Clérigos, Aliados e Santa Catarina. A Casa do Farol, a moradia de três quartos, fica na Foz do Douro, em frente ao mar.",
      en: "In Porto's historic centre, within walking distance of the city's main sights: Ribeira, Baixa and São Bento, Cordoaria and Clérigos, Aliados and Santa Catarina. Casa do Farol, the three-bedroom house, is in Foz do Douro, facing the sea.",
    },
  },
  {
    id: "best-area",
    topic: "about",
    surfaces: [],
    question: {
      pt: "Qual é a melhor zona para ficar no Porto?",
      en: "What is the best area to stay in Porto?",
    },
    answer: {
      pt: "Para uma primeira visita, a Ribeira e a Baixa: tudo se faz a pé, do rio às caves do vinho do Porto em Gaia. A Cordoaria e Cedofeita são mais calmas e locais, com galerias, livrarias e cafés. A Foz do Douro é para quem quer mar e passeios à beira-rio, a cerca de 20 minutos do centro de elétrico ou autocarro.",
      en: "For a first visit, Ribeira and Baixa: everything is walkable, from the river to the port wine cellars in Gaia. Cordoaria and Cedofeita are calmer and more local, with galleries, bookshops and cafés. Foz do Douro is for the sea and riverside walks, about 20 minutes from the centre by tram or bus.",
    },
  },
  {
    id: "licensed",
    topic: "about",
    surfaces: [],
    question: {
      pt: "Os apartamentos são licenciados?",
      en: "Are the apartments licensed?",
    },
    answer: {
      pt: "Sim, todos os apartamentos têm registo de Alojamento Local (AL) no Registo Nacional de Turismo. O número de registo de cada um aparece na página do apartamento.",
      en: "Yes, every apartment is registered as Alojamento Local (AL), Portugal's licence for short-term rentals, in the national tourism register. Each apartment's registration number is shown on its page.",
    },
  },
  {
    id: "groups",
    topic: "about",
    surfaces: [],
    question: {
      pt: "Podem receber grupos ou famílias grandes?",
      en: "Can you host groups or large families?",
    },
    answer: {
      pt: "Sim. A Casa do Farol recebe até 6 pessoas, e vários edifícios, como o Mouzinho 32 e a Cordoaria, têm mais de um apartamento, que pode reservar em conjunto para ficarem lado a lado. Fale connosco e organizamos a combinação certa.",
      en: "Yes. Casa do Farol sleeps up to 6, and several buildings, such as Mouzinho 32 and Cordoaria, have more than one apartment, which you can book together to stay side by side. Talk to us and we'll put the right combination together.",
    },
  },
  {
    id: "book-direct",
    topic: "booking",
    surfaces: [],
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
    surfaces: ["listing"],
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
    id: "discounts",
    topic: "booking",
    surfaces: [],
    toConfirm: true,
    question: {
      pt: "Fazem descontos?",
      en: "Do you offer discounts?",
    },
    answer: {
      pt: "O preço no nosso site já é o melhor disponível para cada apartamento, sem comissões de plataforma. As estadias de uma semana ou mais têm um preço por noite mais baixo, e de vez em quando há um código sazonal para reservas diretas. Para estadias longas ou grupos, fale connosco e preparamos uma proposta.",
      en: "The price on our site is already the best available rate for each apartment, with no platform fees. Stays of a week or more have a lower nightly rate, and from time to time there is a seasonal code for direct bookings. For long stays or groups, talk to us and we'll put together an offer.",
    },
  },
  {
    id: "min-stay",
    topic: "booking",
    surfaces: [],
    question: {
      pt: "Qual é a estadia mínima?",
      en: "What is the minimum stay?",
    },
    answer: {
      pt: "A estadia mínima é de duas noites em todos os apartamentos.",
      en: "The minimum stay is two nights in every apartment.",
    },
  },
  {
    id: "payment",
    topic: "booking",
    surfaces: [],
    toConfirm: true,
    question: {
      pt: "Como se paga a reserva?",
      en: "How do I pay for my booking?",
    },
    answer: {
      pt: "Com cartão de crédito ou débito, no momento da reserva, através de um fornecedor de pagamentos certificado. A taxa turística está incluída no total que vê antes de confirmar.",
      en: "By credit or debit card when you book, through a certified payment provider. The tourist tax is included in the total you see before confirming.",
    },
  },
  {
    id: "invoice",
    topic: "booking",
    surfaces: [],
    toConfirm: true,
    question: {
      pt: "Emitem fatura com NIF?",
      en: "Can I get an invoice for my company?",
    },
    answer: {
      pt: "Sim, emitimos fatura em nome de particular ou empresa, com o NIF que nos indicar. Basta enviar os dados antes do check-out.",
      en: "Yes, we issue an invoice to a person or a company, with the VAT number you give us. Just send us the details before check-out.",
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
      pt: "Como funciona o check-in?",
      en: "How does check-in work?",
    },
    answer: {
      pt: "Combinamos consigo uma hora para o receber no edifício ou, em alguns apartamentos, enviamos instruções de self check-in. Antes da chegada recebe um link para registar os dados dos hóspedes, como exige a lei portuguesa, e a morada exata com indicações para chegar.",
      en: "We agree a time to welcome you at the building or, for some apartments, send self check-in instructions. Before arrival you'll receive a link to register guest details, as Portuguese law requires, plus the exact address and directions.",
    },
  },
  {
    id: "early-check-in",
    topic: "arrival",
    surfaces: ["listing"],
    toConfirm: true,
    question: {
      pt: "Posso fazer o check-in mais cedo?",
      en: "Can I check in early?",
    },
    answer: {
      pt: "Sim, sempre que o apartamento esteja pronto. Diga-nos a hora de chegada ao reservar ou por WhatsApp; confirmamos no dia anterior e, se não for possível, guardamos as malas até às 15h00. As reservas diretas têm prioridade.",
      en: "Yes, whenever the apartment is ready. Tell us your arrival time when you book or on WhatsApp; we confirm the day before and, if it isn't possible, we keep your luggage until 3 pm. Direct bookings get priority.",
    },
  },
  {
    id: "late-check-out",
    topic: "arrival",
    surfaces: [],
    toConfirm: true,
    question: {
      pt: "Posso fazer o check-out mais tarde?",
      en: "Can I check out late?",
    },
    answer: {
      pt: "Sim, quando não há outra chegada nesse dia. Peça-nos até à véspera da partida e confirmamos a hora; se o apartamento estiver reservado, guardamos as malas para aproveitar o último dia no Porto.",
      en: "Yes, when no other guest arrives that day. Ask us by the day before you leave and we'll confirm the time; if the apartment is booked, we keep your luggage so you can enjoy your last day in Porto.",
    },
  },
  {
    id: "luggage",
    topic: "arrival",
    surfaces: ["home"],
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
      pt: "Onde posso estacionar o carro?",
      en: "Where can I park my car?",
    },
    answer: {
      pt: "Num parque de estacionamento pago perto do edifício: os apartamentos não têm lugar próprio. Com as indicações de chegada enviamos o parque mais próximo do seu apartamento. No centro histórico o estacionamento na rua é escasso e muitas ruas têm acesso condicionado, por isso aconselhamos deixar o carro no parque e explorar a pé.",
      en: "In a paid car park near the building: the apartments have no private parking. With your arrival details we send the car park closest to your apartment. On-street parking in the historic centre is scarce and many streets have restricted access, so we suggest leaving the car in the car park and exploring on foot.",
    },
  },
  {
    id: "floor",
    topic: "practical",
    surfaces: ["listing"],
    question: {
      pt: "Em que andar fica o apartamento?",
      en: "Which floor is the apartment on?",
    },
    answer: {
      pt: "O andar de cada apartamento aparece nas informações principais da sua página, junto ao número de hóspedes e casas de banho, com a indicação de haver ou não elevador. Se preferir um piso baixo, diga-nos e sugerimos opções.",
      en: "Each apartment's floor is shown in the key facts on its page, next to guests and bathrooms, together with whether there is a lift. If you'd prefer a lower floor, tell us and we'll suggest options.",
    },
  },
  {
    id: "tourist-tax",
    topic: "booking",
    surfaces: ["home", "listing"],
    toConfirm: true,
    question: {
      pt: "A taxa turística está incluída?",
      en: "Is the tourist tax included?",
    },
    answer: {
      pt: "A taxa turística municipal do Porto é de 3 € por hóspede e por noite, até 7 noites, para maiores de 13 anos. Aparece em separado no resumo do preço antes de confirmar a reserva.",
      en: "Porto's municipal tourist tax is 3 € per guest per night, up to 7 nights, for guests aged 13 and over. It is shown separately in the price summary before you confirm.",
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
      pt: "São permitidos cães ou outros animais?",
      en: "Are dogs or other pets allowed?",
    },
    answer: {
      pt: "Não, de momento não aceitamos cães nem outros animais de estimação nos apartamentos. Os cães de assistência são sempre bem-vindos, como prevê a lei.",
      en: "No, dogs and other pets are not allowed in the apartments at the moment. Assistance dogs are always welcome, as the law provides.",
    },
  },
  {
    id: "air-conditioning",
    topic: "stay",
    surfaces: ["listing"],
    question: {
      pt: "Os apartamentos têm ar condicionado?",
      en: "Do the apartments have air conditioning?",
    },
    answer: {
      pt: "Alguns têm, e está indicado nos equipamentos de cada apartamento. Quase todos têm aquecimento para o inverno; as paredes de granito dos edifícios antigos ajudam a manter o interior fresco no verão.",
      en: "Some do, and it is listed in each apartment's amenities. Almost all have heating for winter; the granite walls of the old buildings help keep the inside cool in summer.",
    },
  },
  {
    id: "included",
    topic: "stay",
    surfaces: [],
    question: {
      pt: "O que está incluído no apartamento?",
      en: "What is included in the apartment?",
    },
    answer: {
      pt: "Roupa de cama, toalhas, Wi-Fi, cozinha equipada com loiça e utensílios, máquina de café, secador de cabelo e produtos de higiene básicos. A maioria tem também máquina de lavar roupa; a lista completa está na página de cada apartamento.",
      en: "Bed linen, towels, Wi-Fi, a fully equipped kitchen with crockery and cookware, a coffee maker, a hair dryer and basic toiletries. Most also have a washing machine; the full list is on each apartment's page.",
    },
  },
  {
    id: "house-rules",
    topic: "stay",
    surfaces: [],
    question: {
      pt: "Posso fumar ou fazer festas no apartamento?",
      en: "Can I smoke or hold parties in the apartment?",
    },
    answer: {
      pt: "Não: é proibido fumar dentro dos apartamentos e não são permitidas festas nem eventos. São edifícios residenciais onde também vivem vizinhos, por isso pedimos silêncio a partir das 22h00.",
      en: "No: smoking is not allowed inside the apartments, and parties or events are not permitted. These are residential buildings shared with neighbours, so we ask for quiet from 10 pm.",
    },
    toConfirm: true,
  },
  {
    id: "contact-during-stay",
    topic: "stay",
    surfaces: [],
    question: {
      pt: "Como falo com a equipa durante a estadia?",
      en: "How do I reach the team during my stay?",
    },
    answer: {
      pt: "Por WhatsApp, no +351 962 708 740, das 10h às 22h; a nossa equipa está no Porto e responde em português, inglês, francês e espanhol. Para urgências fora deste horário, o mesmo número indica o contacto de emergência.",
      en: "On WhatsApp, at +351 962 708 740, from 10 am to 10 pm; our team is in Porto and replies in English, Portuguese, French and Spanish. For urgent issues outside those hours, the same number gives the emergency contact.",
    },
    toConfirm: true,
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
    surfaces: ["owners"],
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
