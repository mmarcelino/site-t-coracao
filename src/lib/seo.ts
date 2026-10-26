import type { Metadata } from "next";
import { site, siteUrl } from "@/content/site";
import { getPathname } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

type Href = Parameters<typeof getPathname>[0]["href"];

/** Absolute, localized URL for a route. */
export function absoluteUrl(locale: Locale, href: Href): string {
  return new URL(getPathname({ locale, href }), siteUrl).toString();
}

/** Canonical + hreflang alternates (CLAUDE.md §4). */
export function alternates(locale: Locale, href: Href): Metadata["alternates"] {
  return {
    canonical: absoluteUrl(locale, href),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l === "pt" ? "pt-PT" : l, absoluteUrl(l, href)])),
      "x-default": absoluteUrl("pt", href),
    },
  };
}

export const ogLocale: Record<Locale, string> = { pt: "pt_PT", en: "en_GB" };

/** Company structured data: LodgingBusiness (a subtype of LocalBusiness/Organization). */
export function organizationJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": `${siteUrl}/#organization`,
    name: site.name,
    url: absoluteUrl(locale, "/"),
    telephone: site.phone,
    email: site.email,
    foundingDate: String(site.foundedYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressCountry: site.address.countryCode,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    sameAs: [site.social.instagram, site.social.facebook],
    areaServed: { "@type": "City", name: "Porto" },
    checkinTime: "15:00",
    checkoutTime: "12:00",
    petsAllowed: false,
  };
}
