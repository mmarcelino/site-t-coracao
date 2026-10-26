import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { experiences } from "@/content/experiences";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { createFormatter } from "@/lib/format";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const featured = ["food-walk", "douro-boat", "douro-valley", "cooking-class"];

export async function ExperiencesTeaser() {
  const t = await getTranslations("home");
  const locale = (await getLocale()) as Locale;
  const format = createFormatter(locale);
  const items = featured
    .map((id) => experiences.find((e) => e.id === id))
    .filter((e): e is (typeof experiences)[number] => Boolean(e));

  return (
    <section aria-labelledby="experiences-title" className="container-page section-y">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="reveal relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-limestone lg:col-span-6">
          <Image
            src="/images/placeholder/site-experiences.jpg"
            alt={t("experiencesImageAlt")}
            fill
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <div className="reveal">
            <h2 id="experiences-title" className="text-h1">
              {t("experiencesTitle")}
            </h2>
            <p className="text-lead mt-6 text-granite">{t("experiencesBody")}</p>
          </div>
          <ul className="mt-10 border-t-2 border-ink">
            {items.map((item) => (
              <li key={item.id} className="reveal flex items-baseline justify-between gap-6 border-b border-ink/15 py-5">
                <div>
                  <h3 className="text-lead font-semibold">{item.title[locale]}</h3>
                  {item.partner ? <p className="text-small mt-1 text-granite">{item.partner}</p> : null}
                </div>
                {item.priceFrom ? (
                  <p className="text-small shrink-0 text-right text-granite">
                    {t("experiencesFrom", {
                      price: format.money(item.priceFrom.amount),
                    })}
                    <br />
                    {item.priceFrom.per === "person" ? t("experiencesPerPerson") : t("experiencesPerGroup")}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
          <Link href="/experiences" className={buttonClasses("primary", "lg", "mt-10")}>
            <Icon name="arrowUpRight" size={18} />
            {t("experiencesCta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
