import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Listing } from "@/lib/data";
import { createFormatter } from "@/lib/format";

/**
 * Photo-first listing card: the image does the selling, text stays small. Tag pills sit on the
 * photo; `query` carries search dates/guests through to the apartment page (widget prefill).
 */
export async function ListingCard({
  listing,
  buildingName,
  query,
  sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw",
}: {
  listing: Listing;
  buildingName: string;
  query?: Record<string, string>;
  sizes?: string;
}) {
  const t = await getTranslations();
  const format = createFormatter(await getLocale());
  const cover = listing.pictures[0];

  return (
    <article className="group reveal relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-limestone">
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
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="label text-granite">{buildingName}</p>
          <h3 className="text-h3 mt-2 font-semibold">
            <Link
              href={{ pathname: "/apartments/[slug]", params: { slug: listing.slug }, query }}
              className="after:absolute after:inset-0"
            >
              {listing.title}
            </Link>
          </h3>
          <p className="text-small mt-2 text-granite">
            {t(`categories.${listing.category}`)} · {t("common.guests", { count: listing.accommodates })} ·{" "}
            {t("common.area", { count: listing.areaSqm })}
          </p>
        </div>
        <p className="shrink-0 pt-6 text-right">
          <span className="block text-[0.75rem] text-granite">{t("common.from")}</span>
          <span className="font-semibold">
            {format.money(listing.price.base.amount, listing.price.base.currency)}
          </span>
          <span className="block text-[0.75rem] text-granite">{t("common.perNight")}</span>
        </p>
      </div>
    </article>
  );
}
