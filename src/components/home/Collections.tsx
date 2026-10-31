import clsx from "clsx";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { collections, type Collection } from "@/content/collections";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Icon } from "@/components/ui/Icon";

/**
 * Featured collections as a bento grid: one tall photo, two stacked photos, a wide split tile
 * (colour + photo) and a dark "see all" tile. Same content model, varied treatments.
 * Desktop: 12 columns × 3 rows. Mobile: one column.
 */
export async function Collections() {
  const t = await getTranslations("home");
  const locale = (await getLocale()) as Locale;
  const featured = collections.filter((c) => c.featured);
  const [tall, topRight, bottomRight, wide] = featured;
  const href = (c: Collection) => ({ pathname: "/apartments" as const, query: { tag: c.tag } });

  /** Photo tile with text over a gradient (used three times, in different sizes). */
  const photoTile = (c: Collection, className: string, sizes: string, titleClass: string) => (
    <li className={clsx("reveal", className)}>
      <Link
        href={href(c)}
        className="group relative isolate block h-full min-h-[18rem] overflow-hidden rounded-[var(--radius-card)] text-paper lg:min-h-0"
      >
        <Image
          src={c.image.src}
          alt={c.image.alt[locale]}
          fill
          sizes={sizes}
          className="reveal-clip object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-soft)] group-hover:scale-[1.04]"
        />
        <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,26,24,0)_40%,rgba(27,26,24,0.75)_100%)]" />
        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
          <span>
            <span className={clsx("block font-semibold", titleClass)}>{c.title[locale]}</span>
          </span>
          <Icon name="arrowRight" size={32} strokeWidth={1.75} className="shrink-0 transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)] group-hover:translate-x-2" />
        </span>
      </Link>
    </li>
  );

  return (
    <section aria-labelledby="collections-title" className="container-page section-y pt-0">
      <h2 id="collections-title" className="text-h2 reveal">
        {t("collectionsTitle")}
      </h2>

      <ul className="mt-[clamp(2rem,4vw,3.5rem)] grid grid-cols-1 gap-3 lg:grid-cols-12 lg:grid-rows-[17rem_17rem_16rem] lg:gap-4">
        {tall ? photoTile(tall, "aspect-[4/5] lg:col-span-7 lg:row-span-2 lg:aspect-auto", "(min-width: 1024px) 58vw, 100vw", "text-h1") : null}
        {topRight ? photoTile(topRight, "aspect-[16/10] lg:col-span-5 lg:aspect-auto", "(min-width: 1024px) 40vw, 100vw", "text-h3") : null}
        {bottomRight ? photoTile(bottomRight, "aspect-[16/10] lg:col-span-5 lg:aspect-auto", "(min-width: 1024px) 40vw, 100vw", "text-h3") : null}

        {wide ? (
          <li className="reveal lg:col-span-8">
            <Link
              href={href(wide)}
              className="group grid h-full overflow-hidden rounded-[var(--radius-card)] sm:grid-cols-[1.15fr_1fr]"
            >
              {/* Outline on the copy only; the photo runs to the card's edge like the tiles above. */}
              <span className="flex flex-col justify-end gap-6 rounded-t-[var(--radius-card)] border-2 border-b-0 border-ink p-6 sm:rounded-tr-none sm:rounded-l-[var(--radius-card)] sm:border-r-0 sm:border-b-2 md:p-8">
                <span>
                  <span className="block text-[clamp(1.75rem,1.1rem+1.8vw,2.75rem)] leading-[1.02] font-semibold tracking-[-0.035em]">
                    {wide.title[locale]}
                  </span>
                </span>
              </span>
              <span className="relative min-h-56 overflow-hidden">
                <Image
                  src={wide.image.src}
                  alt={wide.image.alt[locale]}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="reveal-clip object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-soft)] group-hover:scale-[1.04]"
                />
              </span>
            </Link>
          </li>
        ) : null}

        <li className="reveal lg:col-span-4">
          <Link
            href="/apartments"
            className="group on-dark flex h-full min-h-44 flex-col justify-end rounded-[var(--radius-card)] bg-ink p-6 text-paper md:p-8"
          >
            {/* Same "see all" treatment as the experiences strip: a large bare arrow above the label. */}
            <Icon
              name="arrowRight"
              size={32}
              strokeWidth={1.75}
              className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)] group-hover:translate-x-2"
            />
            <span className="text-h3 mt-4 block font-semibold">{t("seeAll")}</span>
          </Link>
        </li>
      </ul>
    </section>
  );
}
