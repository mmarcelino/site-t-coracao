"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icon";

export interface FeaturedItem {
  slug: string;
  title: string;
  place: string; // "Building · Neighbourhood"
  image: { src: string; alt: string };
  price: string; // formatted, e.g. "300 €"
  rating: string | null; // formatted, e.g. "9,9"
}

const DURATION_MS = 6000;

/**
 * Hero "featured homes": a slim glass pill in the same material and height as the booking box.
 * Rotates through a few top-rated homes with a hairline progress bar. Pauses on hover/focus, has
 * an explicit pause button (WCAG 2.2.2), and starts paused for reduced motion.
 */
export function FeaturedCard({ items }: { items: FeaturedItem[] }) {
  const t = useTranslations();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    // Respect reduced motion: start paused (user can still press play). External-preference sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);

  const running = !paused && !hovered && items.length > 1;

  // A timer drives rotation (the bar is only visual), so pausing mid-way resumes where it left off.
  const elapsed = useRef(0);
  useEffect(() => {
    elapsed.current = 0;
  }, [index]);
  useEffect(() => {
    if (!running) return;
    const startedAt = performance.now();
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % items.length), DURATION_MS - elapsed.current);
    return () => {
      window.clearTimeout(id);
      elapsed.current += performance.now() - startedAt;
    };
  }, [running, index, items.length]);

  const item = items[index];
  if (!item) return null;

  return (
    <div
      className="on-dark relative flex h-[4.5rem] w-[24rem] items-center gap-3 overflow-hidden rounded-full border border-white/30 bg-ink/55 p-2 pr-3 text-paper shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] backdrop-blur-xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label={t("home.featuredLabel")}
    >
      <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-limestone">
        <Image key={item.image.src} src={item.image.src} alt="" fill sizes="56px" className="animate-fade-in-fast object-cover" />
      </span>

      <div key={item.slug} className="animate-fade-in-fast min-w-0 flex-1">
        <p className="text-[0.75rem] leading-tight text-paper/80">
          {t("home.featuredLabel")} · {item.place}
        </p>
        <p className="mt-1 truncate text-[0.9375rem] leading-tight font-medium">
          <Link href={{ pathname: "/apartments/[slug]", params: { slug: item.slug } }} className="hover:underline">
            {item.title}
          </Link>
          <span className="font-normal text-paper/80">
            {" "}
            · {item.price} {t("common.perNight")}
          </span>
        </p>
      </div>

      {item.rating ? (
        <p className="flex shrink-0 items-center gap-1 text-[0.8125rem] font-medium">
          <Icon name="star" size={12} fill="currentColor" strokeWidth={0} />
          <span aria-hidden>{item.rating}</span>
          <span className="sr-only">{t("home.featuredRating", { score: item.rating })}</span>
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        className="grid size-8 shrink-0 place-items-center rounded-full border border-white/30 transition-colors hover:bg-white/15"
        aria-label={paused ? t("home.featuredPlay") : t("home.featuredPause")}
      >
        <Icon name={paused ? "play" : "pause"} size={12} strokeWidth={1.75} />
      </button>

      {/* Hairline progress along the bottom edge; segments are buttons to jump to a home. */}
      <div className="absolute inset-x-8 bottom-1.5 flex gap-1">
        {items.map((it, i) => (
          <button
            key={it.slug}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={t("home.featuredShow", { n: i + 1, total: items.length })}
            aria-current={i === index ? "true" : undefined}
            className="relative h-2 flex-1"
          >
            <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 overflow-hidden bg-white/25">
              <span
                key={i === index ? `active-${index}` : `idle-${i}`}
                className={`block h-full origin-left bg-white ${i < index ? "scale-x-100" : i > index ? "scale-x-0" : ""}`}
                style={
                  i === index
                    ? {
                        animation: `featured-progress ${DURATION_MS}ms linear forwards`,
                        animationPlayState: running ? "running" : "paused",
                      }
                    : undefined
                }
              />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
