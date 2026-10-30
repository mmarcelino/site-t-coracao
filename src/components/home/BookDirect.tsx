import Image from "next/image";
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

  return (
    <section aria-labelledby="direct-title" className="bg-wash">
      <div className="container-page section-y-tight">
        {/* Title on the left; a small, human photo fills the space on the right (placeholder until the
            client's own shot of the welcome gift or the team). */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 id="direct-title" className="text-h1 reveal lg:col-span-7">
            {t("directTitle")}
          </h2>
          <div className="reveal relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] lg:col-span-4 lg:col-start-9">
            <Image
              src="/images/placeholder/casa-do-farol-08.jpg"
              alt={locale === "pt" ? "Recanto de leitura com cadeirão, livros e uma obra de arte vermelha junto à janela" : "A reading corner with an armchair, books and a red artwork by the window"}
              fill
              sizes="(min-width: 1024px) 30vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <ol className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {items.map(({ perk, icon }) => (
            <li key={perk.id} className="reveal border-t border-ink/20 pt-5">
              <span className="grid size-12 place-items-center rounded-full border border-ink/40">
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
