import { getLocale, getTranslations } from "next-intl/server";
import { Icon, type IconName } from "@/components/ui/Icon";
import { perks, type Perk } from "@/content/perks";
import type { Locale } from "@/i18n/routing";

const homePerks: Array<{ id: Perk["id"]; icon: IconName }> = [
  { id: "best-rate", icon: "tag" },
  { id: "flexible", icon: "calendar" },
  { id: "welcome", icon: "gift" },
  { id: "concierge", icon: "whatsapp" },
];

/**
 * Why book direct: four perks framed as hospitality, never as discounts. Branch ahotels: the one
 * full yellow block on the page, with numbered perks under heavy ink rules.
 */
export async function BookDirect() {
  const t = await getTranslations("home");
  const locale = (await getLocale()) as Locale;
  const items = homePerks.flatMap(({ id, icon }) => {
    const perk = perks.find((p) => p.id === id);
    return perk ? [{ perk, icon }] : [];
  });

  return (
    <section aria-labelledby="direct-title" className="bg-pop text-ink">
      <div className="container-page section-y-tight">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="direct-title" className="text-h1 reveal lg:col-span-6">
            {t("directTitle")}
          </h2>
          <p className="text-lead reveal max-w-xl lg:col-span-5 lg:col-start-8">{t("directBody")}</p>
        </div>
        <ol className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {items.map(({ perk, icon }, i) => (
            <li key={perk.id} className="reveal border-t-2 border-ink pt-5">
              <div className="flex items-center justify-between">
                <span className="text-[0.8125rem] font-semibold tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="grid size-12 place-items-center rounded-full bg-ink text-pop">
                  <Icon name={icon} size={22} />
                </span>
              </div>
              <h3 className="mt-10 text-[1.375rem] leading-[1.1]">{perk.title[locale]}</h3>
              <p className="mt-3 max-w-xs">{perk.body[locale]}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
