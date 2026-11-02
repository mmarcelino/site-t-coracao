"use client";

import clsx from "clsx";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Picture } from "@/lib/data/types";
import { Icon } from "@/components/ui/Icon";

/**
 * Listing gallery. Desktop: editorial mosaic (one large + four). Mobile: full-bleed swipe strip.
 * Both open a keyboard-navigable lightbox (←/→, Esc; focus returns to the trigger).
 */
export function Gallery({ pictures, title }: { pictures: Picture[]; title: string }) {
  const t = useTranslations("listing");
  const tc = useTranslations("common");
  const [index, setIndex] = useState<number | null>(null);
  const [stripIndex, setStripIndex] = useState(0);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const total = pictures.length;

  const open = (i: number, trigger: HTMLElement) => {
    lastTrigger.current = trigger;
    setIndex(i);
  };
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback((delta: number) => setIndex((i) => (i === null ? i : (i + delta + total) % total)), [total]);

  const isOpen = index !== null;
  useEffect(() => {
    if (!isOpen) return;
    const trigger = lastTrigger.current;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [isOpen, close, step]);

  const mosaic = pictures.slice(0, 5);
  const current = index !== null ? pictures[index] : null;

  return (
    <section aria-label={t("galleryLabel")}>
      {/* Mobile / tablet: swipe strip */}
      <div className="relative md:hidden">
        <ul
          className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto"
          onScroll={(e) => {
            const el = e.currentTarget;
            setStripIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
        >
          {pictures.map((pic, i) => (
            <li key={pic.src} className="relative aspect-[4/3] w-full shrink-0 snap-center">
              <button type="button" className="absolute inset-0" onClick={(e) => open(i, e.currentTarget)}>
                <Image
                  src={pic.src}
                  alt={pic.alt}
                  fill
                  // Hidden from md up: tell the browser so desktops don't fetch full-width copies.
                  sizes="(min-width: 768px) 1px, 100vw"
                  priority={i === 0}
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
        <p className="label absolute right-4 bottom-4 bg-ink/70 px-2.5 py-1.5 text-paper tabular-nums" aria-hidden>
          {stripIndex + 1} / {total}
        </p>
      </div>

      {/* Desktop: mosaic */}
      <div className="container-page hidden md:block">
        <div className="relative grid h-[min(72vh,44rem)] grid-cols-4 grid-rows-2 gap-2">
          {mosaic.map((pic, i) => (
            <button
              key={pic.src}
              type="button"
              onClick={(e) => open(i, e.currentTarget)}
              className={clsx(
                "group relative overflow-hidden rounded-[var(--radius-tile)] bg-limestone",
                i === 0 && "col-span-2 row-span-2",
              )}
            >
              <Image
                src={pic.src}
                alt={pic.alt}
                fill
                priority={i === 0}
                // Hidden below md: tiny hint there so phones don't download the mosaic too.
                sizes={i === 0 ? "(min-width: 768px) 50vw, 1px" : "(min-width: 768px) 25vw, 1px"}
                className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-soft)] group-hover:scale-[1.03]"
              />
            </button>
          ))}
          <button
            type="button"
            onClick={(e) => open(0, e.currentTarget)}
            className="text-small absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2.5 font-semibold text-ink shadow-sm transition-colors hover:bg-white"
            data-testid="gallery-all"
          >
            <Icon name="grid" size={16} />
            {t("showAllPhotos", { count: total })}
          </button>
        </div>
      </div>

      {current && index !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title}: ${t("photos")}`}
          className="on-dark animate-fade-in-fast fixed inset-0 z-[70] flex flex-col bg-ink text-paper"
          data-testid="lightbox"
        >
          <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between px-[var(--gutter)]">
            <p className="label tabular-nums" aria-live="polite">
              {t("photoOf", { current: index + 1, total })}
            </p>
            <button ref={closeRef} type="button" onClick={close} className="-mr-2 p-2">
              <Icon name="close" size={26} />
              <span className="sr-only">{tc("close")}</span>
            </button>
          </div>
          <div className="relative min-h-0 flex-1">
            <Image key={current.src} src={current.src} alt={current.alt} fill sizes="100vw" className="animate-fade-in object-contain" />
          </div>
          <div className="flex shrink-0 items-center justify-between gap-6 px-[var(--gutter)] py-5">
            <button type="button" onClick={() => step(-1)} className="inline-flex items-center gap-2 p-2">
              <Icon name="arrowLeft" size={22} />
              <span className="text-small">{t("previous")}</span>
            </button>
            <p className="text-small hidden text-center text-paper/70 sm:block">{current.alt}</p>
            <button type="button" onClick={() => step(1)} className="inline-flex items-center gap-2 p-2">
              <span className="text-small">{t("next")}</span>
              <Icon name="arrowRight" size={22} />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
