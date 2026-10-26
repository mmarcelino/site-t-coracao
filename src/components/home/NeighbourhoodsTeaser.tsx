import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Neighbourhood } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";

export async function NeighbourhoodsTeaser({ neighbourhoods }: { neighbourhoods: Neighbourhood[] }) {
  const t = await getTranslations("home");
  return (
    <section aria-labelledby="neighbourhoods-title" className="bg-sand">
      <div className="container-page section-y">
        <SectionHeader
          id="neighbourhoods-title"
          eyebrow={t("neighbourhoodsEyebrow")}
          title={t("neighbourhoodsTitle")}
          align="split"
        >
          <p>{t("neighbourhoodsBody")}</p>
        </SectionHeader>

        <ul className="mt-[clamp(3rem,6vw,5rem)] grid gap-12 md:grid-cols-3 md:gap-8">
          {neighbourhoods.map((n) => (
            <li key={n.slug} className="reveal">
              <article className="group relative">
                <div className="relative aspect-[3/2] overflow-hidden bg-limestone">
                  <Image
                    src={n.image.src}
                    alt={n.image.alt}
                    fill
                    sizes="(min-width: 768px) 31vw, 100vw"
                    className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-soft)] group-hover:scale-[1.03]"
                  />
                </div>
                <h3 className="text-h3 mt-6">
                  <Link
                    href={{ pathname: "/neighbourhoods/[slug]", params: { slug: n.slug } }}
                    className="after:absolute after:inset-0"
                  >
                    {n.name}
                  </Link>
                </h3>
                <p className="mt-3 text-ink/80">{n.tagline}</p>
                <ul className="text-small mt-5 space-y-1.5 border-t border-ink/15 pt-4 text-ink/80">
                  {n.nearby.slice(0, 3).map((place) => (
                    <li key={place}>{place}</li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
