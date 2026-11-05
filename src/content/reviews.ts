import type { Localized, Review, ReviewAggregate } from "@/lib/data/types";
import scores from "./review-scores.json";

/**
 * Guest reviews shown on the site: a fixed, hand-picked selection (not a live feed). Each is a real
 * review written in English, copied word for word from the client's Guesty account (Airbnb and
 * Booking.com) on 2026-11-05, with its Guesty review ID; only the first name is kept (Airbnb doesn't
 * share it). The Portuguese is our translation, labelled as such on the site.
 * Chosen for: top score, no complaints, a mix of homes and themes (the buildings, the design, the
 * team, the welcome). Never edit the English; to refresh, pick new ones from Guesty the same way.
 * TO CONFIRM with the client: permission to reuse platform reviews on the site.
 */
/** `language`: what the guest wrote in ("en" when omitted); the other locale shows our translation. */
export type CuratedReview = Omit<Review, "text" | "language" | "translatedFrom" | "mock"> & {
  text: Localized;
  language?: string;
};

export const curatedReviews: CuratedReview[] = [
  {
    id: "694ae8cd016f1f669e765d32",
    source: "airbnb",
    rating: 5,
    author: null,
    date: "2025-12-21",
    text: {
      en: "This is a beautiful, comfortable apartment in a spectacular location, right in the heart of the city with views to all of the great monuments of Porto, Gaia, and the Douro River. Our hosts were communicative and always very helpful, offering local advice and providing easy to access extra services which were a great addition to our stay. We will absolutely stay here again on our next visit to Porto.",
      pt: "É um apartamento bonito e confortável, numa localização espetacular, mesmo no coração da cidade, com vista para todos os grandes monumentos do Porto, de Gaia e do rio Douro. Os anfitriões foram comunicativos e sempre muito prestáveis, deram conselhos locais e disponibilizaram serviços extra fáceis de reservar, que foram uma ótima mais-valia para a nossa estadia. Vamos ficar aqui outra vez, sem dúvida, na nossa próxima visita ao Porto.",
    },
    listingId: "64de2984ec3b510037fc32c1",
  },
  {
    id: "6a39e0fbb85d997e1f0b0b6c",
    source: "airbnb",
    rating: 5,
    author: null,
    date: "2026-06-23",
    text: {
      en: "This was one of the most beautiful places we have ever stayed in. The apartment was thoughtfully designed with historic features that really tied together the whole aesthetic. Our host was responsive and gave great local suggestions! We hope to visit again someday because it holds a special place in our hearts",
      pt: "Foi um dos sítios mais bonitos onde já ficámos. O apartamento foi pensado ao pormenor, com elementos históricos que dão unidade a toda a estética. O nosso anfitrião respondeu sempre depressa e deu ótimas sugestões locais! Esperamos voltar um dia, porque ficou com um lugar especial no nosso coração.",
    },
    listingId: "60f82c307aba91002d2cc7cb",
  },
  {
    id: "6a96bab70d7cd74832fd1b1e",
    source: "booking",
    rating: 10,
    author: "Elisha",
    date: "2026-09-01",
    text: {
      en: "Communication was always very clear and proactive + communication happened well in advance! The hosts ensured we had all we needed, the beds were very comfortable, and the street was silenced by closing the wooden blinds. Design-wise, the room felt very cozy as well, with a good mix of mood and \"big\" lights. We would definitely stay here again when visiting Porto.",
      pt: "A comunicação foi sempre muito clara e proativa, e chegou com bastante antecedência! Os anfitriões garantiram que tínhamos tudo o que precisávamos, as camas eram muito confortáveis e, ao fechar as portadas de madeira, o barulho da rua desaparecia. Em termos de design, o quarto era muito acolhedor, com uma boa mistura de luzes de ambiente e luzes \"grandes\". Ficaríamos aqui outra vez, sem dúvida, numa próxima visita ao Porto.",
    },
    listingId: "60f82c3ac8730e002dc85a14",
  },
  {
    id: "6a9b1d500d7cd74832fe7294",
    source: "booking",
    rating: 10,
    author: "Moira",
    date: "2026-09-04",
    text: {
      en: "The place was extremely well kept, clean and had beautiful views of the Luis I bridge from above the clay roofs of the old city. Easy to access, clear instructions and communication was smooth during the stay. You had basics like water, soap, and even a Porto as a gift which is a basic when you arrive from a long flight with jet lag, I really appreciated this welcome kit.",
      pt: "O apartamento estava muito bem cuidado e limpo, com uma vista lindíssima sobre a ponte Luís I, por cima dos telhados de barro da cidade velha. Acesso fácil, instruções claras e uma comunicação simples durante toda a estadia. Tinha o essencial, como água, sabonete e até uma garrafa de vinho do Porto de oferta, o que é mesmo essencial quando se chega de um voo longo com jet lag. Gostei muito deste kit de boas-vindas.",
    },
    listingId: "611122c8a7980c002f8f6ccb",
  },
  {
    id: "6785b33bd07179e03474bd9a",
    source: "airbnb",
    rating: 5,
    author: null,
    date: "2025-01-13",
    text: {
      en: "Simply gorgeous, a wonderful place to come back to after days out in Porto. The high ceilings, natural light, and minimalist/elegant design made it extra special. Though just off one of the main drags in Porto, it was very calming and quiet. We walked everywhere and most things were within 15-20 minutes (with some hills 😉). Hosts were very responsive and I would highly recommend!",
      pt: "Simplesmente lindíssimo, um sítio maravilhoso para onde voltar depois de dias a explorar o Porto. Os tetos altos, a luz natural e o design minimalista e elegante tornaram-no ainda mais especial. Apesar de ficar mesmo ao lado de uma das ruas principais do Porto, era muito calmo e sossegado. Fizemos tudo a pé e quase tudo ficava a 15–20 minutos (com algumas subidas 😉). Os anfitriões responderam sempre muito depressa e recomendo vivamente!",
    },
    listingId: "610038abf6277f002d1dde13",
  },
  {
    id: "6a79ce150f872eb35b4b0d72",
    source: "airbnb",
    rating: 5,
    author: null,
    date: "2026-08-10",
    text: {
      en: "Amazing place in Porto! Located in a beautiful neighborhood right along the river, with incredible views from the apartment. It’s stylish, super comfortable, and equipped with everything you could need. The hosts paid attention to every detail, including a great wine selection. I will definitely book this place again next time I'm in Porto!",
      pt: "Um sítio incrível no Porto! Num bairro lindíssimo, mesmo junto ao rio, com vistas incríveis do apartamento. É elegante, muito confortável e tem tudo o que se pode precisar. Os anfitriões pensaram em todos os pormenores, incluindo uma ótima seleção de vinhos. Da próxima vez que vier ao Porto, volto a reservar aqui, sem dúvida!",
    },
    listingId: "64de2984ec3b510037fc32c1",
  },
  {
    id: "69317917b6424836f4d9060b",
    source: "airbnb",
    rating: 5,
    author: null,
    date: "2025-11-26",
    text: {
      en: "We had a wonderful experience and were blown away by the host’s attention to detail - everything in the house was so beautiful and clean. Our host even had a booklet of recommendations provided for us, which ended up being incredibly helpful during our trip. The entire experience was amazing and would definitely recommend!",
      pt: "Tivemos uma experiência maravilhosa e ficámos impressionados com a atenção ao pormenor do anfitrião: estava tudo lindíssimo e limpo. O anfitrião até nos deixou um caderno de recomendações, que acabou por ser imensamente útil durante a viagem. Toda a experiência foi fantástica e recomendamos sem dúvida!",
    },
    listingId: "61003aa1f6277f002d1e4070",
  },
  {
    id: "6a6b8548350f52a3a4cd6620",
    source: "airbnb",
    rating: 5,
    author: null,
    date: "2026-07-28",
    text: {
      en: "The place was amazing. Expertly designed - modern, very complimentary of surrounding buildings and architecture. This is a sea front property and most bedrooms have a sea-view. Beds were super comfortable, towels were soft, porto was delicious… thank you!! 🫰🏼🫶🏻",
      pt: "O sítio era incrível. Muito bem desenhado: moderno, e em perfeita harmonia com os edifícios e a arquitetura à volta. A casa fica de frente para o mar e a maioria dos quartos tem vista mar. As camas eram super confortáveis, as toalhas macias e o vinho do Porto estava delicioso… obrigado!! 🫰🏼🫶🏻",
    },
    listingId: "683036ac17f8820013f84e69",
  },
  {
    id: "6a061a712419815b5be337e5",
    source: "airbnb",
    rating: 5,
    author: null,
    date: "2026-05-14",
    text: {
      en: "Beautiful place to stay in a very walkable part of Porto. The natural light in the apartment is stunning and we loved enjoying a coffee at the dining table while admiring the view overlooking the little park across the street. Hosts were friendly, communicative, and provided thoughtful recommendations for exploring the city.",
      pt: "Um sítio lindo para ficar, numa zona do Porto onde se faz tudo a pé. A luz natural do apartamento é deslumbrante e adorámos tomar café à mesa de jantar a admirar a vista para o pequeno jardim do outro lado da rua. Os anfitriões foram simpáticos, comunicativos e deram recomendações muito bem pensadas para explorar a cidade.",
    },
    listingId: "64de2984ec3b510037fc32ab",
  },
  {
    id: "68b2e1b64843e91cbedc2f38",
    source: "booking",
    rating: 10,
    author: "Dan",
    date: "2025-08-29",
    text: {
      en: "The apartment was centrally located - easy walking to all main sites of Porto. It was well appointed with everything you would need for your stay. The hosts are extremely accommodating and have detailed documentation of everything from check-in instructions to how to use the coffee pot, oven, microwave, stove, washing machine, etc. The best host experience I have had. Overall, a wonderful place to stay.",
      pt: "O apartamento é central, a uma curta caminhada de todos os pontos principais do Porto. Está bem equipado, com tudo o que é preciso para a estadia. Os anfitriões são extremamente prestáveis e têm instruções detalhadas para tudo, desde o check-in até como usar a cafeteira, o forno, o micro-ondas, o fogão, a máquina de lavar roupa, etc. A melhor experiência com anfitriões que já tive. No geral, um sítio maravilhoso para ficar.",
    },
    listingId: "60f82cd97aba91002d2cfe72",
  },
  {
    id: "67a0e012542a550b5e52683f",
    source: "airbnb",
    rating: 5,
    author: null,
    date: "2025-01-28",
    text: {
      en: "This is a charming and beautifully designed space, perfect for two people. We stayed a week, cooked meals, ate out, enjoyed the view. For winter it’s great as the windows are double glazed and very noise insulating. The bed is comfy, and the windows can be left open just a tiny crack at night for air. Would rent again.",
      pt: "Um espaço encantador e muito bem desenhado, perfeito para duas pessoas. Ficámos uma semana, cozinhámos, comemos fora e aproveitámos a vista. No inverno é ótimo, porque as janelas têm vidro duplo e isolam muito bem o ruído. A cama é confortável e à noite podem-se deixar as janelas só um bocadinho abertas para entrar ar. Voltaria a alugar.",
    },
    listingId: "60f82c3bb82a7e002f865336",
  },
  {
    id: "68ecfb58fbee36e0f8f0b390",
    source: "airbnb",
    rating: 5,
    author: null,
    date: "2025-10-12",
    text: {
      en: "Excellent apartment, one of the best we've ever stayed in. Spacious, well-equipped, comfortable bed. Open and bright outlook with views over the city. Lovely kitchen, everything worked well. Super-responsive hosts. Perfect for our six nights in Porto. Thank you team!",
      pt: "Excelente apartamento, um dos melhores onde já ficámos. Espaçoso, bem equipado, cama confortável. Aberto e luminoso, com vista sobre a cidade. Cozinha ótima, tudo funcionou bem. Anfitriões sempre disponíveis e muito rápidos a responder. Perfeito para as nossas seis noites no Porto. Obrigado, equipa!",
    },
    listingId: "61003aa1f6277f002d1e4070",
  },
];

/**
 * Scores, each on its platform's own scale. Airbnb and Booking.com: averages of every guest review
 * in Guesty on the date in `review-scores.json` (not the platforms' own displayed figures, which can
 * weigh recent reviews differently), updated by `pnpm reviews:apply`. Google: read by hand from
 * "Tripas-Coração (Office)" on 2026-10-30. TO CONFIRM before launch.
 */
export const reviewScores: ReviewAggregate[] = [
  { source: "google", score: 4.9, outOf: 5, count: 516, mock: false },
  { source: "airbnb", score: scores.airbnb.score, outOf: 5, count: scores.airbnb.count, mock: false },
  { source: "booking", score: scores.booking.score, outOf: 10, count: scores.booking.count, mock: false },
];
