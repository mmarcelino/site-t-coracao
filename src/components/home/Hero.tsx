import { getTranslations } from "next-intl/server";
import {
  HeroSlideshow,
  HeroSlideshowBackground,
  HeroSlideshowRule,
  type HeroSlide,
} from "./HeroSlideshow";
import { DirectCard, DirectPerksLine, type HeroRating } from "./DirectCard";
import { SearchBar } from "./SearchBar";

/**
 * Editorial hero: a slideshow of homes (one per collection) behind a large headline, with the
 * collection lines, a "book direct" card and the booking box along the bottom. One moving idea only:
 * the slideshow. The whole hero fits the first screen.
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
        {/* Even, calm darkening; a little more at the top (headline) and bottom (small text). */}
        <div className="absolute inset-0 bg-ink/35" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,26,24,0.45)_0%,rgba(27,26,24,0)_40%,rgba(27,26,24,0)_60%,rgba(27,26,24,0.6)_100%)]" />

        <div className="absolute inset-x-0 top-0">
          <div className="container-page pt-[calc(var(--header-h)+clamp(3.5rem,17vh,11rem))]">
            {/* Grotesk + italic serif: modern structure, warmth on the brand line. */}
            <h1
              id="hero-title"
              className="animate-fade-in text-[clamp(3rem,1.4rem+6.2vw,8.5rem)] leading-[0.95] font-normal tracking-[-0.045em]"
            >
              <span className="block">{t("heroTitleLead")}</span>{" "}
              <span className="block font-serif text-[1.08em] tracking-[-0.02em] italic">{t("heroTitleAccent")}</span>
            </h1>
            {/* What this is, in one warm line (no room for it on phones in this layout). */}
            <p className="animate-fade-in mt-5 hidden max-w-[48rem] text-lead text-paper md:block">{t("heroSub")}</p>
          </div>
        </div>

        {/* A continuous line, then one row in one material: why book direct (wide screens) + booking. */}
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="container-page pb-[clamp(1.25rem,4vh,2.5rem)]">
            <HeroSlideshowRule className="mb-[clamp(0.75rem,2vh,1.25rem)]" />
            <div className="flex items-end justify-between gap-4">
              {/* Caption sits level with the booking box's text, not its outer edge. */}
              <div className="hidden pb-3 xl:block">
                <DirectCard rating={rating} />
              </div>
              <div className="w-full md:ml-auto md:w-auto">
                <SearchBar maxGuests={maxGuests} calendarPlacement="top" />
                {/* Book-direct promise for phones/tablets (wide screens get the caption). */}
                <DirectPerksLine className="mt-3 xl:hidden" />
              </div>
            </div>
          </div>
        </div>
      </HeroSlideshow>
    </section>
  );
}
