import { getTranslations } from "next-intl/server";
import {
  HeroSlideshow,
  HeroSlideshowBackground,
  type HeroSlide,
} from "./HeroSlideshow";
import { DirectCard, DirectPerksLine, type HeroRating } from "./DirectCard";
import { SearchBar } from "./SearchBar";

/**
 * Editorial hero: a slideshow of homes behind one text stack at the bottom-left (headline, subline,
 * booking box), with the book-direct caption on the right margin. The whole hero fits the first screen.
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
        {/* Six homes, cross-fading as the lines below fill up. */}
        <HeroSlideshowBackground />
        {/* Shade only where there's text (nav at the top, the text stack bottom-left); the rest of the
            photo stays at full brightness. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,26,24,0.4)_0%,rgba(27,26,24,0)_20%,rgba(27,26,24,0)_45%,rgba(27,26,24,0.6)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(27,26,24,0.45)_0%,rgba(27,26,24,0.15)_45%,rgba(27,26,24,0)_70%)]" />

        {/* Two edges, one stack: headline, subline and booking box share the left margin and sit at
            the bottom (bottom gap = side gutter); the book-direct caption ends on the right margin,
            on the booking box's baseline. The top of the photo stays empty. */}
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="container-page pb-[var(--gutter)]">
            <h1
              id="hero-title"
              className="animate-fade-in text-[min(clamp(3rem,1.4rem+6.2vw,8.5rem),max(3rem,11.5vh))] leading-[0.92] font-semibold tracking-[-0.03em]"
            >
              <span className="block">{t("heroTitleLead")}</span>{" "}
              <span className="block">{t("heroTitleAccent")}</span>
            </h1>
            {/* What this is, in plain words: apartments to book and stay in. */}
            <p className="animate-fade-in mt-5 max-w-[48rem] text-lead text-paper">{t("heroSub")}</p>

            <div className="mt-12 flex flex-col gap-4 md:mt-20 lg:flex-row lg:items-end lg:justify-between">
              <div className="w-full md:w-max" data-pause-slideshow>
                <SearchBar maxGuests={maxGuests} calendarPlacement="top" />
              </div>
              <div className="hidden xl:block">
                <DirectCard rating={rating} />
              </div>
              {/* Smaller screens: the promise as one short line (under the box, or right on laptops). */}
              <DirectPerksLine className="lg:max-w-[18rem] lg:border-t-2 lg:border-paper lg:pt-3 lg:text-right xl:hidden" />
            </div>
          </div>
        </div>
      </HeroSlideshow>
    </section>
  );
}
