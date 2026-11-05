import type { Localized } from "@/lib/data/types";

/**
 * About page. Facts from the client's current page (tripas-coracao.pt/pt/spa): founded in 2015,
 * hosting plus restoring Porto's heritage, the "would we live here?" test, a local team, and the
 * people who run it (names and roles as published there). Rewritten for the new voice.
 */
export const about = {
  meta: {
    title: { pt: "Sobre nós", en: "About us" },
    description: {
      pt: "Desde 2015, uma equipa do Porto que junta a arte de receber à reabilitação do património da cidade.",
      en: "Since 2015, a Porto team bringing together the art of hosting and the restoration of the city's heritage.",
    },
  },
  eyebrow: { pt: "No Porto desde 2015", en: "In Porto since 2015" },
  title: { pt: "Fazer das tripas coração.", en: "Fazer das tripas coração." },
  titleNote: {
    pt: "Dar tudo o que se tem, e mais um pouco. É assim que trabalhamos, e foi o nome que escolhemos.",
    en: "A Portuguese saying: to go to any lengths for something. It's how we work, and the name we chose.",
  },
  lead: {
    pt: "Muito do que faz uma boa estadia não se vê: a cama feita com cuidado, a torneira que nunca pinga, a resposta que chega antes de acabar de perguntar. É esse cuidado que levamos a cada estadia.",
    en: "Much of what makes a stay good goes unseen: the bed made just so, the tap that never drips, the answer that arrives before you've finished asking. That care is what we bring to every stay.",
  },
  image: {
    src: "/images/placeholder/cordoaria-garden-06.jpg",
    alt: {
      pt: "Janela de sacada aberta sobre as árvores do Jardim da Cordoaria",
      en: "French windows open onto the trees of the Cordoaria gardens",
    },
  },
  story: {
    title: { pt: "Viveríamos aqui?", en: "Would we live here?" },
    body: {
      pt: [
        "A Tripas-Coração nasceu em 2015 de duas paixões que afinal eram uma só: a arte de receber e a reabilitação dos edifícios históricos do Porto. Desde o início quisemos valorizar os edifícios e os bairros onde trabalhamos, com a estrutura e a consistência de uma gestão profissional.",
        "Cada apartamento passa por um teste simples antes de se juntar a nós: viveríamos aqui? O que fica são casas reabilitadas com cuidado e respeito pela arquitetura original, práticas, autênticas e preparadas para continuar confortáveis ano após ano.",
      ],
      en: [
        "Tripas-Coração began in 2015 from two passions that turned out to be one: the art of hosting, and the restoration of Porto's historic buildings. From the start we set out to add value to the buildings and neighbourhoods we work in, with the structure and consistency of a professional operation.",
        "Every apartment passes one simple test before it joins us: would we live here? What makes it through are homes restored with care and respect for their original architecture: practical, authentic, and made to stay comfortable year after year.",
      ],
    },
  },
  team: {
    title: { pt: "Uma equipa do Porto, nascida e criada cá", en: "A Porto team, born and raised" },
    body: {
      pt: [
        "Somos daqui e gostamos da cidade, e do turismo que a respeita. As nossas viagens pelo mundo ensinaram-nos o que faz uma estadia resultar (e o que não faz), e é isso que pomos em cada uma.",
        "Cada estadia é acompanhada pela Inês, pela Nia, pela Liliana ou pela MJ: não apenas para receber, mas para que tudo corra bem do primeiro ao último dia.",
      ],
      en: [
        "We're from here, and we love this city and the kind of travel that respects it. Our own trips around the world taught us what makes a stay work (and what doesn't), and that's what we put into every one.",
        "Every stay is looked after by Inês, Nia, Liliana or MJ: not just to welcome you, but to make sure it all runs well from the first day to the last.",
      ],
    },
    members: [
      { name: "Nuno Alves", role: { pt: "Diretor executivo", en: "Chief executive" } },
      { name: "Liliana Resende", role: { pt: "Gestora de operações", en: "Operations manager" } },
      { name: "Inês Azevedo", role: { pt: "Atendimento ao hóspede e experiências", en: "Guest care and experiences" } },
      { name: "Nia Augusto", role: { pt: "Atendimento ao hóspede e marketing", en: "Guest care and marketing" } },
      { name: "João Caravela", role: { pt: "Responsável de manutenção", en: "Maintenance manager" } },
      { name: "Pedro Barbosa", role: { pt: "Financeiro sénior", en: "Senior finance" } },
      { name: "Maria João Antunes", role: { pt: "Financeira júnior", en: "Junior finance" } },
    ] satisfies Array<{ name: string; role: Localized }>,
  },
  care: {
    title: { pt: "Começa antes de chegar", en: "It starts before you arrive" },
    body: {
      pt: "Todas as casas têm gestão profissional, para que os pormenores simplesmente funcionem, antes, durante e depois da estadia.",
      en: "Every home is professionally managed, so the details simply work, before, during and after your stay.",
    },
    points: [
      {
        title: { pt: "Limpeza", en: "Cleaning" },
        body: { pt: "Cada casa preparada com o mesmo cuidado para cada chegada.", en: "Every home prepared with the same care for each arrival." },
      },
      {
        title: { pt: "Manutenção", en: "Maintenance" },
        body: { pt: "As pequenas coisas resolvidas antes de se tornarem um problema seu.", en: "Small things fixed before they become your problem." },
      },
      {
        title: { pt: "Uma equipa por perto", en: "A team close by" },
        body: { pt: "Da primeira mensagem ao último dia, a mesma equipa, no WhatsApp.", en: "From the first message to the last day, the same team, on WhatsApp." },
      },
    ] satisfies Array<{ title: Localized; body: Localized }>,
  },
};
