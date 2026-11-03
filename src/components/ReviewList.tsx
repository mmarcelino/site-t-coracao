"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRef, useState, useTransition } from "react";
import { ReviewCard } from "@/components/ReviewCard";
import { requestReviews } from "@/lib/actions/reviews";
import type { Review } from "@/lib/data";

/**
 * Quotes in two columns. With a `total` (home page), "Show more reviews" loads the next four in
 * place and moves focus to the first new one, so keyboard and screen-reader users land on it.
 */
export function ReviewList({ initial, total }: { initial: Review[]; total?: number }) {
  const t = useTranslations("reviews");
  const locale = useLocale();
  const [reviews, setReviews] = useState(initial);
  const [pending, startTransition] = useTransition();
  const firstNew = useRef<string | null>(null);

  const more = () =>
    startTransition(async () => {
      const next = await requestReviews(locale, reviews.length);
      firstNew.current = next[0]?.id ?? null;
      setReviews((r) => [...r, ...next]);
    });

  return (
    <>
      <ul className="grid gap-x-8 gap-y-16 sm:grid-cols-2">
        {reviews.map((review) => (
          <li
            key={review.id}
            tabIndex={-1}
            ref={(el) => {
              if (el && firstNew.current === review.id) {
                firstNew.current = null;
                el.focus();
              }
            }}
            className="animate-fade-in-fast border-t-2 border-ink pt-6 outline-none"
          >
            <ReviewCard review={review} />
          </li>
        ))}
      </ul>
      {total !== undefined && reviews.length < total ? (
        <button
          type="button"
          onClick={more}
          disabled={pending}
          className="mt-14 inline-flex h-12 items-center rounded-full border border-ink px-6 font-semibold transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
        >
          {t("showMore")}
        </button>
      ) : null}
    </>
  );
}
