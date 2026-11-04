import type { Localized } from "@/lib/data/types";

/**
 * Legal pages: Terms, Privacy, Cookies (PT/EN). Terms and Privacy are rewritten from the client's
 * current pages (tripas-coracao.pt/pt/newpage and /pt/privacy-policy, read 2026-11-04) and updated
 * for the new site (Guesty bookings, card payments through the provider, Microsoft Clarity instead
 * of Google Analytics/Ads, Vercel hosting, OpenStreetMap). The cookie policy is new: the old site
 * mixed it into the privacy policy. All three still need the client's review before launch
 * (tracked in CLAUDE.md §15, not shown on the pages).
 *
 * TO CONFIRM with the client (also in their questions doc):
 * - Cancellation: their published terms say 5 days (short stays) / 30 days (1 month+); the rest of
 *   the site says 14 days. These terms follow their published text until they decide.
 * - Tourist tax: their terms say it's paid at check-in; on this site Guesty includes it in the total.
 * - Registered company name ("Tripas-Coração, Lda." on their site) and NIF (not published).
 * - Payment provider (GuestyPay or Stripe) and data-retention periods.
 *
 * Text format: paragraphs, lists and tables; inline links as [text](url).
 */
export type LegalBlock =
  | { p: Localized }
  | { list: Localized<string[]> }
  | { table: { head: Localized<string[]>; rows: Array<Localized<string[]>> } }
  | { cookieSettings: true };

export interface LegalDoc {
  title: Localized;
  intro: Localized;
  /** YYYY-MM-DD */
  updated: string;
  sections: Array<{ heading: Localized; blocks: LegalBlock[] }>;
}

const contactPt = "Tripas-Coração, Lda. · Rua do Breiner 208, 4050-124 Porto · [ola@tripas-coracao.pt](mailto:ola@tripas-coracao.pt) · +351 962 708 740";
const contactEn = contactPt;

