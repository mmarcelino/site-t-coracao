"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icon";

export interface HeroReview {
  quote: string;
  lang: string;
  author: string;
  source: string; // "Google", "Airbnb", "Booking.com"
  score: string; // source-native, e.g. "5/5", "10/10"
  mock: boolean;
  home: { slug: string; title: string };
}

/**
 * Guest review for the home shown in the hero background, in the same glass as the booking box.
 * The home's name links to it (the background already shows its photo). Content cross-fades
 * when the slideshow moves on.
 */
export function ReviewCard({ review }: { review: HeroReview }) {
  const t = useTranslations();
  return (
    <figure className="on-dark w-[26rem] shrink-0 rounded-[1.75rem] border border-white/30 hero-glass px-6 py-4 text-paper shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      <div key={review.home.slug} className="animate-fade-in-fast" aria-live="polite">
        <blockquote lang={review.lang} className="line-clamp-2 text-[0.9375rem] leading-snug">
          “{review.quote}”
        </blockquote>
        <figcaption className="mt-2 flex items-center gap-2 text-[0.75rem] text-paper/80">
          <span className="flex items-center gap-1 font-medium text-paper">
            <Icon name="star" size={11} fill="currentColor" strokeWidth={0} />
            {review.score}
          </span>
          <span aria-hidden>·</span>
          <span className="truncate">
            {review.author}, {review.source} ·{" "}
            <Link
              href={{ pathname: "/apartments/[slug]", params: { slug: review.home.slug } }}
              className="underline decoration-white/40 underline-offset-2 hover:decoration-white"
            >
              {review.home.title}
            </Link>
          </span>
          {review.mock ? <span className="sr-only">({t("common.demo")})</span> : null}
        </figcaption>
      </div>
    </figure>
  );
}
