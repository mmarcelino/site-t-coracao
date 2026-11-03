import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { collections } from "@/content/collections";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Icon } from "@/components/ui/Icon";

const arrow = (
  <Icon
    name="arrowRight"
    size={28}
    strokeWidth={1.75}
    className="shrink-0 transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)] group-hover:translate-x-2"
  />
);

/**
 * Localized not-found page (also shown for routes not built yet). No error number: a closed door,
 * one line about it, then the way out: all apartments as a big row (with the collections as
 * pills), and a quiet link home. The whole page fits the first screen under the header: on phones
 * the photo takes whatever height the text leaves; on desktop it fills the column beside it.
 */
export default async function NotFound() {
  const t = await getTranslations();
  const locale = (await getLocale()) as Locale;
  const row = "group flex items-center justify-between gap-6 py-4";

  return (
    <section className="container-page flex min-h-[calc(100svh-var(--header-h))] flex-col gap-6 py-[var(--gutter)] sm:gap-8 lg:grid lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-7 lg:self-center xl:col-span-6">
        <p className="label text-granite">{t("notFound.label")}</p>
        <h1 className="mt-4 text-h1 max-w-2xl">{t("notFound.title")}</h1>
        <p className="mt-4 max-w-xl text-lead sm:mt-5">{t("notFound.body")}</p>

        <h2 className="label mt-6 text-granite sm:mt-8 xl:mt-10">{t("notFound.next")}</h2>
        <div className="mt-4 border-t-2 border-ink">
          <Link href="/apartments" className={row}>
            <span>
              <span className="card-title block">{t("notFound.apartments")}</span>
              <span className="mt-1 hidden sm:block">{t("notFound.apartmentsSub")}</span>
            </span>
            {arrow}
          </Link>
          <ul className="flex flex-wrap gap-2" aria-label={t("notFound.collections")}>
            {collections.filter((c) => c.featured).slice(0, 4).map((c) => (
              <li key={c.tag}>
                <Link
                  href={{ pathname: "/apartments", query: { tag: c.tag } }}
                  className="inline-flex h-10 items-center rounded-full border border-ink/20 px-4 text-[0.9375rem] font-semibold whitespace-nowrap transition-colors hover:border-ink"
                >
                  {c.title[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Home is the fallback, so a quiet link (like "See all" on the home page), not a row. */}
        <Link href="/" className="group mt-8 inline-flex items-center gap-3 font-semibold">
          {t("notFound.home")}
          <Icon
            name="arrowRight"
            size={20}
            strokeWidth={1.75}
            className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)] group-hover:translate-x-1.5"
          />
        </Link>
      </div>

      {/* A door that stays shut: above the text on phones (filling the height left; short phones
          leave it out), a tall photo beside it on desktop. */}
      <div className="relative -order-1 min-h-28 flex-1 [@media(max-height:740px)]:max-lg:hidden overflow-hidden rounded-[var(--radius-card)] bg-limestone lg:order-none lg:col-span-5 lg:col-start-8">
        <Image
          src="/images/placeholder/mouzinho-rooftop-e-03.jpg"
          alt={t("notFound.imageAlt")}
          fill
          priority
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