export const terms: LegalDoc = {
  title: { pt: "Termos e condições", en: "Terms and conditions" },
  intro: {
    pt: "Estes termos aplicam-se às reservas feitas diretamente neste site. Leia-os antes de reservar: ao confirmar uma reserva, aceita-os. Nas reservas feitas no Airbnb, Booking.com, Plum Guide ou VRBO aplicam-se as condições e as políticas de cancelamento dessas plataformas.",
    en: "These terms apply to bookings made directly on this website. Please read them before you book: confirming a booking means you accept them. Bookings made on Airbnb, Booking.com, Plum Guide or VRBO follow those platforms' own terms and cancellation policies.",
  },
  updated: "2026-11-04",
  sections: [
    {
      heading: { pt: "Quem somos", en: "Who we are" },
      blocks: [{ p: { pt: contactPt, en: contactEn } }],
    },
    {
      heading: { pt: "Reserva e pagamento", en: "Booking and payment" },
      blocks: [
        {
          list: {
            pt: [
              "O preço apresentado antes de confirmar inclui o alojamento, a limpeza e a taxa turística municipal, discriminados.",
              "O pagamento é feito com cartão, nos campos seguros do nosso processador de pagamentos. Os dados do cartão seguem diretamente para ele e nunca chegam ao nosso site.",
              "Alguns alojamentos permitem reserva imediata; noutros, envia um pedido que confirmamos o mais depressa possível.",
              "Recebe a confirmação e o código da reserva por email.",
            ],
            en: [
              "The price shown before you confirm includes the accommodation, cleaning and the city tourist tax, itemised.",
              "You pay by card in our payment provider's secure fields. Card details go straight to the provider and never reach our website.",
              "Some homes can be booked instantly; for others you send a request, which we confirm as soon as we can.",
              "Your confirmation and booking code arrive by email.",
            ],
          },
        },
      ],
    },
    {
      heading: { pt: "Check-in e check-out", en: "Check-in and check-out" },
      blocks: [
        {
          list: {
            pt: [
              "O check-in é a partir das 15:00 e o check-out até às 12:00, salvo acordo prévio.",
              "Gostamos de receber os hóspedes pessoalmente, mas nem sempre é possível. Na maioria dos casos o check-in é autónomo: as instruções ficam disponíveis no nosso portal de hóspedes 30 minutos antes da hora de chegada.",
              "Às 12:00 do dia de saída a equipa de limpeza chega ao apartamento, que deve estar desocupado. Um check-out tardio sem acordo prévio pode ter custos adicionais.",
              "Se a sua chegada se atrasar, contacte a pessoa indicada na confirmação da reserva para encontrarmos uma alternativa. Sem esse contacto, pode não conseguir entrar.",
              "Se não chegar na data do check-in nem nos avisar até às 12:00 do dia seguinte, podemos considerar a reserva cancelada por si.",
              "A lei portuguesa obriga ao registo dos hóspedes: antes da chegada enviamos-lhe um link para preencher esses dados.",
            ],
            en: [
              "Check-in is from 15:00 and check-out by 12:00, unless agreed otherwise in advance.",
              "We like to welcome guests in person, but it isn't always possible. Most check-ins are self check-in: instructions appear in our guest portal 30 minutes before your arrival time.",
              "At 12:00 on your departure day our cleaning team arrives, and the apartment should be empty. A late check-out without prior agreement may incur extra costs.",
              "If you're arriving late, contact the person named in your booking confirmation so we can arrange an alternative. Without that contact, you may not be able to get in.",
              "If you don't arrive on your check-in date and don't tell us by 12:00 the following day, we may treat the booking as cancelled by you.",
              "Portuguese law requires guest registration: before you arrive we send you a link to fill in those details.",
            ],
          },
        },
      ],
    },
    {
      heading: { pt: "Cancelamento", en: "Cancellation" },
      blocks: [
        {
          list: {
            pt: [
              "Estadias curtas: cancelamento gratuito até 5 dias antes da data de check-in. Depois disso, é cobrado o valor total.",
              "Estadias longas (1 mês ou mais): cancelamento gratuito até 30 dias antes da data de check-in. Depois disso, é cobrado o valor total.",
              "Se tivermos de cancelar a sua reserva por um problema no alojamento ou por motivo de força maior, devolvemos a totalidade do valor pago.",
            ],
            en: [
              "Short stays: free cancellation up to 5 days before check-in. After that, the full amount is charged.",
              "Long stays (1 month or more): free cancellation up to 30 days before check-in. After that, the full amount is charged.",
              "If we have to cancel your booking because of a problem with the home or for reasons beyond our control, we refund everything you've paid.",
            ],
          },
        },
        {
          p: {
            pt: "Não fazemos negócio com cancelamentos. Se precisar de cancelar, fale connosco primeiro: muitas vezes encontramos uma alternativa para não perder o valor da reserva.",
            en: "We don't make money from cancellations. If you need to cancel, talk to us first: we can often find an alternative so you don't lose what you've paid.",
          },
        },
      ],
    },
    {
      heading: { pt: "Taxa turística municipal", en: "City tourist tax" },
      blocks: [
        {
          p: {
            pt: "A taxa turística do Porto é obrigatória por lei: 3 € por pessoa e por noite, até 7 noites. Crianças com menos de 13 anos não pagam. Nas reservas diretas, cobramo-la em nome do Município e o valor aparece discriminado no preço da reserva.",
            en: "Porto's tourist tax is required by law: 3 € per person per night, up to 7 nights. Children under 13 don't pay. On direct bookings we collect it on the city's behalf, and it's itemised in your booking price.",
          },
        },
      ],
    },
    {
      heading: { pt: "Serviços adicionais", en: "Extra services" },
      blocks: [
        {
          p: {
            pt: "Os seguintes serviços não estão incluídos no preço da reserva, salvo indicação:",
            en: "The following aren't included in the booking price unless stated:",
          },
        },
        {
          list: {
            pt: [
              "Garrafeira: no apartamento há uma pequena seleção de vinhos portugueses de que gostamos. Se abrir uma garrafa, deixe o valor na caixa de madeira da sala.",
              "Toalhas e limpeza: as estadias de mais de 5 noites incluem uma troca de toalhas. Em estadias mais curtas, a troca e a limpeza a meio da estadia têm um custo adicional. Uma limpeza intermédia demora cerca de 30 a 40 minutos, e pedimos que saia do apartamento durante esse tempo.",
              "Check-in antecipado e check-out tardio: peça-os com antecedência; confirmamos se houver disponibilidade e têm um custo adicional. Se não for possível, pode deixar a bagagem connosco.",
              "Berço: mediante pedido, por 25 € (inclui berço, cadeira alta, toalha e produtos de higiene para bebé).",
            ],
            en: [
              "Wine: each apartment has a small selection of Portuguese wines we love. If you open a bottle, leave the amount in the wooden box in the living room.",
              "Towels and cleaning: stays of more than 5 nights include one towel change. On shorter stays, a towel change or mid-stay clean costs extra. A mid-stay clean takes about 30 to 40 minutes, and we ask you to step out while it happens.",
              "Early check-in and late check-out: ask in advance; we confirm if the home is free, and there's an extra charge. If it isn't possible, you can leave your luggage with us.",
              "Cot: on request, for 25 € (includes cot, high chair, baby towel and baby toiletries).",
            ],
          },
        },
      ],
    },
    {
      heading: { pt: "Estadias longas (1 mês ou mais)", en: "Long stays (1 month or more)" },
      blocks: [
        {
          list: {
            pt: [
              "A limpeza quinzenal com troca de roupa de cama e toalhas é obrigatória: 80 € por mês (duas limpezas), não incluídos no preço da reserva.",
              "A água e a eletricidade não estão incluídas. Estimamos cerca de 200 € por mês (60 € de água e 140 € de eletricidade); paga o consumo real e partilhamos consigo as faturas.",
            ],
            en: [
              "A fortnightly clean with fresh bed linen and towels is required: 80 € per month (two cleans), not included in the booking price.",
              "Water and electricity aren't included. We estimate about 200 € per month (60 € water, 140 € electricity); you pay the actual consumption and we share the bills with you.",
            ],
          },
        },
      ],
    },
    {
      heading: { pt: "Responsabilidade durante a estadia", en: "Your responsibility during the stay" },
      blocks: [
        {
          list: {
            pt: [
              "O alojamento é-lhe cedido para uso normal durante a estadia. Deve devolvê-lo em condições semelhantes às que encontrou, razoavelmente limpo, e cuidar do espaço, do mobiliário e dos equipamentos.",
              "Não é permitido fumar no interior.",
              "Os danos causados por si ou pelo seu grupo, no alojamento ou em propriedades vizinhas, são da responsabilidade de quem fez a reserva e podem ser cobrados.",
            ],
            en: [
              "The home is yours for normal use during your stay. Please return it in a similar condition to how you found it, reasonably clean, and look after the space, furniture and equipment.",
              "Smoking isn't allowed indoors.",
              "Damage caused by you or your group, to the home or neighbouring properties, is the responsibility of the person who made the booking and may be charged.",
            ],
          },
        },
      ],
    },
    {
      heading: { pt: "Reclamações", en: "Complaints" },
      blocks: [
        {
          p: {
            pt: "Se algo não correr bem, fale connosco primeiro: resolvemos quase tudo depressa. Pode também usar o [Livro de Reclamações eletrónico](https://www.livroreclamacoes.pt/Inicio/).",
            en: "If something isn't right, please tell us first: we can fix most things quickly. You can also use Portugal's official [Complaints Book](https://www.livroreclamacoes.pt/Inicio/).",
          },
        },
      ],
    },
  ],
};

