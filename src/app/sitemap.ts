import type { MetadataRoute } from "next";
import { getListingSlugs } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";
import { locales, type StaticPathname } from "@/i18n/routing";

/** Every public page in both locales, with hreflang alternates (CLAUDE.md §10). */
const PAGES: StaticPathname[] = ["/", "/apartments", "/experiences", "/property-management", "/about", "/faq", "/terms", "/privacy", "/cookies"];

type Href = Parameters<typeof absoluteUrl>[1];

function entry(href: Href): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl("pt", href),
    alternates: { languages: Object.fromEntries(locales.map((l) => [l === "pt" ? "pt-PT" : l, absoluteUrl(l, href)])) },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getListingSlugs();
  return [
    ...PAGES.map((pathname) => entry(pathname)),
    ...slugs.map((slug) => entry({ pathname: "/apartments/[slug]", params: { slug } })),
  ];
}
