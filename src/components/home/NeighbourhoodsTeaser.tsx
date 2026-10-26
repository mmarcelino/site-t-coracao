import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Neighbourhood } from "@/lib/data";
import { Icon } from "@/components/ui/Icon";

/** Neighbourhoods as tall photo cards with a pill tag (Numa's "stories" cards). */
export async function NeighbourhoodsTeaser({ neighbourhoods }: { neighbourhoods: Neighbourhood[] }) {
  const t = await getTranslations("home");
  return (
    <section aria-labelledby="neighbourhoods-title" className="container-page section-y">
      <div className="reveal grid gap-6 lg:grid-cols-12 lg:items-end">
        <h2 id="neighbourhoods-title" className="text-h1 lg:col-span-7">
          {t("neighbourhoodsTitle")}
        </h2>
        <p className="text-lead text-granite lg:col-span-5">{t("neighbourhoodsBody")}</p>
      </div>

      <ul className="mt-[clamp(3rem,6vw,5rem)] grid gap-5 md:grid-cols-3">
        {neighbourhoods.map((n) => (
          <li key={n.slug} className="reveal">
            <article className="group relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] bg-ink text-paper">
              <Image
                src={n.image.src}
                alt={n.image.alt}
                fill
                sizes="(min-width: 768px) 31vw, 100vw"
                className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-soft)] group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,26,24,0)_35%,rgba(27,26,24,0.85)_100%)]" />
              <p className="absolute top-4 left-4 rounded-full bg-wash px-3 py-1.5 text-[0.8125rem] font-semibold text-ink">
                {t("neighbourhoodTag")}
              </p>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="text-[clamp(1.75rem,1.1rem+1.6vw,2.75rem)] leading-[1.02] tracking-[-0.035em]">
                  <Link
                    href={{ pathname: "/neighbourhoods/[slug]", params: { slug: n.slug } }}
                    className="after:absolute after:inset-0"
                  >
                    {n.name}
                  </Link>
                </h3>
                <p className="mt-3 flex items-start gap-2 text-paper/90">
                  <Icon name="arrowUpRight" size={20} className="mt-0.5 shrink-0" />
                  {n.tagline}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