export const privacy: LegalDoc = {
  title: { pt: "Política de privacidade", en: "Privacy policy" },
  intro: {
    pt: "Tratamos apenas os dados pessoais de que precisamos para o receber bem, e nunca os vendemos nem partilhamos com outras marcas para fins comerciais. Esta política explica que dados tratamos, porquê, com quem e quais são os seus direitos, ao abrigo do Regulamento Geral sobre a Proteção de Dados (RGPD, Regulamento (UE) 2016/679).",
    en: "We only process the personal data we need to host you well, and we never sell it or share it with other brands for marketing. This policy explains what data we process, why, with whom, and your rights under the General Data Protection Regulation (GDPR, Regulation (EU) 2016/679).",
  },
  updated: "2026-11-04",
  sections: [
    {
      heading: { pt: "Responsável pelo tratamento", en: "Who is responsible" },
      blocks: [
        {
          p: {
            pt: `A Tripas-Coração, Lda., responsável por este site (tripas-coracao.pt), é a entidade responsável pelo tratamento dos seus dados. Para qualquer questão: ${contactPt}.`,
            en: `Tripas-Coração, Lda., which runs this website (tripas-coracao.pt), is the controller of your personal data. For any question: ${contactEn}.`,
          },
        },
      ],
    },
    {
      heading: { pt: "Que dados tratamos e para quê", en: "What we process and why" },
      blocks: [
        {
          table: {
            head: { pt: ["Quando", "Dados", "Para quê"], en: ["When", "Data", "Why"] },
            rows: [
              {
                pt: ["Reserva", "Nome, email, telefone, mensagem, datas e número de hóspedes", "Gerir a reserva e a estadia (execução do contrato)"],
                en: ["Booking", "Name, email, phone, message, dates and number of guests", "To manage your booking and stay (performance of the contract)"],
              },
              {
                pt: ["Pagamento", "Dados do cartão, introduzidos nos campos seguros do processador de pagamentos", "Cobrar a reserva. Não recebemos nem guardamos os dados do cartão"],
                en: ["Payment", "Card details, entered in the payment provider's secure fields", "To charge the booking. We never receive or store card details"],
              },
              {
                pt: ["Antes da chegada", "Dados de identificação dos hóspedes", "Registo de hóspedes exigido pela lei portuguesa (obrigação legal)"],
                en: ["Before arrival", "Guests' identification details", "Guest registration required by Portuguese law (legal obligation)"],
              },
              {
                pt: ["Contacto (email, WhatsApp, formulários)", "Nome, contactos e a sua mensagem", "Responder-lhe"],
                en: ["Contact (email, WhatsApp, forms)", "Name, contact details and your message", "To reply to you"],
              },
              {
                pt: ["Novidades (opcional)", "Nome e email", "Enviar-lhe notícias, só com o seu consentimento, que pode retirar a qualquer momento"],
                en: ["Updates (optional)", "Name and email", "To send you news, only with your consent, which you can withdraw at any time"],
              },
              {
                pt: ["Navegação, com o seu consentimento", "Páginas vistas, cliques e gravações de sessão, com os campos de formulário ocultados (Microsoft Clarity)", "Perceber como o site é usado e melhorá-lo. Nunca na página de pagamento"],
                en: ["Browsing, with your consent", "Pages viewed, clicks and session recordings, with form fields hidden (Microsoft Clarity)", "To understand how the site is used and improve it. Never on the payment page"],
              },
            ],
          },
        },
        {
          p: {
            pt: "Os campos obrigatórios dos formulários são os necessários para cada finalidade. Sem eles, não conseguimos concluir a reserva ou responder-lhe.",
            en: "Required form fields are the ones each purpose needs. Without them, we can't complete your booking or reply to you.",
          },
        },
      ],
    },
    {
      heading: { pt: "Com quem partilhamos", en: "Who we share it with" },
      blocks: [
        {
          p: {
            pt: "Só com prestadores que nos ajudam a prestar o serviço, e apenas o necessário:",
            en: "Only with providers who help us deliver the service, and only what they need:",
          },
        },
        {
          list: {
            pt: [
              "Guesty: o nosso sistema de reservas e de gestão de alojamentos.",
              "O processador de pagamentos (GuestyPay ou Stripe): trata o pagamento com cartão.",
              "Microsoft (Clarity): estatísticas de utilização, só com o seu consentimento.",
              "Vercel: alojamento do site.",
              "OpenStreetMap: o mapa dos alojamentos. O seu navegador pede as imagens do mapa aos servidores do OpenStreetMap, que veem o seu endereço IP.",
              "WhatsApp (Meta): se nos contactar por WhatsApp.",
            ],
            en: [
              "Guesty: our booking and property-management system.",
              "Our payment provider (GuestyPay or Stripe): processes card payments.",
              "Microsoft (Clarity): usage statistics, only with your consent.",
              "Vercel: website hosting.",
              "OpenStreetMap: the apartments map. Your browser requests the map images from OpenStreetMap's servers, which see your IP address.",
              "WhatsApp (Meta): if you contact us on WhatsApp.",
            ],
          },
        },
        {
          p: {
            pt: "Alguns destes prestadores podem tratar dados fora da União Europeia; nesses casos, com as garantias previstas no RGPD.",
            en: "Some of these providers may process data outside the European Union; where they do, it's under the safeguards the GDPR requires.",
          },
        },
      ],
    },
    {
      heading: { pt: "Durante quanto tempo", en: "How long we keep it" },
      blocks: [
        {
          p: {
            pt: "Guardamos os dados apenas durante o tempo necessário para cada finalidade, ou o que a lei exigir (por exemplo, obrigações fiscais). Depois, apagamo-los ou anonimizamo-los. Os dados para envio de novidades ficam até retirar o consentimento.",
            en: "We keep data only as long as each purpose needs it, or as long as the law requires (for example, tax obligations). After that, we delete or anonymise it. Data for updates is kept until you withdraw your consent.",
          },
        },
      ],
    },
    {
      heading: { pt: "Os seus direitos", en: "Your rights" },
      blocks: [
        {
          list: {
            pt: [
              "Acesso: saber que dados temos sobre si.",
              "Retificação: corrigir dados incorretos.",
              "Apagamento: pedir que apaguemos os seus dados.",
              "Portabilidade: receber os seus dados num ficheiro, ou que os enviemos a outra entidade.",
              "Oposição: opor-se a um tratamento.",
              "Retirar o consentimento a qualquer momento, sem afetar o tratamento já feito.",
            ],
            en: [
              "Access: know what data we hold about you.",
              "Rectification: correct inaccurate data.",
              "Erasure: ask us to delete your data.",
              "Portability: receive your data in a file, or have us send it to another organisation.",
              "Objection: object to processing.",
              "Withdraw consent at any time, without affecting processing already done.",
            ],
          },
        },
        {
          p: {
            pt: "Para exercer qualquer direito, escreva para [ola@tripas-coracao.pt](mailto:ola@tripas-coracao.pt).",
            en: "To exercise any of these rights, email [ola@tripas-coracao.pt](mailto:ola@tripas-coracao.pt).",
          },
        },
      ],
    },
    {
      heading: { pt: "Reclamações", en: "Complaints" },
      blocks: [
        {
          p: {
            pt: "Se não ficar satisfeito, pode apresentar reclamação à Comissão Nacional de Proteção de Dados (CNPD): Rua de São Bento, n.º 148, 3.º, 1200-821 Lisboa · +351 213 928 400 · [geral@cnpd.pt](mailto:geral@cnpd.pt). Antes disso, pedimos que fale connosco para encontrarmos uma solução.",
            en: "If you're not satisfied, you can complain to Portugal's data protection authority, the CNPD: Rua de São Bento, n.º 148, 3.º, 1200-821 Lisboa · +351 213 928 400 · [geral@cnpd.pt](mailto:geral@cnpd.pt). Before that, please talk to us so we can try to put it right.",
          },
        },
      ],
    },
    {
      heading: { pt: "Cookies e alterações", en: "Cookies and changes" },
      blocks: [
        {
          p: {
            pt: "Os cookies que usamos estão descritos na [política de cookies](/pt/politica-de-cookies). Podemos atualizar esta política, por exemplo por alterações na lei; a data no topo indica a versão em vigor. Se mudarmos a forma como tratamos os seus dados, voltamos a pedir o seu consentimento quando for necessário.",
            en: "The cookies we use are described in our [cookie policy](/en/cookies). We may update this policy, for example when the law changes; the date at the top shows the current version. If we change how we process your data, we'll ask for your consent again where needed.",
          },
        },
      ],
    },
  ],
};

