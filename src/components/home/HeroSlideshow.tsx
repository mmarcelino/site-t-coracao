"use client";

import clsx from "clsx";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { ReviewCard, type HeroReview } from "./ReviewCard";

export interface HeroSlide {
  key: string;
  label: string; // short name under the line, e.g. "Casa do Farol"
  image: { src: string; alt: string };
  review: HeroReview;
}

const SLIDE_MS = 7000;

interface SlideshowState {
  slides: HeroSlide[];
  index: number;
  running: boolean;
  paused: boolean;
  go: (i: number) => void;
  togglePause: () => void;
}

const SlideshowContext = createContext<SlideshowState | null>(null);

function useSlideshow() {
  const ctx = useContext(SlideshowContext);
  if (!ctx) throw new Error("Hero slideshow parts must be inside <HeroSlideshow>");
  return ctx;
}

/**
 * One controller for the hero: background photo, progress lines and guest review always show
 * the same home. A line filling up = time until the next photo (Delta Cafés-style).
 * Pausable (WCAG 2.2.2); starts paused for reduced motion.
 */
export function HeroSlideshow({ slides, children }: { slides: HeroSlide[]; children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    // Respect reduced motion: start paused. External-preference sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);

  const running = !paused && slides.length > 1;

  // The timer drives the slides (lines are only visual); pausing mid-way resumes where it left off.
  const elapsed = useRef(0);
  useEffect(() => {
    elapsed.current = 0;
  }, [index]);
  useEffect(() => {
    if (!running) return;
    const startedAt = performance.now();
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS - elapsed.current);
    return () => {
      window.clearTimeout(id);
      elapsed.current += performance.now() - startedAt;
    };
  }, [running, index, slides.length]);

  const value: SlideshowState = {
    slides,
    index,
    running,
    paused,
    go: setIndex,
    togglePause: () => setPaused((p) => !p),
  };
  return <SlideshowContext.Provider value={value}>{children}</SlideshowContext.Provider>;
}

/** Stacked full-bleed photos; only the active one is visible (cross-fade + slow settle). */
export function HeroSlideshowBackground() {
  const { slides, index } = useSlideshow();
  return (
    <>
      {slides.map((slide, i) => (
        <div key={slide.key} className="hero-slide absolute inset-0 overflow-hidden" data-active={i === index}>
          <Image
            src={slide.image.src}
            alt={i === index ? slide.image.alt : ""}
            fill
            sizes="100vw"
            quality={75}
            priority={i === 0}
            loading={i === 0 ? undefined : "eager"}
            fetchPriority={i === 0 ? "high" : "low"}
            className="object-cover"
          />
        </div>
      ))}
    </>
  );
}

/** Thin lines, one per home; the active one fills. Each is a button to jump to that home. */
export function HeroSlideshowLines({ className }: { className?: string }) {
  const t = useTranslations("home");
  const { slides, index, running, paused, go, togglePause } = useSlideshow();
  return (
    <div className={clsx("flex items-end gap-4", className)} role="group" aria-label={t("slidesLabel")}>
      <ol className="grid flex-1 grid-cols-6 gap-2 sm:gap-3">
        {slides.map((slide, i) => (
          <li key={slide.key}>
            <button
              type="button"
              onClick={() => go(i)}
              aria-label={t("slideShow", { n: i + 1, total: slides.length, name: slide.label })}
              aria-current={i === index ? "true" : undefined}
              className={clsx(
                "group block w-full pt-2 pb-2 text-left transition-opacity",
                i === index ? "opacity-100" : "opacity-70 hover:opacity-100",
              )}
            >
              <span className="hidden truncate pb-2 text-[0.75rem] text-paper md:block">
                <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="ml-2 text-paper/85">{slide.label}</span>
              </span>
              <span className="relative block h-px overflow-hidden bg-white/35">
                <span
                  key={i === index ? `on-${index}` : `off-${i}`}
                  className={clsx(
                    "absolute inset-0 origin-left bg-white",
                    i < index ? "scale-x-100" : i > index ? "scale-x-0" : "",
                  )}
                  style={
                    i === index
                      ? {
                          animation: `featured-progress ${SLIDE_MS}ms linear forwards`,
                          animationPlayState: running ? "running" : "paused",
                        }
                      : undefined
                  }
                />
              </span>
            </button>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={togglePause}
        className="mb-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-white/40 text-paper transition-colors hover:bg-white/15"
        aria-label={paused ? t("featuredPlay") : t("featuredPause")}
      >
        <Icon name={paused ? "play" : "pause"} size={12} strokeWidth={1.75} />
      </button>
    </div>
  );
}

/** Guest review of the home currently in the background. */
export function HeroSlideshowReview() {
  const { slides, index } = useSlideshow();
  const slide = slides[index];
  return slide ? <ReviewCard review={slide.review} /> : null;
}
