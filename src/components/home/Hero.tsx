import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SearchBar } from "./SearchBar";

/**
 * Full-bleed photographic hero with the search front and centre. Sits under the transparent
 * header (negative top margin). The image is the LCP element: priority + full-width sizes.
 */
export async function Hero({ maxGuests }: { maxGuests: number }) {
  const t = await getTranslations("home");
  return (
    <section
      aria-labelledby="hero-title"
      className="on-dark relative -mt-[var(--header-h)] flex min-h-[max(40rem,100svh)] flex-col justify-end text-paper"
    >
      <div className="absolute inset-0 overflow-hidden bg-ink">
        <Image
          src="/images/placeholder/cordoaria-garden-01.jpg"
          alt={t("heroImageAlt")}
          fill
          priority
          sizes="100vw"
          quality={75}
          className="animate-hero-image object-cover object-[50%_40%]"
        />
        {/* Scrim: keeps type legible on any photo without flattening it */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,26,24,0.45)_0%,rgba(27,26,24,0)_22%,rgba(27,26,24,0.05)_45%,rgba(27,26,24,0.75)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(27,26,24,0.45)_0%,rgba(27,26,24,0)_65%)]" />
      </div>

      <div className="container-page relative pt-[calc(var(--header-h)+4rem)] pb-[clamp(2rem,5vw,4rem)]">
        <p className="label animate-fade-in mb-6 text-paper/85">{t("heroEyebrow")}</p>
        <h1 id="hero-title" className="text-display animate-fade-in max-w-[14ch] font-light">
          {t("heroTitle")}
        </h1>
        <div className="mt-[clamp(2rem,5vw,3.5rem)] max-w-5xl">
          <SearchBar maxGuests={maxGuests} />
        </div>
      </div>
    </section>
  );
}
