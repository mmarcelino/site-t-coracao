"use client";

import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState, useTransition } from "react";
import { ReviewCard } from "@/components/ReviewCard";
import { Icon } from "@/components/ui/Icon";
import { requestReviews } from "@/lib/actions/reviews";
import type { Review } from "@/lib/data";

/**
 * Quotes in two columns, each under an ink rule (home). With `listingId` (apartment pages): one
 * apartment's reviews, three columns, no rules, body-size quotes, three at a time. With a `total`,
 * "Show more reviews" loads the next page in place and moves focus to the first new one, so keyboard and screen-reader users land on it.
 * "Show fewer" folds back to the first page and returns to the top of the list; reviews already
 * loaded are kept, so opening again doesn't refetch.
 */
const moreLink = "group inline-flex items-center gap-4 font-semibold disabled:opacity-50";
const arrowMotion = "transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)]";

export function ReviewList({
  initial,
  total,
  listingId,
  placement,
}: {
  initial: Review[];
  total?: number;
  listingId?: string;
  /**
   * Classes for the first page of quotes and for what follows (more quotes, the links). Returned as
   * siblings, so a parent grid can place them apart, e.g. keep its side column level with the first page only.
   */
  placement?: { first?: string; rest?: string };
}) {
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

  const grid = clsx("grid gap-x-8 sm:grid-cols-2", listingId ? "gap-y-12 lg:grid-cols-3" : "gap-y-16");
  const item = (review: Review) => (
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
  );

  return (
    <>
      {/* The first page, then the ones loaded on request in a list of their own (same grid, same
          spacing) so a parent can line things up with the first page alone. scroll-mt clears the
          booking bar that docks at the top of the home page. */}
      <ul ref={list} className={clsx(grid, "scroll-mt-32", placement?.first)}>
        {loaded.slice(0, initial.length).map(item)}
      </ul>
      {shown > initial.length ? (
        <ul className={clsx(grid, listingId ? "mt-12" : "mt-16", placement?.rest)}>
          {loaded.slice(initial.length, shown).map(item)}
        </ul>
      ) : null}
      {total !== undefined && total > initial.length ? (
        // Same text-and-arrow link as "See all apartments"; the arrow nudges the way it goes.
        <div className={clsx("mt-12 flex flex-wrap items-center gap-x-10 gap-y-4", placement?.rest)}>
          {shown < total ? (
            <button type="button" onClick={more} disabled={pending} className={moreLink}>
              {t("showMore")}
              <Icon name="arrowDown" size={24} strokeWidth={1.75} className={`${arrowMotion} group-hover:translate-y-1`} />
            </button>
          ) : null}
          {shown > initial.length ? (
            <button type="button" onClick={fewer} className={moreLink}>
              {t("showFewer")}
              <Icon name="arrowUp" size={24} strokeWidth={1.75} className={`${arrowMotion} group-hover:-translate-y-1`} />
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
