import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { experiences } from "@/content/experiences";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { createFormatter } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";

const featured = ["douro-valley", "food-walk", "douro-boat", "cooking-class", "yacht"];

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
        {items.map((item) => (
          <li key={item.id} className="w-[min(78vw,22rem)] shrink-0 snap-start">
            {/* Photo tile, like the collection cards: label pill on top, copy on a soft shade. */}
            <article className="on-dark relative isolate flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[var(--radius-card)] bg-ink p-6 text-paper">
              {item.image ? (
                <Image
                  src={item.image.src}
                  alt={item.image.alt[locale]}
                  fill
                  sizes="(min-width: 640px) 22rem, 78vw"
                  className="-z-10 object-cover"
                />
              ) : null}
              <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(27,26,24,0)_35%,rgba(27,26,24,0.8)_100%)]" />
              <p className="label self-start rounded-full bg-paper px-3 py-1.5 text-ink">
                {item.category === "porto" ? t("experienceInPorto") : t("experienceBeyond")}
                {item.partner ? ` · ${item.partner}` : null}
              </p>
              <div>
                <h3 className="text-h3">{item.title[locale]}</h3>
                <p className="mt-3 text-paper/85">{item.summary[locale]}</p>
                {item.priceFrom ? (
                  <p className="mt-5 text-small">
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
            className="group flex aspect-[4/5] flex-col justify-end rounded-[var(--radius-card)] bg-wash p-6 text-ink"
          >
            <Icon
              name="arrowRight"
              size={40}
              strokeWidth={1.75}
              className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)] group-hover:translate-x-2"
            />
            <span className="text-h3 mt-4">{t("experiencesAll")}</span>
          </Link>
        </li>
      </ul>
    </section>
  );
}
