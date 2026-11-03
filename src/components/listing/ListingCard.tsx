import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/Icon";
import { Link } from "@/i18n/navigation";
import type { Listing } from "@/lib/data";
import { createFormatter } from "@/lib/format";

/**
 * Photo-first listing card: the image does the selling, text stays small. Tag pills sit on the
 * photo, details sit under an ink rule as on the home collection cards; `query` carries search dates/guests through to the apartment page (widget prefill).
 */
export async function ListingCard({
  listing,
  location,
  query,
  sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw",
}: {
  listing: Listing;
  /** Neighbourhood name: what guests understand (building names mean nothing to them yet). */
  location: string;
  query?: Record<string, string>;
  sizes?: string;
}) {
  const t = await getTranslations();
  const format = createFormatter(await getLocale());
  const cover = listing.pictures[0];

  return (
    <article className="group reveal relative">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-limestone">
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-soft)] group-hover:scale-[1.03]"
          />
        ) : null}
        {listing.tags.length ? (
          <ul className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {listing.tags.slice(0, 3).map((tag) => (
              <li key={tag} className="rounded-full bg-white/95 px-2.5 py-1 text-[0.75rem] font-semibold text-ink">
                {t(`tags.${tag}`)}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {/* Same anatomy as the home collection cards: under an ink rule, the name and what it is on
          the left, the from-price stacked on the right above the arrow. */}
      <div className="mt-5 grid grid-cols-[1fr_auto] gap-x-6 border-t-2 border-ink pt-4">
        <div>
          {/* Sentence case at a calm size: the photo sells, the name labels it. */}
          <h3 className="card-title">
            <Link
              href={{ pathname: "/apartments/[slug]", params: { slug: listing.slug }, query }}
              className="after:absolute after:inset-0"
            >
              {listing.title}
            </Link>
          </h3>
          <p className="mt-2 text-granite">{location}</p>
          <p className="mt-1 text-small text-granite">
            {t(`categories.${listing.category}`)} · {t("common.guests", { count: listing.accommodates })} ·{" "}
            {t("common.area", { count: listing.areaSqm })}
          </p>
        </div>
        <div className="flex flex-col items-end justify-between gap-4 text-right">
          <p className="text-small">
            <span className="block text-granite">{t("common.from")}</span>
            <span className="block">
              {format.money(listing.price.base.amount, listing.price.base.currency)} {t("common.perNight")}
            </span>
          </p>
          <Icon
            name="arrowRight"
            size={32}
            strokeWidth={1.75}
            className="shrink-0 transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)] group-hover:translate-x-2"
          />
        </div>
      </div>
    </article>
  );
}
