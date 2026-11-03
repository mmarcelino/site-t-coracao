import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { collections } from "@/content/collections";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { WhatsAppLink } from "@/components/WhatsAppLink";
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
 * one line about it, then ways out as big rows like the menu's: all apartments (with the
 * collections as pills), the Porto team on WhatsApp, and home.
 */
export default async function NotFound() {
  const t = await getTranslations();
  const locale = (await getLocale()) as Locale;
  const row = "group flex items-center justify-between gap-6 py-5";

  return (
    <section className="container-page section-y-tight grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-10">
      <div className="lg:col-span-6">
        <p className="label text-granite">{t("notFound.label")}</p>
        <h1 className="mt-5 text-h1 max-w-2xl">{t("notFound.title")}</h1>
        <p className="mt-6 max-w-xl text-lead">{t("notFound.body")}</p>

        <h2 className="label mt-12 text-granite">{t("notFound.next")}</h2>
        <ul className="mt-4 border-b border-ink/15">
          <li className="border-t-2 border-ink">
            <Link href="/apartments" className={row}>
              <span>
                <span className="card-title block">{t("notFound.apartments")}</span>
                <span className="mt-1 block">{t("notFound.apartmentsSub")}</span>
              </span>
              {arrow}
            </Link>
            <ul className="flex flex-wrap gap-2 pb-6" aria-label={t("notFound.collections")}>
              {collections.filter((c) => c.featured).map((c) => (
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
          </li>
          <li className="border-t border-ink/15">
            <WhatsAppLink message={t("notFound.whatsappMessage")} page="404" icon={false} className={row}>
              <span>
                <span className="card-title block">{t("notFound.team")}</span>
                <span className="mt-1 block">{t("notFound.teamSub")}</span>
              </span>
              <Icon name="whatsapp" size={28} className="shrink-0" />
            </WhatsAppLink>
          </li>
          <li className="border-t border-ink/15">
            <Link href="/" className={row}>
              <span className="card-title">{t("notFound.home")}</span>
              {arrow}
            </Link>
          </li>
        </ul>
      </div>

      {/* A door that stays shut. Phones see a short crop; desktop a tall photo beside the text. */}
      <div className="relative -order-1 aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-limestone sm:aspect-[16/9] lg:order-none lg:col-span-5 lg:col-start-8 lg:aspect-[4/5]">
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
