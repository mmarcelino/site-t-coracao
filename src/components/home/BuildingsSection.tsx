import clsx from "clsx";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Building, Listing, Neighbourhood } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** Buildings as editorial cards: photo, history line, and the homes inside. */
export async function BuildingsSection({
  buildings,
  listings,
  neighbourhoods,
}: {
  buildings: Building[];
  listings: Listing[];
  neighbourhoods: Neighbourhood[];
}) {
  const t = await getTranslations("home");

  return (
    <section aria-labelledby="buildings-title" className="container-page section-y">
      <SectionHeader id="buildings-title" eyebrow={t("buildingsEyebrow")} title={t("buildingsTitle")} />

      <ul className="mt-[clamp(3rem,6vw,5rem)] grid gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-16 md:grid-cols-2">
        {buildings.map((building, i) => {
          const homes = listings.filter((l) => l.buildingId === building.id);
          const area = neighbourhoods.find((n) => n.slug === building.neighbourhoodSlug);
          return (
            <li key={building.id} className={clsx("reveal", i % 2 === 1 && "md:mt-28")}>
              <article className="group">
                <Link
                  href={{ pathname: "/buildings/[slug]", params: { slug: building.slug } }}
                  className="block"
                  aria-describedby={`building-${building.id}-line`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-limestone">
                    <Image
                      src={building.heroImage.src}
                      alt={building.heroImage.alt}
                      fill
                      sizes="(min-width: 768px) 48vw, 100vw"
                      className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-soft)] group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="label mt-6 text-granite">
                    {area?.name} · {t("buildingApartments", { count: homes.length })}
                  </p>
                  <h3 className="text-h2 mt-3">{building.name}</h3>
                </Link>
                <p id={`building-${building.id}-line`} className="text-lead mt-4 max-w-md text-granite">
                  {building.historyLine}
                </p>
                <ul className="text-small mt-5 flex flex-wrap gap-x-5 gap-y-2">
                  {homes.map((home) => (
                    <li key={home.id}>
                      <Link
                        href={{ pathname: "/apartments/[slug]", params: { slug: home.slug } }}
                        className="link-quiet"
                      >
                        {home.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
