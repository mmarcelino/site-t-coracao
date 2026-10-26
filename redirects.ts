type Redirect = { source: string; destination: string; permanent: boolean };

/**
 * Old tripas-coracao.pt URLs → new routes, so search rankings survive launch (CLAUDE.md §7).
 * Permanent (308) once the new site is live. Extend as more legacy URLs are found
 * (FR/ES pages currently fall back to the PT/EN equivalents).
 */
export const redirects: Redirect[] = [
  // Owners / property management
  { source: "/pt/listwithus", destination: "/pt/gestao-alojamento-local", permanent: true },
  { source: "/listwithus", destination: "/en/property-management", permanent: true },
  { source: "/en/listwithus", destination: "/en/property-management", permanent: true },
  { source: "/short-term-rental-management-porto", destination: "/en/property-management", permanent: true },
  // Experiences / guest portal
  { source: "/pt/experiences-your-guest-portal", destination: "/pt/experiencias", permanent: true },
  { source: "/experiences-your-guest-portal", destination: "/en/experiences", permanent: true },
  { source: "/en/experiences-your-guest-portal", destination: "/en/experiences", permanent: true },
  // FAQ
  { source: "/pt/faqs", destination: "/pt/perguntas-frequentes", permanent: true },
  { source: "/faqs", destination: "/en/faq", permanent: true },
  { source: "/en/faqs", destination: "/en/faq", permanent: true },
  // FR / ES (out of scope for now) → closest locale
  { source: "/fr/:path*", destination: "/en", permanent: false },
  { source: "/es/:path*", destination: "/en", permanent: false },
];
