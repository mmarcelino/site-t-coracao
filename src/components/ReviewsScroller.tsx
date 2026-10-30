"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * Horizontal scroller for review quotes, a page at a time (CSS scroll-snap does the paging; the
 * arrows just scroll by one view). Arrows only show when there is more to see.
 */
export function ReviewsScroller({
  children,
  prevLabel,
  nextLabel,
}: {
  children: ReactNode;
  prevLabel: string;
  nextLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [can, setCan] = useState({ prev: false, next: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setCan({ prev: el.scrollLeft > 4, next: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const go = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
  };

  const button =
    "grid size-12 place-items-center rounded-full bg-pop text-ink transition-opacity disabled:cursor-default disabled:opacity-30";

  return (
    <div>
      <div ref={ref} className="scrollbar-none snap-x snap-mandatory overflow-x-auto">
        {children}
      </div>
      {can.prev || can.next ? (
        <div className="mt-8 flex gap-3">
          <button type="button" onClick={() => go(-1)} disabled={!can.prev} aria-label={prevLabel} className={button}>
            <Icon name="arrowLeft" size={20} />
          </button>
          <button type="button" onClick={() => go(1)} disabled={!can.next} aria-label={nextLabel} className={button}>
            <Icon name="arrowRight" size={20} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
