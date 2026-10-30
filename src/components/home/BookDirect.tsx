import { getLocale, getTranslations } from "next-intl/server";
import { Icon, type IconName } from "@/components/ui/Icon";
import { perks, type Perk } from "@/content/perks";
import type { Locale } from "@/i18n/routing";

const homePerks: Array<{ id: Perk["id"]; icon: IconName }> = [
  { id: "best-rate", icon: "tag" },
  { id: "flexible", icon: "calendar" },
  { id: "welcome", icon: "gift" },
  { id: "secure-payment", icon: "lock" },
];

/**
 * Why book direct: four perks framed as hospitality, never as discounts. Branch hero-lines: the one
 * light-blue panel on the page (inside the margins, same curve as the cards), each perk led by its icon
 * under an ink rule.
 */
export async function BookDirect() {
  const t = await getTranslations("home");
  const locale = (await getLocale()) as Locale;
  const items = homePerks.flatMap(({ id, icon }) => {
    const perk = perks.find((p) => p.id === id);
    return perk ? [{ perk, icon }] : [];
  });

  return (
    <section aria-labelledby="direct-title" className="container-page">
      <div className="rounded-[var(--radius-card)] bg-pop px-[var(--gutter)] py-[clamp(3rem,6vw,6rem)] text-ink">
        <h2 id="direct-title" className="text-h1 reveal">
          {t("directTitle")}
        </h2>
        <ol className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {items.map(({ perk, icon }) => (
            <li key={perk.id} className="reveal border-t-2 border-ink pt-5">
              <span className="grid size-12 place-items-center rounded-full bg-ink text-pop">
                <Icon name={icon} size={22} />
              </span>
              <h3 className="mt-8 text-[1.375rem] leading-[1.1]">{perk.title[locale]}</h3>
              <p className="mt-3 max-w-xs">{perk.body[locale]}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
