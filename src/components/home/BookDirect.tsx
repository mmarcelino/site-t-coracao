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
 * Why book direct: four perks framed as hospitality, never as discounts. Branch hero-lines: a
 * full-width stone band, each perk led by its icon under a hairline.
 */
export async function BookDirect() {
  const t = await getTranslations("home");
  const locale = (await getLocale()) as Locale;
  const items = homePerks.flatMap(({ id, icon }) => {
    const perk = perks.find((p) => p.id === id);
    return perk ? [{ perk, icon }] : [];
  });
  // Best rate leads (the main reason to book direct); the other three follow, smaller.
  const [lead, ...rest] = items;

  return (
    <section aria-labelledby="direct-title" className="bg-wash">
      <div className="container-page section-y-tight">
        <h2 id="direct-title" className="text-h1 reveal">
          {t("directTitle")}
        </h2>
        {lead ? (
          /* The main reason to book direct, given the room: large, on its own rule. */
          <div className="reveal mt-14 grid gap-6 border-t border-ink/20 pt-6 lg:mt-20 lg:grid-cols-12 lg:gap-10">
            <h3 className="text-h2 max-w-[16ch] lg:col-span-7">{lead.perk.title[locale]}</h3>
            <p className="text-lead max-w-md lg:col-span-5 lg:pt-3">{lead.perk.body[locale]}</p>
          </div>
        ) : null}
        <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-3 lg:mt-16">
          {rest.map(({ perk, icon }) => (
            <li key={perk.id} className="reveal border-t border-ink/20 pt-5">
              <span className="grid size-10 place-items-center rounded-full border border-ink/40">
                <Icon name={icon} size={18} />
              </span>
              <h3 className="mt-6 text-[1.125rem] leading-[1.2]">{perk.title[locale]}</h3>
              <p className="mt-2 max-w-xs text-small">{perk.body[locale]}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
