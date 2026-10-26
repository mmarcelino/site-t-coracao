import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { collections } from "@/content/collections";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Listing } from "@/lib/data";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/**
 * Featured collections as a giant typographic list (Numa's city list): hover/focus a name to
 * reveal its photo on desktop; thumbnails on small screens. Each links to the filtered list.
 */
export async function Collections({ listings }: { listings: Listing[] }) {
  const t = await getTranslations("home");
  const locale = (await getLocale()) as Locale;
  const featured = collections.filter((c) => c.featured);

  return (
    <section aria-labelledby="collections-title" className="container-page section-y pt-0">
      <h2 id="collections-title" className="text-h2 reveal">
        {t("collectionsTitle")}
      </h2>

      <ul className="hover-list relative mt-[clamp(2.5rem,5vw,4rem)] lg:min-h-[34rem]">
        {featured.map((c) => {
          const count = listings.filter((l) => l.tags.includes(c.tag)).length;
          return (
            <li key={c.tag} className="group lg:w-[60%]">
              <Link
                href={{ pathname: "/apartments", query: { tag: c.tag } }}
                className="flex items-center gap-4 py-2 transition-colors duration-[var(--duration-base)] hover:text-azulejo-bright focus-visible:text-azulejo-bright"
              >
                <span className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-[var(--radius-tile)] sm:w-20 lg:hidden">
                  <Image src={c.image.src} alt="" fill sizes="80px" className="object-cover" />
                </span>
                <span className="min-w-0">
                  <span className="text-display flex items-center font-semibold">
                    <Icon
                      name="arrowUpRight"
                      size={64}
                      strokeWidth={2}
                      className="mr-1 hidden h-[0.7em] w-0 opacity-0 transition-all duration-[var(--duration-base)] group-hover:w-[0.7em] group-hover:opacity-100 group-focus-within:w-[0.7em] group-focus-within:opacity-100 lg:block"
                    />
                    {c.title[locale]}
                  </span>
                  <span className="text-small mt-1 block text-granite group-hover:text-azulejo-bright">
                    <span className="font-semibold">{t("collectionCount", { count })}</span> · {c.blurb[locale]}
                  </span>
                </span>
              </Link>
              {/* Desktop preview, revealed on hover/focus (CSS in globals.css) */}
              <div className="hover-preview pointer-events-none absolute top-0 right-0 hidden aspect-[4/5] w-[34%] overflow-hidden rounded-[var(--radius-card)] lg:block">
                <Image src={c.image.src} alt={c.image.alt[locale]} fill sizes="34vw" className="object-cover" />
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-10">
        <Link href="/apartments" className={buttonClasses("primary", "lg")}>
          <Icon name="arrowUpRight" size={18} />
          {t("seeAll")}
        </Link>
      </div>
    </section>
  );
}
