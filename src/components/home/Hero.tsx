import { getTranslations } from "next-intl/server";
import { HeroSlideshow, HeroSlideshowBackground, HeroSlideshowPause, type HeroSlide } from "./HeroSlideshow";
import { DirectLine, type HeroRating } from "./DirectCard";
import { SearchBar } from "./SearchBar";

/**
 * Hero (branch hero-lunevar): a slideshow of homes; all text at the bottom, Lunevar-style: a large
 * headline, then the intro on the left and booking box + book-direct line on the right. The whole hero fits
 * the first screen.
 */
export async function Hero({
  maxGuests,
  slides,
  rating,
}: {
  maxGuests: number;
  slides: HeroSlide[];
  rating: HeroRating;
}) {
  const t = await getTranslations("home");
  return (
    <section
      aria-labelledby="hero-title"
      className="on-dark relative -mt-[var(--header-h)] h-[100svh] min-h-[36rem] overflow-hidden bg-ink text-paper"
      data-hero-stage
    >
      <HeroSlideshow slides={slides}>
        {/* Six homes, cross-fading every few seconds. */}
        <HeroSlideshowBackground />
        {/* Light overall, darker at the top (header) and bottom (all the text lives there). */}
        <div className="absolute inset-0 bg-ink/20" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,26,24,0.45)_0%,rgba(27,26,24,0)_25%,rgba(27,26,24,0)_45%,rgba(27,26,24,0.75)_100%)]" />

        {/* Bottom block (Lunevar-style): a large headline on its own row, then the intro on the
            left and booking + book-direct line on the right. */}
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="container-page pb-[clamp(1.5rem,5vh,3rem)]">
            {/* Grotesk + italic serif: modern structure, warmth on the brand line. */}
            <h1
              id="hero-title"
              className="animate-fade-in text-[clamp(3rem,1.2rem+6.4vw,8.25rem)] leading-[0.92] font-normal tracking-[-0.045em]"
            >
              <span className="block sm:whitespace-nowrap">{t("heroTitleLead")}</span>{" "}
              <span className="block font-serif text-[1.08em] tracking-[-0.02em] italic">{t("heroTitleAccent")}</span>
            </h1>
            <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <p className="animate-fade-in max-w-md text-[1.0625rem] leading-relaxed text-paper/90">{t("heroSub")}</p>
              <div className="w-full md:ml-auto md:w-auto lg:ml-0">
                <SearchBar maxGuests={maxGuests} calendarPlacement="top" />
                <div className="mt-3 flex items-center justify-between gap-4 md:justify-end">
                  <DirectLine rating={rating} />
                  <HeroSlideshowPause />
                </div>
              </div>
            </div>
          </div>
        </div>
      </HeroSlideshow>
    </section>
  );
}
