"use client";

import clsx from "clsx";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * Horizontal carousel, a page at a time (CSS scroll-snap does the paging; the arrows scroll by one
 * view). Phones swipe; from md up it moves only with the arrows, so a sideways drift of the trackpad
 * while scrolling the page never slides it. Arrows only show when there is more to see.
 */
export function Carousel({
  children,
  prevLabel,
  nextLabel,
  scrollClassName,
  controlsClassName,
}: {
  children: ReactNode;
  prevLabel: string;
  nextLabel: string;
  /** Extra classes for the scrolling element (e.g. padding so it can bleed to the screen edge). */
  scrollClassName?: string;
  /** Extra classes for the arrows row (e.g. a container to align it with the page margins). */
  controlsClassName?: string;
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
      <div ref={ref} className={clsx("scrollbar-none snap-x snap-mandatory overflow-x-auto md:overflow-x-hidden", scrollClassName)}>
        {children}
      </div>
      {can.prev || can.next ? (
        <div className={clsx("mt-8 flex gap-3", controlsClassName)}>
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
