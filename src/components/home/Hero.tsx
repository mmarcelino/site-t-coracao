import Image from "next/image";
import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import { SearchBar } from "./SearchBar";

/**
 * Collage photos that glide in around the shrinking hero card (positions relative to the card;
 * `from` is where each starts, off to the side). Decorative: the hero photo carries the meaning.
 */
const collage: Array<{ src: string; style: CSSProperties }> = [
  {
    src: "/images/placeholder/mouzinho-rooftop-e-01.jpg",
    style: {
      right: "calc(50% + var(--card-w) / 2 + 2vw)",
      top: "11%",
      width: "min(21vw, 22rem)",
      aspectRatio: "16 / 10",
      "--from-x": "-38vw",
      "--from-y": "-6vh",
    } as CSSProperties,
  },
  {
    src: "/images/placeholder/sao-bento-duplex-06.jpg",
    style: {
      right: "calc(50% + var(--card-w) / 2 + 8vw)",
      top: "52%",
      width: "min(13vw, 14rem)",
      aspectRatio: "3 / 2",
      "--from-x": "-34vw",
      "--from-y": "5vh",
    } as CSSProperties,
  },
  {
    src: "/images/placeholder/cordoaria-garden-06.jpg",
    style: {
      left: "calc(50% + var(--card-w) / 2 + 2vw)",
      top: "15%",
      width: "min(14vw, 15rem)",
      aspectRatio: "3 / 4",
      "--from-x": "36vw",
      "--from-y": "-7vh",
    } as CSSProperties,
  },
  {
    src: "/images/placeholder/breiner-skylight-01.jpg",
    style: {
      left: "calc(50% + var(--card-w) / 2 + 2vw)",
      top: "58%",
      width: "min(20vw, 21rem)",
      aspectRatio: "3 / 2",
      "--from-x": "38vw",
      "--from-y": "9vh",
    } as CSSProperties,
  },
];

/**
 * Hero: one building, one headline, the search on the photo, nothing else; the whole hero fits
 * the first screen. On scroll (desktop, supporting browsers) it pins while the photo shrinks into
 * a card and a collage gathers around it (CSS in globals.css, "Pinned hero").
 */
export async function Hero({ maxGuests }: { maxGuests: number }) {
  const t = await getTranslations("home");
  return (
    <section aria-labelledby="hero-title" className="hero-pin relative -mt-[var(--header-h)] bg-wash">
      <div className="hero-pin__stage" data-hero-stage>
        <div aria-hidden>
          {collage.map((photo) => (
            <div
              key={photo.src}
              className="hero-pin__photo absolute overflow-hidden rounded-[var(--radius-tile)] bg-limestone shadow-[0_20px_50px_-25px_rgba(27,26,24,0.5)]"
              style={photo.style}
            >
              <Image src={photo.src} alt="" fill sizes="22vw" className="object-cover" />
            </div>
          ))}
        </div>

        <div className="hero-pin__frame on-dark absolute inset-0 overflow-hidden bg-ink text-paper">
          <Image
            src="/images/placeholder/casa-do-farol-09.jpg"
            alt={t("heroImageAlt")}
            fill
            priority
            sizes="100vw"
            quality={75}
            className="animate-hero-image object-cover object-[60%_50%]"
          />
          {/* Scrim: keeps type legible on any photo without flattening it */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,26,24,0.5)_0%,rgba(27,26,24,0)_25%,rgba(27,26,24,0.1)_50%,rgba(27,26,24,0.8)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(27,26,24,0.45)_0%,rgba(27,26,24,0)_70%)]" />

          <div className="hero-pin__content absolute inset-0 flex flex-col justify-end">
            <div className="container-page pb-[clamp(1.25rem,4vh,3rem)]">
              <h1 id="hero-title" className="text-display animate-fade-in max-w-[13ch]">
                {t("heroTitle")}
              </h1>
              <div className="mt-[clamp(1.5rem,4vh,3rem)] max-w-5xl">
                <SearchBar maxGuests={maxGuests} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
