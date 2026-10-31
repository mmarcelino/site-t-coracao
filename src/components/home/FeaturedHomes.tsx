import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/Icon";
import { featuredHomes } from "@/content/showcase";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getBuildings, type Listing } from "@/lib/data";
import { createFormatter } from "@/lib/format";

/** A few specific homes, each with a wide shot and a detail, so the furnishing shows at a glance. */
export async function FeaturedHomes({ listings }: { listings: Listing[] }) {
  const t = await getTranslations();
  const locale = (await getLocale()) as Locale;
  const format = createFormatter(locale);
  const buildings = await getBuildings(locale);
  const homes = featuredHomes.flatMap((f) => {
    const listing = listings.find((l) => l.slug === f.slug);
    return listing ? [{ ...f, listing, building: buildings.find((b) => b.id === listing.buildingId) }] : [];
  });

  return (
    <section aria-labelledby="featured-title" className="container-page section-y pt-0">
      <h2 id="featured-title" className="text-h2 reveal">
        {t("home.featuredHomesTitle")}
      </h2>
      <ul className="mt-[clamp(2rem,4vw,3.5rem)] grid gap-x-6 gap-y-14 md:grid-cols-2">
        {homes.map(({ listing, building, wide, detail, detailAlt }) => (
          <li key={listing.id} className="reveal">
            <Link href={{ pathname: "/apartments/[slug]", params: { slug: listing.slug } }} className="group block">
              {/* Wide shot and detail side by side, one height (3:2 overall). */}
              <div className="grid aspect-[3/2] grid-cols-[3fr_2fr] gap-2">
                <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-limestone">
                  <Image
                    src={wide}
                    alt={listing.pictures[0]?.alt ?? listing.title}
                    fill
                    sizes="(min-width: 768px) 28vw, 60vw"
                    className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-soft)] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-limestone">
                  <Image src={detail} alt={detailAlt[locale]} fill sizes="(min-width: 768px) 19vw, 40vw" className="object-cover" />
                </div>
              </div>
              <div className="mt-5 border-t border-ink pt-4">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="label text-granite">{building?.name}</p>
                    <h3 className="mt-1.5 text-[1.375rem] leading-[1.15]">{listing.title}</h3>
                  </div>
                  <Icon
                    name="arrowRight"
                    size={32}
                    strokeWidth={1.75}
                    className="shrink-0 transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)] group-hover:translate-x-2"
                  />
                </div>
                <p className="mt-2 max-w-md text-granite">{listing.tagline}</p>
                <p className="mt-3 text-small font-semibold">
                  {t("common.from")} {format.money(listing.price.base.amount, listing.price.base.currency)} {t("common.perNight")}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
