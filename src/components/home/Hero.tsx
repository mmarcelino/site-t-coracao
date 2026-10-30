import { getTranslations } from "next-intl/server";
import {
  HeroSlideshow,
  HeroSlideshowBackground,
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

        {/* Headline + subline in the lower half, sitting a fixed distance above the bottom band (md
            up); on phones they sit under the header, above the booking card. */}
        <div className="absolute inset-x-0 top-0 md:top-auto md:bottom-[calc(var(--hero-band-h)+clamp(2.5rem,7vh,4.5rem))]">
          <div className="container-page pt-[calc(var(--header-h)+clamp(1.5rem,7vh,4rem))] md:pt-0">
            {/* Grotesk + italic serif: modern structure, warmth on the brand line. */}
            <h1
              id="hero-title"
              className="animate-fade-in text-[min(clamp(3rem,1.4rem+6.2vw,8.5rem),max(3rem,11.5vh))] leading-[0.92] font-semibold tracking-[-0.03em]"
            >
              <span className="block">{t("heroTitleLead")}</span>{" "}
              <span className="block font-medium italic">{t("heroTitleAccent")}</span>
            </h1>
            {/* What this is, in plain words: apartments to book and stay in. */}
            <p className="animate-fade-in mt-5 max-w-xl text-lead text-paper/90">{t("heroSub")}</p>
          </div>
        </div>

        {/* Bottom band: same height as the header bar over the hero (--hero-band-h); book-direct
            caption (wide screens) + booking centred inside it. */}
        <div className="absolute inset-x-0 bottom-0 z-10 md:h-[var(--hero-band-h)]">
          {/* Solid 2px full-bleed line along the band's top edge (matches the header's). */}
          <div aria-hidden className="absolute inset-x-0 top-0 h-[2px] -translate-y-1/2 bg-paper" />
          <div className="container-page flex h-full items-center justify-between gap-4 py-5 md:py-0">
            <div className="hidden xl:block">
              <DirectCard rating={rating} />
            </div>
            {/* Laptops/large tablets: the promise as a short line on the left of the band. */}
            <DirectPerksLine className="hidden max-w-[22rem] lg:block lg:text-left xl:hidden" />
            <div className="w-full md:ml-auto md:w-auto" data-pause-slideshow>
              <SearchBar maxGuests={maxGuests} calendarPlacement="top" />
              {/* Book-direct promise for phones/tablets (wide screens get the caption). */}
              <DirectPerksLine className="mt-3 md:hidden" />
            </div>
          </div>
        </div>
      </HeroSlideshow>
    </section>
  );
}
