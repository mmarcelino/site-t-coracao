import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { experiences } from "@/content/experiences";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { createFormatter } from "@/lib/format";
import { Carousel } from "@/components/Carousel";
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

      {/* Bleeds to the screen edge so the next card peeks in; arrows below, on the page margin. */}
      <Carousel
        prevLabel={t("experiencesPrev")}
        nextLabel={t("experiencesNext")}
        scrollClassName="mt-10 px-[var(--gutter)] pb-2 [scroll-padding-inline:var(--gutter)] lg:px-[max(var(--gutter),calc((100vw-var(--page-max))/2+var(--gutter)))]"
        controlsClassName="container-page"
      >
        <ul aria-label={t("experiencesLabel")} className="flex items-stretch gap-4">
          {items.map((item) => (
            <li key={item.id} className="w-[min(78vw,21rem)] shrink-0 snap-start">
              {/* One card: a clean photo on top, the copy inside the card below it (readable on any photo). */}
              <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-ink/10 bg-paper">
                <div className="relative aspect-[4/3] bg-sand">
                  {item.image ? (
                    <Image
                      src={item.image.src}
                      alt={item.image.alt[locale]}
                      fill
                      sizes="(min-width: 640px) 21rem, 78vw"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <p className="text-small text-granite">
                    {item.partner ? t("experienceWith", { partner: item.partner }) : item.category === "porto" ? t("experienceInPorto") : t("experienceBeyond")}
                  </p>
                  <h3 className="mt-1 text-[1.375rem] leading-[1.2] font-semibold tracking-[-0.01em] normal-case">{item.title[locale]}</h3>
                  <p className="mt-2 text-granite">{item.summary[locale]}</p>
                  {item.priceFrom ? (
                    <p className="mt-auto pt-4 text-small font-semibold">
                      {t("experiencesFrom", { price: format.money(item.priceFrom.amount) })} ·{" "}
                      {item.priceFrom.per === "person" ? t("experiencesPerPerson") : t("experiencesPerGroup")}
                    </p>
                  ) : null}
                </div>
              </article>
            </li>
          ))}
          <li className="w-[min(78vw,21rem)] shrink-0 snap-start">
            <Link
              href="/experiences"
              className="group flex h-full flex-col justify-end rounded-[var(--radius-card)] bg-pop p-6 text-ink"
            >
              <Icon
                name="arrowRight"
                size={40}
                strokeWidth={1.75}
                className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)] group-hover:translate-x-2"
              />
              <span className="mt-4 text-[1.375rem] leading-[1.2] font-semibold">{t("experiencesAll")}</span>
            </Link>
          </li>
        </ul>
      </Carousel>
    </section>
  );
}
