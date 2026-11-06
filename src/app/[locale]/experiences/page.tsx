import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { experiences, experiencesPage as copy, type Experience } from "@/content/experiences";
import { faqFor } from "@/content/faq";
import { siteUrl } from "@/content/site";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { createFormatter } from "@/lib/format";
import { alternates } from "@/lib/seo";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { ExperienceRequestForm } from "@/components/forms/ExperienceRequestForm";
import { PageIntro } from "@/components/page/PageIntro";
import { Icon } from "@/components/ui/Icon";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await rootLocale()) as Locale;
  return { title: copy.meta.title[locale], description: copy.meta.description[locale], alternates: alternates(locale, "/experiences") };
}

const arrowMove = "transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)]";

/**
 * Experiences: where to start (three ways in) · in Porto · beyond Porto · the guest portal and the
 * team's own picks · "help me plan" (UI only) · FAQ excerpt. Tours with a photo are cards; the rest
 * are rows underneath, so missing photos never leave empty tiles.
 */
export default async function ExperiencesPage() {
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations("experiencesPage");
  const tw = await getTranslations("whatsapp");
  const format = createFormatter(locale);
  const questions = faqFor("experiences");

  const price = (e: Experience) => {
    if (e.priceFrom) {
      return `${t("from", { price: format.money(e.priceFrom.amount) })} · ${e.priceFrom.per === "person" ? t("perPerson") : t("perGroup")}`;
    }
    return e.id === "hop-on" ? t("priceVaries") : t("priceOnRequest");
  };

  const ask = (e: Experience) => (
    <WhatsAppLink
      message={t("askMessage", { experience: e.title[locale] })}
      page="experiences"
      icon={false}
      className="group inline-flex font-semibold"
    >
      {t("ask")}
      <Icon name="arrowRight" size={20} strokeWidth={1.75} className={`${arrowMove} group-hover:translate-x-1.5`} />
    </WhatsAppLink>
  );

  const group = (id: "porto" | "beyond", title: string, intro: string) => {
    const items = experiences.filter((e) => e.category === id);
    const withPhoto = items.filter((e) => e.image);
    const rest = items.filter((e) => !e.image);
    const single = withPhoto.length === 1;
    return (
      <section id={id} aria-labelledby={`${id}-title`} className="container-page section-y-tight scroll-mt-24">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id={`${id}-title`} className="text-h2 reveal lg:col-span-6">
            {title}
          </h2>
          <p className="text-lead lg:col-span-5 lg:col-start-8">{intro}</p>
        </div>
        {/* Photo cards side by side (four across in Porto); a single one (beyond Porto) sits beside the
            rows instead of alone on its own line. Tours without a photo are rows. */}
        <div className={single ? "mt-12 grid gap-14 lg:mt-16 lg:grid-cols-12 lg:gap-x-6" : undefined}>
          <ul
            className={
              single
                ? "lg:col-span-5"
                : "mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
            }
          >
            {withPhoto.map((e) => (
              <li key={e.id} className="reveal flex h-full flex-col">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-sand">
                  <Image
                    src={e.image!.src}
                    alt={e.image!.alt[locale]}
                    fill
                    sizes={single ? "(min-width: 1024px) 40vw, 100vw" : "(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 100vw"}
                    className="object-cover [filter:saturate(0.58)_sepia(0.14)_contrast(0.92)_brightness(1.04)]"
                  />
                </div>
                <div className="mt-5 flex flex-1 flex-col border-t-2 border-ink pt-4">
                  <h3 className="card-title">{e.title[locale]}</h3>
                  {e.partner ? <p className="label mt-2 text-granite">{t("with", { partner: e.partner })}</p> : null}
                  <p className="mt-3">{e.summary[locale]}</p>
                  <div className="mt-auto flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pt-5">
                    <p className="text-small text-granite">{price(e)}</p>
                    {ask(e)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {rest.length ? (
            <ul className={single ? "self-start border-t-2 border-ink lg:col-span-6 lg:col-start-7" : "mt-14 border-t-2 border-ink"}>
              {rest.map((e) => (
                <li
                  key={e.id}
                  className={
                    single
                      ? "border-b border-ink/15 py-6"
                      : "grid gap-x-8 gap-y-2 border-b border-ink/15 py-6 md:grid-cols-12 md:items-baseline"
                  }
                >
                  <h3 className={single ? "card-title" : "card-title md:col-span-4"}>{e.title[locale]}</h3>
                  <p className={single ? "mt-2" : "md:col-span-5"}>{e.summary[locale]}</p>
                  <div
                    className={
                      single
                        ? "mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2"
                        : "flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 md:col-span-3 md:flex-col md:items-end"
                    }
                  >
                    <p className={single ? "text-small text-granite" : "text-small text-granite md:text-right"}>{price(e)}</p>
                    {ask(e)}
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    );
  };

  return (
    <>
      <PageIntro
        title={copy.title[locale]}
        lead={copy.lead[locale]}
        image={{ src: copy.image.src, alt: copy.image.alt[locale] }}
      />

      <nav aria-label={t("pathsLabel")} className="container-page section-y-tight">
        <ul className="grid gap-10 md:grid-cols-3 md:gap-8">
          {copy.paths.map((p) => (
            <li key={p.id} className="reveal">
              <a href={`#${p.id}`} className="group block border-t-2 border-ink pt-5">
                <span className="flex items-start justify-between gap-4">
                  <span className="card-title">{p.title[locale]}</span>
                  <Icon name="arrowDown" size={24} strokeWidth={1.75} className={`shrink-0 ${arrowMove} group-hover:translate-y-1`} />
                </span>
                <span className="mt-3 block max-w-xs">{p.body[locale]}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {group("porto", copy.porto.title[locale], copy.porto.intro[locale])}
      {group("beyond", copy.beyond.title[locale], copy.beyond.intro[locale])}

      <section aria-labelledby="portal-title" className="mt-[clamp(3rem,6vw,5rem)] bg-sand">
        <div className="container-page section-y-tight grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="portal-title" className="text-h2 reveal">
              {copy.portal.title[locale]}
            </h2>
            <p className="text-lead mt-6">{copy.portal.body[locale]}</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="border-t-2 border-ink">
              {copy.portal.points.map((p) => (
                <li key={p.en} className="flex items-start gap-4 border-b border-ink/15 py-4">
                  <Icon name="check" size={20} strokeWidth={2} className="mt-0.5 shrink-0" />
                  {p[locale]}
                </li>
              ))}
            </ul>
            <p className="mt-8">{copy.portal.note[locale]}</p>
            <WhatsAppLink message={tw("messageGeneric")} page="experiences" className="link-quiet mt-4 inline-flex font-semibold">
              {tw("cta")}
            </WhatsAppLink>

            <h3 className="label mt-14 text-granite">{copy.links.title[locale]}</h3>
            <ul className="mt-4 border-t border-ink/15">
              {copy.links.items.map((l) => (
                <li key={l.href} className="border-b border-ink/15">
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="group flex items-start justify-between gap-6 py-4">
                    <span>
                      <span className="block font-semibold">{l.title[locale]}</span>
                      <span className="mt-1 block">{l.body[locale]}</span>
                    </span>
                    <Icon name="arrowUpRight" size={22} strokeWidth={1.75} className={`mt-0.5 shrink-0 ${arrowMove} group-hover:-translate-y-0.5 group-hover:translate-x-0.5`} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="plan" aria-labelledby="plan-title" className="container-page section-y grid scroll-mt-24 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="plan-title" className="text-h2 reveal">
            {copy.form.title[locale]}
          </h2>
          <p className="text-lead mt-6">{copy.form.body[locale]}</p>
          <WhatsAppLink message={t("messagePlan")} page="experiences" className="link-quiet mt-8 inline-flex font-semibold">
            {tw("cta")}
          </WhatsAppLink>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <ExperienceRequestForm experiences={experiences.map((e) => ({ value: e.id, label: e.title[locale] }))} />
        </div>
      </section>

      {questions.length ? (
        <section aria-labelledby="faq-title" className="container-page section-y-tight grid gap-12 lg:grid-cols-12">
          <h2 id="faq-title" className="text-h2 reveal lg:col-span-4">
            {(await getTranslations("faqPage"))("title")}
          </h2>
          <div className="lg:col-span-8">
            <FaqList items={questions} locale={locale} />
            <Link href="/faq" className="group mt-8 inline-flex items-center gap-4 font-semibold">
              {(await getTranslations("home"))("faqCta")}
              <Icon name="arrowRight" size={24} strokeWidth={1.75} className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)] group-hover:translate-x-2" />
            </Link>
          </div>
        </section>
      ) : null}

      <JsonLd
        data={experiences.map((e) => ({
          "@context": "https://schema.org",
          "@type": "TouristTrip",
          name: e.title[locale],
          description: e.summary[locale],
          ...(e.image ? { image: new URL(e.image.src, siteUrl).toString() } : {}),
          provider: { "@id": `${siteUrl}/#organization` },
          ...(e.priceFrom
            ? { offers: { "@type": "Offer", price: e.priceFrom.amount, priceCurrency: "EUR" } }
            : {}),
        }))}
      />
    </>
  );
}
