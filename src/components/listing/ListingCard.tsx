import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Listing } from "@/lib/data";
import { createFormatter } from "@/lib/format";

/** Photo-first listing card: the image does the selling, text stays small. */
export async function ListingCard({
  listing,
  buildingName,
  sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw",
}: {
  listing: Listing;
  buildingName: string;
  sizes?: string;
}) {
  const t = await getTranslations();
  const format = createFormatter(await getLocale());
  const cover = listing.pictures[0];

  return (
    <article className="group reveal relative">
      <div className="relative aspect-[4/5] overflow-hidden bg-limestone">
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-soft)] group-hover:scale-[1.03]"
          />
        ) : null}
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="label text-granite">{buildingName}</p>
          <h3 className="text-h3 mt-2">
            <Link
              href={{ pathname: "/apartments/[slug]", params: { slug: listing.slug } }}
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
          <span className="font-medium">
            {format.money(listing.price.base.amount, listing.price.base.currency)}
          </span>
          <span className="block text-[0.75rem] text-granite">{t("common.perNight")}</span>
        </p>
      </div>
    </article>
  );
}
