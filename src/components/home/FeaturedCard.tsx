"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icon";

export interface FeaturedItem {
  slug: string;
  title: string;
  place: string; // neighbourhood, e.g. "Foz do Douro"
  image: { src: string; alt: string };
  price: string; // formatted, e.g. "300 €"
  rating: string | null; // formatted, e.g. "9,9"
}

/**
 * Slim glass pill for the home shown in the hero background (same material and height as the
 * booking box). Content cross-fades when the slideshow moves on.
 */
export function FeaturedCard({ item }: { item: FeaturedItem }) {
  const t = useTranslations();
  return (
    <div className="on-dark flex h-[4.5rem] w-[26rem] items-center gap-3 rounded-full border border-white/30 bg-ink/55 p-2 pr-6 text-paper shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-limestone">
        <Image key={item.image.src} src={item.image.src} alt="" fill sizes="56px" className="animate-fade-in-fast object-cover" />
      </span>

      <div key={item.slug} className="animate-fade-in-fast min-w-0 flex-1" aria-live="polite">
        <p className="truncate text-[0.75rem] leading-tight text-paper/80">{item.place}</p>
        <p className="mt-1 truncate text-[0.9375rem] leading-tight font-medium">
          <Link href={{ pathname: "/apartments/[slug]", params: { slug: item.slug } }} className="hover:underline">
            {item.title}
          </Link>
        </p>
      </div>

      <div key={`${item.slug}-meta`} className="animate-fade-in-fast shrink-0 text-right">
        <p className="text-[0.9375rem] leading-tight font-medium whitespace-nowrap">
          {item.price}
          <span className="text-[0.75rem] font-normal text-paper/80"> {t("common.perNight")}</span>
        </p>
        {item.rating ? (
          <p className="mt-1 flex items-center justify-end gap-1 text-[0.75rem] leading-tight text-paper/85">
            <Icon name="star" size={11} fill="currentColor" strokeWidth={0} />
            <span aria-hidden>{item.rating}</span>
            <span className="sr-only">{t("home.featuredRating", { score: item.rating })}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
