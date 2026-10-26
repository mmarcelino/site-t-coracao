"use client";

import clsx from "clsx";
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
 * Hero "featured homes" card: rotates through a few top-rated homes with story-style progress
 * bars. Pauses on hover/focus, has an explicit pause button (WCAG 2.2.2), and doesn't
 * auto-rotate for visitors who prefer reduced motion.
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
      className="w-full max-w-[27rem] rounded-[1.5rem] bg-white/95 p-3 text-ink shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] backdrop-blur-xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label={t("home.featuredLabel")}
    >
      <div className="flex gap-4">
        <Link
          href={{ pathname: "/apartments/[slug]", params: { slug: item.slug } }}
          className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-[1rem] bg-limestone"
          tabIndex={-1}
          aria-hidden
        >
          <Image key={item.image.src} src={item.image.src} alt="" fill sizes="112px" className="animate-fade-in-fast object-cover" />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col py-1 pr-1">
          <div className="flex items-center justify-between gap-3">
            <p className="label text-granite">
              {t("home.featuredLabel")} · {String(index + 1).padStart(2, "0")}/{String(items.length).padStart(2, "0")}
            </p>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="-m-1 grid size-7 place-items-center rounded-full text-granite transition-colors hover:bg-ink/[0.06] hover:text-ink"
              aria-label={paused ? t("home.featuredPlay") : t("home.featuredPause")}
            >
              <Icon name={paused ? "play" : "pause"} size={14} strokeWidth={1.75} />
            </button>
          </div>

          <div key={item.slug} className="animate-fade-in-fast mt-1.5 min-w-0" aria-live={running ? "off" : "polite"}>
            <h3 className="truncate text-[1.1875rem] leading-tight font-semibold tracking-[-0.02em]">
              <Link href={{ pathname: "/apartments/[slug]", params: { slug: item.slug } }} className="hover:text-azulejo-bright">
                {item.title}
              </Link>
            </h3>
            <p className="text-small mt-0.5 truncate text-granite">{item.place}</p>
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 pt-2">
            <p className="text-small">
              <span className="text-granite">{t("common.from")} </span>
              <span className="font-semibold">{item.price}</span>
              <span className="text-granite"> {t("common.perNight")}</span>
            </p>
            {item.rating ? (
              <p className="flex items-center gap-1 rounded-full bg-sand px-2.5 py-1 text-[0.8125rem] font-semibold">
                <Icon name="star" size={13} fill="currentColor" strokeWidth={0} />
                <span aria-hidden>{item.rating}</span>
                <span className="sr-only">{t("home.featuredRating", { score: item.rating })}</span>
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Story-style progress: one segment per home; each is also a button to jump to it. */}
      <div className="mt-3 flex gap-1.5 px-1">
        {items.map((it, i) => (
          <button
            key={it.slug}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={t("home.featuredShow", { n: i + 1, total: items.length })}
            aria-current={i === index ? "true" : undefined}
            className="group relative h-4 flex-1"
          >
            <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-ink/10">
              <span
                key={i === index ? `active-${index}` : `idle-${i}`}
                className={clsx(
                  "block h-full origin-left rounded-full bg-ink",
                  i < index ? "scale-x-100" : i > index ? "scale-x-0" : "",
                )}
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
