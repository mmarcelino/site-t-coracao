import { defineRouting } from "next-intl/routing";

export const locales = ["pt", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pt";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/**
 * Internal pathnames (the folder names under `app/[locale]`) mapped to the public,
 * localized slugs. Adding a locale later means adding one key per entry.
 * Pages for routes not built yet render the localized 404 until their milestone.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/apartments": { pt: "/apartamentos", en: "/apartments" },
    "/apartments/[slug]": { pt: "/apartamentos/[slug]", en: "/apartments/[slug]" },
    "/buildings": { pt: "/edificios", en: "/buildings" },
    "/buildings/[slug]": { pt: "/edificios/[slug]", en: "/buildings/[slug]" },
    "/neighbourhoods": { pt: "/bairros", en: "/neighbourhoods" },
    "/neighbourhoods/[slug]": { pt: "/bairros/[slug]", en: "/neighbourhoods/[slug]" },
    "/experiences": { pt: "/experiencias", en: "/experiences" },
    "/property-management": { pt: "/gestao-alojamento-local", en: "/property-management" },
    "/about": { pt: "/sobre-nos", en: "/about" },
    "/faq": { pt: "/perguntas-frequentes", en: "/faq" },
    "/contact": { pt: "/contactos", en: "/contact" },
    "/terms": { pt: "/termos-e-condicoes", en: "/terms" },
    "/privacy": { pt: "/politica-de-privacidade", en: "/privacy" },
    "/cookies": { pt: "/politica-de-cookies", en: "/cookies" },
    "/checkout": { pt: "/reservar", en: "/checkout" },
  },
});

export type AppPathname = keyof typeof routing.pathnames;
/** Routes without dynamic segments (safe to link to with a plain string href). */
export type StaticPathname = Exclude<AppPathname, `${string}[${string}]${string}`>;
