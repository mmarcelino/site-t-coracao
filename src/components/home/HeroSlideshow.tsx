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
 * Thin lines, one per collection; the active one fills. Each line jumps to its slide; the active
 * label is a link to that collection's homes (so it does what it reads like it does).
 */
export function HeroSlideshowLines({ className }: { className?: string }) {
  const t = useTranslations("home");
  const { slides, index, running, paused, go, togglePause } = useSlideshow();
  const label = (i: number, name: string) => (
    <>
      <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
      <span className="ml-2">{name}</span>
    </>
  );
  return (
    <div className={clsx("flex items-end gap-4", className)} role="group" aria-label={t("slidesLabel")}>
      {/* No gaps: the six lines join into one continuous rule (like the header's); the active
          stretch fills in white. Labels keep their spacing with padding instead. */}
      <ol className="grid flex-1 grid-cols-6">
        {slides.map((slide, i) => {
          const active = i === index;
          const line = (
            <span className="relative block h-px overflow-hidden bg-white/45">
              <span
                key={active ? `on-${index}` : `off-${i}`}
                className={clsx("absolute inset-0 origin-left bg-white", i < index ? "scale-x-100" : i > index ? "scale-x-0" : "")}
                style={
                  active
                    ? {
                        animation: `featured-progress ${SLIDE_MS}ms linear forwards`,
                        animationPlayState: running ? "running" : "paused",
                      }
                    : undefined
                }
              />
            </span>
          );
          return (
            <li key={slide.key}>
              {active ? (
                <>
                  <Link
                    href={{ pathname: "/apartments", query: { tag: slide.key } }}
                    className="hidden items-center gap-1 truncate pr-3 pb-2 text-[0.8125rem] text-paper hover:underline md:flex"
                  >
                    {label(i, slide.label)}
                    <Icon name="arrowRight" size={13} className="shrink-0" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-label={t("slideShow", { n: i + 1, total: slides.length, name: slide.label })}
                    aria-current="true"
                    className="block w-full pt-2 pb-2 md:pt-0"
                  >
                    {line}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={t("slideShow", { n: i + 1, total: slides.length, name: slide.label })}
                  className="block w-full pb-2 text-left opacity-70 transition-opacity hover:opacity-100 md:pt-0"
                >
                  <span className="hidden truncate pr-3 pb-2 text-[0.8125rem] text-paper md:block">{label(i, slide.label)}</span>
                  <span className="block pt-2 md:pt-0">{line}</span>
                </button>
              )}
            </li>
          );
        })}
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
