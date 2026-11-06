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
          the left; on the right the arrow level with the name and the from-price ending on the
          location line (one grid, so both columns share rows). */}
      <div className="mt-5 grid grid-cols-[1fr_auto] gap-x-6 border-t-2 border-ink pt-4">
        {/* Sentence case at a calm size: the photo sells, the name labels it. */}
        <h3 className="card-title col-start-1 row-start-1">
          <Link
            href={{ pathname: "/apartments/[slug]", params: { slug: listing.slug }, query }}
            className="after:absolute after:inset-0"
          >
            {listing.title}
          </Link>
        </h3>
        <p className="col-start-1 row-start-2 mt-1 text-small">
          {t(`categories.${listing.category}`)} · {t("common.guests", { count: listing.accommodates })}
          {listing.areaSqm ? ` · ${t("common.area", { count: listing.areaSqm })}` : null}
        </p>
        <p className="col-start-1 row-start-3 mt-1.5 flex items-center gap-1.5 text-small text-granite">
          <Icon name="pin" size={14} strokeWidth={1.75} className="shrink-0" />
          {location}
        </p>
        <Icon
          name="arrowRight"
          size={32}
          strokeWidth={1.75}
          className="col-start-2 row-start-1 -my-1 shrink-0 self-center justify-self-end transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)] group-hover:translate-x-2"
        />
        <p className="col-start-2 row-span-2 row-start-2 self-end text-right text-small text-granite">
          <span className="block">{t("common.from")}</span>
          <span className="block">
            {format.money(listing.price.from.amount, listing.price.from.currency)} {t("common.perNight")}
          </span>
        </p>
      </div>
    </article>
  );
}
