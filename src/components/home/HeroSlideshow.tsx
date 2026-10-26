"use client";

import clsx from "clsx";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icon";

export interface HeroSlide {
  key: string;
  label: string; // collection name above the line, e.g. "Junto ao mar"
  image: { src: string; alt: string };
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
 * One controller for the hero: background photo and progress lines always show the same
 * collection. A line filling up = time until the next photo (Delta Cafés-style).
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

/**
 * Stacked full-bleed photos; only the active one is visible (cross-fade + slow settle).
 * Only the first photo loads with the page; the rest mount once the page has finished loading
 * and the browser is idle, well before the first change at 7s.
 */
export function HeroSlideshowBackground() {
  const { slides, index } = useSlideshow();
  const [restReady, setRestReady] = useState(false);

  useEffect(() => {
    const start = () => {
      const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
      idle(() => setRestReady(true));
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  return (
    <>
      {slides.map((slide, i) => {
        if (i !== 0 && i !== index && !restReady) return null;
        return (
          <div key={slide.key} className="hero-slide absolute inset-0 overflow-hidden" data-active={i === index}>
            <Image
              src={slide.image.src}
              alt={i === index ? slide.image.alt : ""}
              fill
              sizes="100vw"
              quality={75}
              priority={i === 0}
              fetchPriority={i === 0 ? "high" : "low"}
              className="object-cover"
            />
          </div>
        );
      })}
    </>
  );
}

/**
 * One continuous hairline (like the header's): a white stretch moves along it as the slideshow
 * advances. Each stretch is a button to jump to that slide (named for screen readers).
 */
export function HeroSlideshowLines({ className }: { className?: string }) {
  const t = useTranslations("home");
  const { slides, index, running, paused, togglePause } = useSlideshow();
  const current = slides[index];
  return (
    <div className={clsx("flex items-end gap-4", className)} role="group" aria-label={t("slidesLabel")}>
      <div className="min-w-0 flex-1">
        {/* Only the current collection is named, linking to its homes; it fades with the photo. */}
        {current ? (
          // Fixed at the left end of the line; only the word changes (fade), it never moves.
          <div className="relative h-5">
            <Link
              href={{ pathname: "/apartments", query: { tag: current.key } }}
              className="absolute top-0 left-0 text-[0.8125rem] whitespace-nowrap text-paper hover:underline"
            >
              <span key={current.key} className="animate-fade-in-fast inline-flex items-center gap-1.5">
                {current.label}
                <Icon name="arrowRight" size={13} />
              </span>
            </Link>
          </div>
        ) : null}
        {/* The line itself is the pause control (WCAG 2.2.2): click/tap to pause or resume; a small
            mark appears at its end on hover or keyboard focus. */}
        <button
          type="button"
          onClick={togglePause}
          aria-label={paused ? t("featuredPlay") : t("featuredPause")}
          aria-pressed={paused}
          className="group/line flex w-full items-center gap-3 py-3"
        >
          <span
            aria-hidden
            className="grid flex-1"
            style={{ gridTemplateColumns: `repeat(${slides.length}, minmax(0, 1fr))` }}
          >
            {slides.map((slide, i) => (
              <span key={slide.key} className="relative block h-px overflow-hidden bg-white/45">
                <span
                  key={i === index ? `on-${index}` : `off-${i}`}
                  className={clsx("absolute inset-0 origin-left bg-white", i === index ? "" : "scale-x-0")}
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
            ))}
          </span>
          <Icon
            name={paused ? "play" : "pause"}
            size={12}
            strokeWidth={1.75}
            className={clsx(
              "shrink-0 text-paper transition-opacity",
              paused ? "opacity-100" : "opacity-0 group-hover/line:opacity-100 group-focus-visible/line:opacity-100",
            )}
          />
        </button>
      </div>
    </div>
  );
}
