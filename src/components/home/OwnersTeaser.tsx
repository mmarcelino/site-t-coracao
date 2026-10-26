import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { ownerServices } from "@/content/owners";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/**
 * Owners teaser in the manner of Numa's members block: dark photo, headline in the signature
 * colour, and the six services as tiles.
 */
export async function OwnersTeaser() {
  const t = await getTranslations("home");
  const locale = (await getLocale()) as Locale;
  return (
    <section aria-labelledby="owners-title" className="on-dark relative overflow-hidden bg-ink text-paper">
      {/* Original granite wall at Cordoaria: the "heritage asset" in one image. Decorative. */}
      <Image src="/images/placeholder/cordoaria-mezzanine-05.jpg" alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,26,24,0.82)_0%,rgba(27,26,24,0.6)_100%)]" />
      <div className="container-page section-y relative">
        <div className="reveal max-w-4xl">
          <p className="label mb-5 text-paper/80">{t("ownersEyebrow")}</p>
          <h2 id="owners-title" className="text-h1 text-wash">
            {t("ownersTitle")}
          </h2>
          <p className="text-lead mt-8 max-w-xl text-paper/90">{t("ownersBody")}</p>
          <div className="mt-8">
            <Link href="/property-management" className={buttonClasses("light", "md")}>
              <Icon name="arrowUpRight" size={18} />
              {t("ownersCta")}
            </Link>
          </div>
        </div>

        <h3 className="sr-only">{t("ownersServices")}</h3>
        <ol className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ownerServices.map((service, i) => (
            <li key={service.id} className="reveal rounded-[var(--radius-tile)] bg-wash p-6 text-ink">
              <p className="text-[0.8125rem] font-semibold text-azulejo">{String(i + 1).padStart(2, "0")}</p>
              <p className="text-h3 mt-6 font-semibold">{service.title[locale]}</p>
              <p className="text-small mt-2 text-ink-soft-text">{service.body[locale]}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