export const cookies: LegalDoc = {
  title: { pt: "Política de cookies", en: "Cookie policy" },
  intro: {
    pt: "Usamos o mínimo de cookies. Os necessários fazem o site funcionar; os de estatística só são ativados se aceitar. Não usamos cookies de publicidade nem de remarketing.",
    en: "We keep cookies to a minimum. The necessary ones make the site work; statistics cookies only switch on if you accept them. We don't use advertising or remarketing cookies.",
  },
  updated: "2026-11-04",
  sections: [
    {
      heading: { pt: "O que são cookies", en: "What cookies are" },
      blocks: [
        {
          p: {
            pt: "Pequenos ficheiros que um site guarda no seu navegador, por exemplo para lembrar uma escolha que fez.",
            en: "Small files a website stores in your browser, for example to remember a choice you made.",
          },
        },
      ],
    },
    {
      heading: { pt: "Necessários (sempre ativos)", en: "Necessary (always on)" },
      blocks: [
        {
          table: {
            head: { pt: ["Cookie", "Para quê", "Duração"], en: ["Cookie", "Purpose", "Lasts"] },
            rows: [
              {
                pt: ["tc_consent", "Guarda a sua escolha sobre cookies", "6 meses"],
                en: ["tc_consent", "Remembers your cookie choice", "6 months"],
              },
              {
                pt: ["NEXT_LOCALE", "Lembra a língua do site", "Até fechar o navegador"],
                en: ["NEXT_LOCALE", "Remembers the site language", "Until you close the browser"],
              },
            ],
          },
        },
      ],
    },
    {
      heading: { pt: "Estatística (só com o seu consentimento)", en: "Statistics (only with your consent)" },
      blocks: [
        {
          p: {
            pt: "Usamos o Microsoft Clarity para perceber como o site é usado (páginas vistas, cliques, gravações de sessão com os campos de formulário ocultados) e melhorá-lo. Só é carregado se aceitar, e nunca na página de pagamento. Os cookies são definidos pela Microsoft; as durações estão na [lista de cookies do Clarity](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-cookies).",
            en: "We use Microsoft Clarity to understand how the site is used (pages viewed, clicks, session recordings with form fields hidden) and improve it. It only loads if you accept, and never on the payment page. The cookies are set by Microsoft; their lifetimes are in [Clarity's cookie list](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-cookies).",
          },
        },
        {
          table: {
            head: { pt: ["Cookie", "Para quê"], en: ["Cookie", "Purpose"] },
            rows: [
              { pt: ["_clck", "Reconhece o mesmo visitante em visitas seguintes"], en: ["_clck", "Recognises the same visitor on later visits"] },
              { pt: ["_clsk", "Junta as páginas de uma visita numa só sessão"], en: ["_clsk", "Joins the pages of one visit into a single session"] },
              { pt: ["CLID, MUID, SM, MR, ANONCHK", "Cookies da Microsoft usados pelo Clarity para identificar o navegador"], en: ["CLID, MUID, SM, MR, ANONCHK", "Microsoft cookies Clarity uses to identify the browser"] },
            ],
          },
        },
      ],
    },
    {
      heading: { pt: "Mudar a sua escolha", en: "Change your choice" },
      blocks: [
        {
          p: {
            pt: "Pode mudar a sua escolha a qualquer momento aqui ou em “Cookies”, no rodapé. Também pode apagar os cookies nas definições do navegador.",
            en: "You can change your choice at any time here or under “Cookies” in the footer. You can also delete cookies in your browser settings.",
          },
        },
        { cookieSettings: true },
      ],
    },
    {
      heading: { pt: "Mais informação", en: "More information" },
      blocks: [
        {
          p: {
            pt: "O mapa dos alojamentos usa o OpenStreetMap, que não define cookies mas vê o seu endereço IP quando o mapa carrega. Para saber como tratamos os seus dados, consulte a [política de privacidade](/pt/politica-de-privacidade).",
            en: "The apartments map uses OpenStreetMap, which sets no cookies but sees your IP address when the map loads. For how we handle your data, see our [privacy policy](/en/privacy).",
          },
        },
      ],
    },
  ],
};
