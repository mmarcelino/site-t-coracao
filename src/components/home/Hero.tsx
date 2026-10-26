import { getTranslations } from "next-intl/server";
import { HeroSlideshow, HeroSlideshowBackground, type HeroSlide } from "./HeroSlideshow";
import { SearchBar } from "./SearchBar";

/**
 * Hero (branch hero-lunevar): a slideshow of homes with a large headline directly above a
 * full-width booking box (Numa-style). "Book direct" lives in the strip above the header. The whole hero fits
 * the first screen.
 */
export async function Hero({
  maxGuests,
  slides,
}: {
  maxGuests: number;
  slides: HeroSlide[];
}) {
  const t = await getTranslations("home");
  return (
    <section
      aria-labelledby="hero-title"
      className="on-dark relative -mt-[var(--header-h)] h-[calc(100svh-var(--strip-h))] min-h-[36rem] overflow-hidden bg-ink text-paper"
      data-hero-stage
    >
      <HeroSlideshow slides={slides}>
        {/* Six homes, cross-fading every few seconds. */}
        <HeroSlideshowBackground />
        {/* Light overall, darker at the top (header) and bottom (all the text lives there). */}
        <div className="absolute inset-0 bg-ink/20" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,26,24,0.45)_0%,rgba(27,26,24,0)_25%,rgba(27,26,24,0)_45%,rgba(27,26,24,0.75)_100%)]" />

        {/* Bottom block (Numa-style): headline directly above a full-width booking box, sharing
            the same left edge. */}
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="container-page pb-[clamp(1.5rem,5vh,3rem)]">
            {/* Grotesk + italic serif: modern structure, warmth on the brand line. */}
            <h1
              id="hero-title"
              className="animate-fade-in text-[clamp(3rem,1.2rem+6.4vw,8.25rem)] leading-[0.92] font-normal tracking-[-0.045em] md:pl-6"
            >
              <span className="block sm:whitespace-nowrap">{t("heroTitleLead")}</span>{" "}
              <span className="block font-serif text-[1.08em] tracking-[-0.02em] italic">{t("heroTitleAccent")}</span>
            </h1>
            <div className="mt-[clamp(1.25rem,3vh,2rem)]">
              <SearchBar maxGuests={maxGuests} calendarPlacement="top" />
            </div>
          </div>
        </div>
      </HeroSlideshow>
    </section>
  );
}
