import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { details } from "@/content/showcase";
import type { Locale } from "@/i18n/routing";

/** Close-ups only, no copy beyond the title: the furnishing and materials speak for themselves. */
export async function DetailsStrip() {
  const t = await getTranslations("home");
  const locale = (await getLocale()) as Locale;
  return (
    <section aria-labelledby="details-title" className="section-y-tight">
      <h2 id="details-title" className="container-page text-h2 reveal">
        {t("detailsTitle")}
      </h2>
      <ul className="container-page mt-[clamp(2rem,4vw,3.5rem)] grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {details.map((d) => (
          <li key={d.src} className="reveal relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] bg-limestone">
            <Image src={d.src} alt={d.alt[locale]} fill sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw" className="object-cover" />
          </li>
        ))}
      </ul>
    </section>
  );
}
