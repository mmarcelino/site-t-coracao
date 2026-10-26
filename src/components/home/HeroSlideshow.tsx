"use client";

import Image from "next/image";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

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
 * No visible control (client decision): it pauses while the hero is hovered or has keyboard focus,
 * while the tab is hidden, and starts paused for reduced motion. Known WCAG 2.2.2 gap: an explicit
 * pause control is still recommended before launch (see CLAUDE.md §15).
 */
export function HeroSlideshow({ slides, children }: { slides: HeroSlide[]; children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    // Respect reduced motion: start paused. External-preference sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);

  const [engaged, setEngaged] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);
  const running = !paused && !engaged && !hidden && slides.length > 1;

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
  return (
    <SlideshowContext.Provider value={value}>
      <div
        className="contents"
        onMouseEnter={() => setEngaged(true)}
        onMouseLeave={() => setEngaged(false)}
        onFocus={() => setEngaged(true)}
        onBlur={() => setEngaged(false)}
      >
        {children}
      </div>
    </SlideshowContext.Provider>
  );
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
