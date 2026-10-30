import type { Localized } from "@/lib/data/types";

/**
 * Book-direct perks, framed as hospitality rather than discounts (CLAUDE.md §5).
 * All TO CONFIRM: the client hasn't committed to specific perks yet (CLAUDE.md §15).
 */
export interface Perk {
  id: "best-rate" | "flexible" | "welcome" | "concierge" | "secure-payment" | "early-late";
  title: Localized;
  body: Localized;
}

export const perks: Perk[] = [
  {
    id: "best-rate",
    title: { pt: "O melhor preço, sempre aqui", en: "Our best rate, always here" },
    body: {
      pt: "O mesmo apartamento, sem comissões de plataforma. Se encontrar melhor, igualamos.",
      en: "The same apartment, without platform fees. Find it for less and we'll match it.",
    },
  },
  {
    id: "flexible",
    title: { pt: "Cancelamento flexível", en: "Flexible cancellation" },
    body: {
      pt: "Planos mudam. Cancelamento gratuito até 14 dias antes da chegada.",
      en: "Plans change. Free cancellation up to 14 days before arrival.",
    },
  },
  {
    id: "welcome",
    title: { pt: "Um presente de boas-vindas", en: "A welcome gift" },
    body: {
      pt: "Algo do Porto à sua espera: um vinho, um doce, uma recomendação nossa.",
      en: "Something from Porto waiting for you: a bottle, a pastry, a recommendation of ours.",
    },
  },
  {
    id: "concierge",
    title: { pt: "A nossa equipa, à distância de uma mensagem", en: "Our team, one message away" },
    body: {
      pt: "Fale diretamente connosco por WhatsApp, das 10h às 22h, antes e durante a estadia.",
      en: "Message us directly on WhatsApp, 10 am to 10 pm, before and during your stay.",
    },
  },
  {
    // Payment runs through Guesty's booking engine (GuestyPay or Stripe via Guesty, TO CONFIRM);
    // either way card data is tokenised by the provider and never stored on our site.
    id: "secure-payment",
    title: { pt: "Pagamento seguro", en: "Safe, secure payment" },
    body: {
      pt: "Pague com cartão num checkout encriptado, gerido por um fornecedor de pagamentos certificado. Os dados do seu cartão nunca ficam guardados no nosso site.",
      en: "Pay by card on an encrypted checkout run by a certified payment provider. Your card details are never stored on our site.",
    },
  },
  {
    id: "early-late",
    title: { pt: "Chegar cedo, sair tarde", en: "Arrive early, leave late" },
    body: {
      pt: "Prioridade na entrada antecipada e na saída tardia, sempre que a casa o permitir.",
      en: "Priority for early check-in and late check-out whenever the house allows.",
    },
  },
];
