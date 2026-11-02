import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { collections } from "@/content/collections";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Listing } from "@/lib/data";
import { createFormatter } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";

/**
 * Featured collections, two per row: a wide room shot and a detail side by side, then the title,
 * a line about it and a from-price under an ink rule. Each opens the apartments list filtered by tag.
 */
export async function Collections({ listings }: { listings: Listing[] }) {
  const t = await getTranslations();
  const locale = (await getLocale()) as Locale;
  const format = createFormatter(locale);
  const items = collections.flatMap((c) => {
    const homes = listings.filter((l) => l.tags.includes(c.tag));
    if (!c.featured || homes.length === 0) return [];
    const from = Math.min(...homes.map((l) => l.price.base.amount));
    return [{ c, count: homes.length, from, currency: homes[0]?.price.base.currency ?? "EUR" }];
  });

  return (
    <section aria-labelledby="collections-title" className="container-page section-y">
      <h2 id="collections-title" className="text-h2 reveal">
        <span className="block">{t("home.collectionsTitle")}</span> <span className="block">{t("home.collectionsTitleCta")}</span>
      </h2>
      <ul className="mt-[clamp(2rem,4vw,3.5rem)] grid gap-x-6 gap-y-14 md:grid-cols-2">
        {items.map(({ c, count, from, currency }) => (
          <li key={c.tag} className="reveal">
            <Link href={{ pathname: "/apartments", query: { tag: c.tag } }} className="group block">
              {/* Wide shot and detail side by side, one height (3:2 overall). */}
              <div className="grid aspect-[3/2] grid-cols-[3fr_2fr] gap-2">
                <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-limestone">
                  <Image
                    src={c.image.src}
                    alt={c.image.alt[locale]}
                    fill
                    sizes="(min-width: 768px) 28vw, 60vw"
                    className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-soft)] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-limestone">
                  <Image src={c.detail.src} alt={c.detail.alt[locale]} fill sizes="(min-width: 768px) 19vw, 40vw" className="object-cover" />
                </div>
              </div>
              <div className="mt-5 border-t-2 border-ink pt-4">
                <div className="flex items-start justify-between gap-6">
                  {/* Name, then the count: smaller, quiet, after a small dot. */}
                  <div className="flex flex-wrap items-center gap-x-2.5">
                    <h3 className="card-title">{c.title[locale]}</h3>
                    <p className="flex items-center gap-2.5 text-small text-granite">
                      <span aria-hidden className="size-1 rounded-full bg-current" />
                      {t("home.collectionCount", { count })}
                    </p>
                  </div>
                  <Icon
                    name="arrowRight"
                    size={32}
                    strokeWidth={1.75}
                    className="shrink-0 transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)] group-hover:translate-x-2"
                  />
                </div>
                <p className="mt-2 max-w-md text-granite">{c.blurb[locale]}</p>
                <p className="mt-3 text-small font-semibold">
                  {t("common.from")} {format.money(from, currency)} {t("common.perNight")}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/apartments" className="group mt-12 inline-flex items-center gap-4 font-semibold">
        {t("home.seeAll")}
        <Icon
          name="arrowRight"
          size={24}
          strokeWidth={1.75}
          className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)] group-hover:translate-x-2"
        />
      </Link>
    </section>
  );
}
