import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { collections } from "@/content/collections";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { site } from "@/content/site";
import type { Listing } from "@/lib/data";
import { createFormatter } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";

/**
 * Opens with the collections heading and, beside it, who we are (CLAUDE.md §7.1, intro line): what
 * Tripas-Coração is and does, before anything is for sale. Then the featured collections, two per row: a wide room shot and a detail side by side, then under an ink
 * rule the title (arrow beside it) and a line about it, with the count and from-price ending level with it. Each opens the
 * apartments list filtered by tag.
 */
export async function Collections({ listings }: { listings: Listing[] }) {
  const t = await getTranslations();
  const locale = (await getLocale()) as Locale;
  const format = createFormatter(locale);
  const items = collections.flatMap((c) => {
    const homes = listings.filter((l) => l.tags.includes(c.tag));
    if (!c.featured || homes.length === 0) return [];
    const from = Math.min(...homes.map((l) => l.price.from.amount));
    return [{ c, count: homes.length, from, currency: homes[0]?.price.from.currency ?? "EUR" }];
  });

  return (
    <section aria-labelledby="collections-title" className="container-page section-y">
      {/* No ink rule: the hero's bottom edge closes the section above. The heading keeps its two
          lines (broken in the copy so it stays narrow; from lg, one line each) and who we are sits
          beside it, at the home review quotes' size (20px), their bottoms aligned, when there's room for a 23rem
          column; otherwise it drops below, on the right. */}
      <div className="flex flex-wrap items-end gap-x-16 gap-y-8">
        <h2 id="collections-title" className="text-h2 reveal">
          <span className="block lg:whitespace-nowrap">{t("home.collectionsTitleLine1")}</span>{" "}
          <span className="block lg:whitespace-nowrap">{t("home.collectionsTitleLine2")}</span>
        </h2>
        <div className="reveal max-w-xl flex-[1_1_23rem] space-y-5 text-[1.25rem] leading-[1.5] lg:ml-auto lg:max-w-[38rem]">
          <p>{t("home.introLead", { name: site.name })}</p>
          <p>{t("home.introBody", { year: String(site.foundedYear), guests: format.number(site.guestsPerYear) })}</p>
        </div>
      </div>
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
              {/* As on the listing cards: the arrow level with the title, the facts ending level
                  with the line about it. On phones the facts drop under that line, so it keeps the
                  full width. */}
              <div className="mt-5 grid grid-cols-[1fr_auto] gap-x-8 border-t-2 border-ink pt-4">
                <h3 className="card-title col-start-1 row-start-1">{c.title[locale]}</h3>
                <Icon
                  name="arrowRight"
                  size={32}
                  strokeWidth={1.75}
                  className="col-start-2 row-start-1 -my-1 shrink-0 self-center justify-self-end transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)] group-hover:translate-x-2"
                />
                <p className="col-span-2 row-start-2 mt-2 max-w-md sm:col-span-1">{c.blurb[locale]}</p>
                <p className="col-span-2 row-start-3 mt-4 text-small text-granite sm:col-span-1 sm:col-start-2 sm:row-start-2 sm:mt-0 sm:self-end sm:text-right">
                  <span className="block">{t("home.collectionCount", { count })}</span>
                  <span className="block">
                    {t("common.from")} {format.money(from, currency)} {t("common.perNight")}
                  </span>
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

