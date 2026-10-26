import Image from "next/image";
import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import {
  HeroSlideshow,
  HeroSlideshowBackground,
  HeroSlideshowReview,
  HeroSlideshowLines,
  type HeroSlide,
} from "./HeroSlideshow";
import { SearchBar } from "./SearchBar";

/**
 * Two larger collage photos that glide in beside the shrinking hero card (positions relative to
 * the card; `from` is where each starts). Decorative: the hero photo carries the meaning.
 */
const collage: Array<{ src: string; style: CSSProperties }> = [
  {
    src: "/images/placeholder/casa-do-farol-02.jpg",
    style: {
      right: "calc(50% + var(--card-w) / 2 + 2.5vw)",
      top: "20%",
      width: "min(24vw, 26rem)",
      aspectRatio: "4 / 3",
      "--from-x": "-36vw",
      "--from-y": "0vh",
    } as CSSProperties,
  },
  {
    src: "/images/placeholder/sao-bento-ii-01.jpg",
    style: {
      left: "calc(50% + var(--card-w) / 2 + 2.5vw)",
      top: "12%",
      width: "min(17vw, 18rem)",
      aspectRatio: "3 / 4",
      "--from-x": "36vw",
      "--from-y": "4vh",
    } as CSSProperties,
  },
];

/**
 * Editorial hero: a calm photo, a large light uppercase headline high on the left, one short line
 * top right, and a single bottom row in one material (glass): featured homes + booking.
 * On scroll (desktop, supporting browsers) it pins while the photo shrinks into a card
 * (CSS in globals.css, "Pinned hero"); the bottom row stays put.
 */
export async function Hero({ maxGuests, slides }: { maxGuests: number; slides: HeroSlide[] }) {
  const t = await getTranslations("home");
  return (
    <section aria-labelledby="hero-title" className="hero-pin relative -mt-[var(--header-h)] bg-wash">
      <HeroSlideshow slides={slides}>
        <div className="hero-pin__stage" data-hero-stage>
          <div aria-hidden>
            {collage.map((photo) => (
              <div
                key={photo.src}
                className="hero-pin__photo absolute overflow-hidden rounded-[var(--radius-card)] bg-limestone shadow-[0_24px_60px_-30px_rgba(27,26,24,0.5)]"
                style={photo.style}
              >
                <Image src={photo.src} alt="" fill sizes="26vw" className="object-cover" />
              </div>
            ))}
          </div>

          <div className="hero-pin__frame on-dark absolute inset-0 overflow-hidden bg-ink text-paper">
            {/* Six homes, cross-fading as the lines below fill up. */}
            <HeroSlideshowBackground />
            {/* Even, calm darkening + a little extra at the top where the headline sits. */}
            <div className="absolute inset-0 bg-ink/35" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,26,24,0.45)_0%,rgba(27,26,24,0)_45%,rgba(27,26,24,0)_70%,rgba(27,26,24,0.45)_100%)]" />

            {/* Headline + line fade as the photo shrinks; the bottom row never does. */}
            <div className="hero-pin__content absolute inset-x-0 top-0">
              <div className="container-page grid gap-6 pt-[calc(var(--header-h)+clamp(3.5rem,17vh,11rem))] lg:grid-cols-12">
                {/* Grotesk + italic serif: modern structure, warmth on the brand line. */}
                <h1
                  id="hero-title"
                  className="animate-fade-in text-[clamp(3rem,1.4rem+6.2vw,8.5rem)] leading-[0.95] font-normal tracking-[-0.045em] lg:col-span-9"
                >
                  <span className="block">{t("heroTitleLead")}</span>{" "}
                  <span className="block font-serif text-[1.08em] tracking-[-0.02em] italic">
                    {t("heroTitleAccent")}
                  </span>
                </h1>
              </div>
            </div>
          </div>

          {/* Progress lines (fade with the headline on scroll), then one row in one material:
              the featured home (wide screens) + booking, aligned on a baseline. */}
          <div className="absolute inset-x-0 bottom-0 z-10">
            <div className="container-page pb-[clamp(1.25rem,4vh,2.5rem)]">
              <HeroSlideshowLines className="hero-pin__content mb-[clamp(0.75rem,2vh,1.25rem)]" />
              <div className="flex items-end justify-between gap-4">
                <div className="hidden xl:block">
                  <HeroSlideshowReview />
                </div>
                <div className="w-full md:ml-auto md:w-auto">
                  <SearchBar maxGuests={maxGuests} calendarPlacement="top" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </HeroSlideshow>
    </section>
  );
}
