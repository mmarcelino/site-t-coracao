import { getLocale, getTranslations } from "next-intl/server";
import { perks, type Perk } from "@/content/perks";
import type { Locale } from "@/i18n/routing";

const homePerks: Perk["id"][] = ["best-rate", "flexible", "welcome", "secure-payment"];

/**
 * Why book direct: four perks framed as hospitality, never as discounts. Branch hero-lines: a
 * full-width stone band, the perks as a quiet index of lines.
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
        {/* A quiet index: each perk one line, the title left and the detail right, aligned at the top. */}
        <ol className="mt-12 border-b border-ink/15 lg:mt-16">
          {items.map(({ perk }) => (
            <li
              key={perk.id}
              className="reveal grid gap-2 border-t border-ink/15 py-7 md:grid-cols-12 md:gap-10 md:py-9"
            >
              <h3 className="text-[clamp(1.375rem,1.15rem+0.8vw,1.75rem)] leading-[1.2] tracking-[-0.01em] md:col-span-6">
                {perk.title[locale]}.
              </h3>
              <p className="max-w-md text-ink-soft-text md:col-span-6 md:pt-1">{perk.body[locale]}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
