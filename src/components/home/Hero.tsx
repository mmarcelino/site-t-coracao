import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SearchBar } from "./SearchBar";

/**
 * Hero: one building, one headline, the search on the photo, nothing else. The whole hero
 * (header overlay included) fits the first screen. The image is the LCP element.
 */
export async function Hero({ maxGuests }: { maxGuests: number }) {
  const t = await getTranslations("home");
  return (
    <section
      aria-labelledby="hero-title"
      className="on-dark relative -mt-[var(--header-h)] flex h-[100svh] min-h-[36rem] flex-col justify-end text-paper"
    >
      <div className="absolute inset-0 overflow-hidden bg-ink">
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
      </div>

      <div className="container-page relative pb-[clamp(1.25rem,4vh,3rem)]">
        <h1 id="hero-title" className="text-display animate-fade-in max-w-[13ch]">
          {t("heroTitle")}
        </h1>
        <div className="mt-[clamp(1.5rem,4vh,3rem)] max-w-5xl">
          <SearchBar maxGuests={maxGuests} />
        </div>
      </div>
    </section>
  );
}
