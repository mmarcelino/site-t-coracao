import clsx from "clsx";
import { getLocale, getTranslations } from "next-intl/server";
import { experiences } from "@/content/experiences";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { createFormatter } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";

const featured = ["douro-valley", "food-walk", "douro-boat", "cooking-class", "yacht"];
// Colour tiles until each partner tour has its own photography (TO CONFIRM with the client).
const tones = ["bg-ink text-paper", "bg-wash text-ink", "bg-sand text-ink", "bg-wash text-ink", "bg-ink text-paper"];

/** A horizontal strip of partner tours: positions the team as hosts, not just landlords. */
export async function ExperiencesStrip() {
  const t = await getTranslations("home");
  const locale = (await getLocale()) as Locale;
  const format = createFormatter(locale);
  const items = featured
    .map((id) => experiences.find((e) => e.id === id))
    .filter((e): e is (typeof experiences)[number] => Boolean(e));

  return (
    <section aria-labelledby="experiences-title" className="section-y-tight">
      <div className="container-page grid gap-6 lg:grid-cols-12 lg:items-end">
        <h2 id="experiences-title" className="text-h2 reveal lg:col-span-7">
          {t("experiencesTitle")}
        </h2>
        <p className="text-lead text-granite lg:col-span-5">{t("experiencesBody")}</p>
      </div>

      <ul
        aria-label={t("experiencesLabel")}
        className="scrollbar-none mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2 [scroll-padding-inline:var(--gutter)] lg:px-[max(var(--gutter),calc((100vw-var(--page-max))/2+var(--gutter)))]"
      >
        {items.map((item, i) => (
          <li key={item.id} className="w-[min(78vw,22rem)] shrink-0 snap-start">
            <article
              className={clsx(
                "flex aspect-[4/5] flex-col justify-between rounded-[var(--radius-card)] p-6",
                tones[i % tones.length],
                i % tones.length === 0 || i % tones.length === 4 ? "on-dark" : undefined,
              )}
            >
              <p className="text-[0.8125rem] font-semibold opacity-80">
                {item.category === "porto" ? t("experienceInPorto") : t("experienceBeyond")}
                {item.partner ? ` · ${item.partner}` : null}
              </p>
              <div>
                <h3 className="text-h3">{item.title[locale]}</h3>
                <p className="mt-3 opacity-85">{item.summary[locale]}</p>
                {item.priceFrom ? (
                  <p className="mt-5 text-small font-semibold">
                    {t("experiencesFrom", { price: format.money(item.priceFrom.amount) })} ·{" "}
                    {item.priceFrom.per === "person" ? t("experiencesPerPerson") : t("experiencesPerGroup")}
                  </p>
                ) : null}
              </div>
            </article>
          </li>
        ))}
        <li className="w-[min(78vw,22rem)] shrink-0 snap-start">
          <Link
            href="/experiences"
            className="flex aspect-[4/5] flex-col justify-end rounded-[var(--radius-card)] border-2 border-ink p-6 transition-colors hover:bg-ink hover:text-paper"
          >
            <Icon name="arrowUpRight" size={40} strokeWidth={1.75} />
            <span className="text-h3 mt-4">{t("experiencesAll")}</span>
          </Link>
        </li>
      </ul>
    </section>
  );
}
