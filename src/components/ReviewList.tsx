"use client";

import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState, useTransition } from "react";
import { ReviewCard } from "@/components/ReviewCard";
import { requestReviews } from "@/lib/actions/reviews";
import type { Review } from "@/lib/data";

/**
 * Quotes in two columns, each under an ink rule (home). With `listingId` (apartment pages): one
 * apartment's reviews, three columns, no rules, body-size quotes, three at a time. With a `total`,
 * "Show more reviews" loads the next page in place and moves focus to the first new one, so keyboard and screen-reader users land on it.
 * "Show fewer" folds back to the first page and returns to the top of the list; reviews already
 * loaded are kept, so opening again doesn't refetch.
 */
export function ReviewList({ initial, total, listingId }: { initial: Review[]; total?: number; listingId?: string }) {
  const t = useTranslations("reviews");
  const locale = useLocale();
  const [loaded, setLoaded] = useState(initial);
  const [shown, setShown] = useState(initial.length);
  const [pending, startTransition] = useTransition();
  const focusId = useRef<string | null>(null);
  const list = useRef<HTMLUListElement>(null);

  const more = () => {
    const next = shown + (listingId ? 3 : 4);
    if (loaded.length >= next || loaded.length === total) {
      focusId.current = loaded[shown]?.id ?? null;
      setShown(Math.min(next, loaded.length));
      return;
    }
    startTransition(async () => {
      const page = await requestReviews(locale, loaded.length, listingId);
      focusId.current = page[0]?.id ?? null;
      setLoaded((r) => [...r, ...page]);
      setShown(loaded.length + page.length);
    });
  };

  const fewer = () => {
    setShown(initial.length);
    const first = list.current?.querySelector("li");
    first?.focus({ preventScroll: true });
    list.current?.scrollIntoView({ block: "start" });
  };

  return (
    <>
      {/* scroll-mt clears the booking bar that docks at the top of the home page. */}
      <ul
        ref={list}
        className={clsx("grid scroll-mt-32 gap-x-8 sm:grid-cols-2", listingId ? "gap-y-12 lg:grid-cols-3" : "gap-y-16")}
      >
        {loaded.slice(0, shown).map((review) => (
          <li
            key={review.id}
            tabIndex={-1}
            ref={(el) => {
              if (el && focusId.current === review.id) {
                focusId.current = null;
                el.focus();
              }
            }}
            className={clsx("animate-fade-in-fast outline-none", !listingId && "border-t-2 border-ink pt-6")}
          >
            <ReviewCard review={review} size={listingId ? "md" : "lg"} />
          </li>
        ))}
      </ul>
      {total !== undefined && total > initial.length ? (
        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4">
          {shown < total ? (
            <button
              type="button"
              onClick={more}
              disabled={pending}
              className="inline-flex h-12 items-center rounded-full border border-ink px-6 font-semibold transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
            >
              {t("showMore")}
            </button>
          ) : null}
          {shown > initial.length ? (
            <button type="button" onClick={fewer} className="link-quiet h-12 font-semibold">
              {t("showFewer")}
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
