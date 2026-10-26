import { getLocale, getTranslations } from "next-intl/server";
import { perks, type Perk } from "@/content/perks";
import type { Locale } from "@/i18n/routing";
import { Icon, type IconName } from "@/components/ui/Icon";

const homePerks: Array<{ id: Perk["id"]; icon: IconName }> = [
  { id: "best-rate", icon: "tag" },
  { id: "flexible", icon: "refresh" },
  { id: "welcome", icon: "gift" },
  { id: "concierge", icon: "whatsapp" },
];

/** Why book direct: four perks, small icons, short copy. Hospitality, never discounts. */
export async function BookDirect() {
  const t = await getTranslations("home");
  const locale = (await getLocale()) as Locale;
  const items = homePerks
    .map(({ id, icon }) => ({ icon, perk: perks.find((p) => p.id === id) }))
    .filter((x): x is { icon: IconName; perk: Perk } => Boolean(x.perk));

  return (
    <section aria-labelledby="direct-title" className="bg-wash">
      <div className="container-page section-y-tight">
        <h2 id="direct-title" className="text-h2 reveal">
          {t("directTitle")}
        </h2>
        <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon, perk }) => (
            <li key={perk.id} className="reveal border-t-2 border-ink pt-6">
              <span className="grid size-11 place-items-center rounded-full bg-white">
                <Icon name={icon} size={22} />
              </span>
              <h3 className="text-h3 mt-6">{perk.title[locale]}</h3>
              <p className="mt-3 text-ink-soft-text">{perk.body[locale]}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
