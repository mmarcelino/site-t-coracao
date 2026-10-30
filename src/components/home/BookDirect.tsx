import { getLocale, getTranslations } from "next-intl/server";
import { perks, type Perk } from "@/content/perks";
import type { Locale } from "@/i18n/routing";

const homePerks: Perk["id"][] = ["best-rate", "flexible", "welcome", "secure-payment"];

/**
 * Why book direct: four perks framed as hospitality, never as discounts. Branch hero-lines: a
 * full-width stone band, each perk a title under a hairline (no icons).
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
        <ol className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {items.map(({ perk }) => (
            <li key={perk.id} className="reveal border-t border-ink/20 pt-6">
              <h3 className="text-[1.625rem] leading-[1.1]">{perk.title[locale]}</h3>
              <p className="mt-3 max-w-xs">{perk.body[locale]}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
