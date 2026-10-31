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

  const title = t("experiencesTitle");
  const comma = title.indexOf(",");
  const titleLead = title.slice(0, comma);
  const titleRest = title.slice(comma + 1).trim();

  return (
    <section aria-labelledby="experiences-title" className="section-y-tight">
      <div className="container-page">
        {/* Two lines from lg up, split at the comma: the place, then the promise. */}
        <h2
          id="experiences-title"
          className="reveal text-[clamp(2.25rem,1.4rem+2.6vw,3.5rem)] leading-[1.05] tracking-[-0.02em]"
        >
          <span className="lg:block">{titleLead},</span> <span className="lg:block">{titleRest}</span>
        </h2>
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
              {/* A rounded photo, then the copy under a 2px ink rule (the page's pattern for perks, steps and quotes). */}
              <article className="flex h-full flex-col">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-sand">
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
                <div className="mt-5 flex flex-1 flex-col border-t-2 border-ink pt-4">
                  <h3 className="text-[1.375rem] leading-[1.2] font-semibold tracking-[-0.01em] normal-case">{item.title[locale]}</h3>
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
              className="group flex aspect-[4/3] flex-col justify-end rounded-[var(--radius-card)] bg-pop p-6 text-ink"
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
