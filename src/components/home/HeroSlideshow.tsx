"use client";

import clsx from "clsx";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
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
  const { slides, index, running, paused, go, togglePause } = useSlideshow();
  return (
    <div className={clsx("flex items-center gap-4", className)} role="group" aria-label={t("slidesLabel")}>
      <ol className="grid flex-1" style={{ gridTemplateColumns: `repeat(${slides.length}, minmax(0, 1fr))` }}>
        {slides.map((slide, i) => (
          <li key={slide.key}>
            <button
              type="button"
              onClick={() => go(i)}
              aria-label={t("slideShow", { n: i + 1, total: slides.length, name: slide.label })}
              aria-current={i === index ? "true" : undefined}
              className="block w-full py-3"
            >
              <span className="relative block h-px overflow-hidden bg-white/45">
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
            </button>
          </li>
        ))}
      </ol>
      {/* Required for auto-advancing content (WCAG 2.2.2). */}
      <button
        type="button"
        onClick={togglePause}
        className="grid size-8 shrink-0 place-items-center rounded-full border border-white/40 text-paper transition-colors hover:bg-white/15"
        aria-label={paused ? t("featuredPlay") : t("featuredPause")}
      >
        <Icon name={paused ? "play" : "pause"} size={12} strokeWidth={1.75} />
      </button>
    </div>
  );
}
