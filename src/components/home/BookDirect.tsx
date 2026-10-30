import { getLocale, getTranslations } from "next-intl/server";
import { perks, type Perk } from "@/content/perks";
import type { Locale } from "@/i18n/routing";

const homePerks: Perk["id"][] = ["best-rate", "flexible", "welcome", "secure-payment"];

/**
 * Why book direct: four perks framed as hospitality, never as discounts. Branch hero-lines: a
 * full-width stone band, the perks as a manifesto of large, light lines.
 */
export async function BookDirect() {
  const t = await getTranslations("home");
  const locale = (await getLocale()) as Locale;
  const items = homePerks.flatMap((id) => {
    const perk = perks.find((p) => p.id === id);
    return perk ? [{ perk }] : [];
  });

  return (
    <section aria-labelledby="direct-title" className="bg-wash">
      <div className="container-page section-y-tight">
        <h2 id="direct-title" className="text-h1 reveal">
          {t("directTitle")}
        </h2>
        {/* A manifesto: each perk one large, light line, with the detail small on the right. */}
        <ol className="mt-12 border-b border-ink/20 lg:mt-16">
          {items.map(({ perk }) => (
            <li
              key={perk.id}
              className="reveal grid gap-3 border-t border-ink/20 py-6 md:grid-cols-12 md:items-baseline md:gap-10 md:py-8"
            >
              <h3 className="text-[clamp(1.875rem,1.2rem+2.6vw,3.5rem)] leading-[1.05] tracking-[-0.025em] md:col-span-7">
                {perk.title[locale]}.
              </h3>
              <p className="max-w-md text-ink-soft-text md:col-span-5">{perk.body[locale]}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
