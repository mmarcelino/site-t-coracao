import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Building, Listing, Neighbourhood } from "@/lib/data";
import { Icon } from "@/components/ui/Icon";

/**
 * Buildings as a giant typographic list (Numa's city list). Hover/focus a name to reveal its
 * photo (desktop); the first is shown by default. On small screens each name carries a thumbnail.
 */
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
      <h2 id="buildings-title" className="text-h2 reveal max-w-[16ch]">
        {t("buildingsTitle")}
      </h2>

      <ul className="building-list relative mt-[clamp(3rem,6vw,5rem)] lg:min-h-[36rem]">
        {buildings.map((building) => {
          const homes = listings.filter((l) => l.buildingId === building.id).length;
          const area = neighbourhoods.find((n) => n.slug === building.neighbourhoodSlug);
          return (
            <li key={building.id} className="group lg:w-[60%]">
              <Link
                href={{ pathname: "/buildings/[slug]", params: { slug: building.slug } }}
                className="flex items-center gap-4 py-2 transition-colors duration-[var(--duration-base)] hover:text-azulejo-bright focus-visible:text-azulejo-bright"
              >
                <span className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-[var(--radius-tile)] sm:w-20 lg:hidden">
                  <Image src={building.heroImage.src} alt="" fill sizes="80px" className="object-cover" />
                </span>
                <span className="min-w-0">
                  <span className="text-display flex items-center font-semibold">
                    <Icon
                      name="arrowUpRight"
                      size={64}
                      strokeWidth={2}
                      className="mr-1 hidden h-[0.7em] w-0 opacity-0 transition-all duration-[var(--duration-base)] group-hover:w-[0.7em] group-hover:opacity-100 group-focus-within:w-[0.7em] group-focus-within:opacity-100 lg:block"
                    />
                    {building.name}
                  </span>
                  <span className="label mt-1 block text-granite group-hover:text-azulejo-bright">
                    {area?.name} · {t("buildingApartments", { count: homes })}
                  </span>
                </span>
              </Link>
              {/* Desktop preview, revealed on hover/focus (CSS in globals.css) */}
              <div className="building-preview pointer-events-none absolute top-0 right-0 hidden aspect-[4/5] w-[34%] overflow-hidden rounded-[var(--radius-card)] lg:block">
                <Image src={building.heroImage.src} alt={building.heroImage.alt} fill sizes="34vw" className="object-cover" />
                <p className="absolute inset-x-0 bottom-0 bg-[linear-gradient(0deg,rgba(27,26,24,0.75),transparent)] p-6 pt-16 text-lead font-semibold text-paper">
                  {building.historyLine}
                </p>
              </div>
            </li>
          );
        })}
        <li className="lg:w-[60%]">
          <Link
            href="/apartments"
            className="text-display flex items-center gap-2 py-2 font-semibold transition-colors hover:text-azulejo-bright"
          >
            <Icon name="arrowUpRight" size={64} strokeWidth={2} className="h-[0.7em] w-[0.7em] shrink-0" />
            {t("allApartments")}
          </Link>
        </li>
      </ul>
    </section>
  );
}
