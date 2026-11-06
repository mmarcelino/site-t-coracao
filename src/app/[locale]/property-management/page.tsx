import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { faqFor } from "@/content/faq";
import { ownerServices, ownersPage as copy } from "@/content/owners";
import { site } from "@/content/site";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getListings } from "@/lib/data";
import { createFormatter } from "@/lib/format";
import { alternates } from "@/lib/seo";
import { FaqList } from "@/components/FaqList";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { OwnerLeadForm } from "@/components/forms/OwnerLeadForm";
import { PageIntro } from "@/components/page/PageIntro";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await rootLocale()) as Locale;
  return { title: copy.meta.title[locale], description: copy.meta.description[locale], alternates: alternates(locale, "/property-management") };
}

/**
 * For owners: the positioning, with the operating scale near the top (CLAUDE.md §9) · two kinds of
 * owner · what sets us apart · the six services · lead form (UI only) · FAQ excerpt.
 */
export default async function OwnersPage() {
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations("ownersPage");
  const tw = await getTranslations("whatsapp");
  const format = createFormatter(locale);
  const listings = await getListings(locale);

  return (
    <>
      <PageIntro
        title={copy.title[locale]}
        lead={copy.lead[locale]}
        image={{ src: copy.image.src, alt: copy.image.alt[locale] }}
      >
        <p className="label mt-6 text-granite">
          {t("proof", { year: String(site.foundedYear), guests: format.number(site.guestsPerYear), homes: format.number(listings.length) })}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#contact" className={buttonClasses("primary", "lg")}>
            {copy.form.title[locale]}
          </a>
          <WhatsAppLink message={t("messageOwners")} page="owners" className={buttonClasses("secondary", "lg")}>
            {tw("cta")}
          </WhatsAppLink>
        </div>
      </PageIntro>

      <section aria-labelledby="audiences-title" className="container-page section-y">
        <h2 id="audiences-title" className="text-h2 reveal max-w-3xl">
          {copy.audiences.title[locale]}
        </h2>
        <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-8 lg:mt-16">
          {copy.audiences.items.map((a) => (
            <article key={a.title.en} className="reveal border-t-2 border-ink pt-5">
              <h3 className="text-h3 max-w-md">{a.title[locale]}</h3>
              <p className="mt-4 max-w-lg">{a.body[locale]}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="approach-title" className="container-page">
        <div className="rounded-[var(--radius-card)] bg-pop px-[var(--gutter)] py-[clamp(3rem,6vw,6rem)] text-ink">
          <h2 id="approach-title" className="text-h2 reveal">
            {copy.approach.title[locale]}
          </h2>
          <ul className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3 lg:mt-16">
            {copy.approach.items.map((a) => (
              <li key={a.title.en} className="reveal border-t-2 border-ink pt-5">
                <h3 className="card-title">{a.title[locale]}</h3>
                <p className="mt-3 max-w-xs">{a.body[locale]}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="services-title" className="container-page section-y">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="services-title" className="text-h2 reveal lg:col-span-7">
            {copy.services.title[locale]}
          </h2>
          <p className="text-lead lg:col-span-4 lg:col-start-9">{copy.services.intro[locale]}</p>
        </div>
        {/* The home page's timeline: the number cuts into each step's rule. */}
        <ol className="mt-[clamp(3rem,6vw,5rem)] grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {ownerServices.map((s, i) => (
            <li key={s.id} className="reveal relative border-t-2 border-ink pt-10">
              <span
                aria-hidden
                className="absolute top-0 left-0 grid h-12 -translate-y-1/2 items-center bg-paper pr-5 text-[1.75rem] leading-none font-semibold tabular-nums"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="card-title">{s.title[locale]}</h3>
              <p className="mt-3 max-w-sm">{s.body[locale]}</p>
              <ul className="mt-5 space-y-2 text-small">
                {s.details.map((d) => (
                  <li key={d.en} className="flex gap-3 before:mt-[0.6em] before:h-px before:w-3 before:shrink-0 before:bg-ink before:content-['']">
                    {d[locale]}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section id="contact" aria-labelledby="contact-title" className="scroll-mt-24 bg-sand">
        <div className="container-page section-y-tight grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="contact-title" className="text-h2 reveal">
              {copy.form.title[locale]}
            </h2>
            <p className="text-lead mt-6">{copy.form.body[locale]}</p>
            <div className="mt-8 space-y-2">
              <WhatsAppLink message={t("messageOwners")} page="owners" className="link-quiet inline-flex font-semibold">
                {tw("cta")}
              </WhatsAppLink>
              <p>
                <a href={`mailto:${site.email}`} className="link-quiet underline underline-offset-4">
                  {site.email}
                </a>
              </p>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <OwnerLeadForm />
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="container-page section-y grid gap-12 lg:grid-cols-12">
        <h2 id="faq-title" className="text-h2 reveal lg:col-span-4">
          {(await getTranslations("faqPage"))("title")}
        </h2>
        <div className="lg:col-span-8">
          <FaqList items={faqFor("owners")} locale={locale} />
          <Link href="/faq" className="group mt-8 inline-flex items-center gap-4 font-semibold">
            {(await getTranslations("home"))("faqCta")}
            <Icon name="arrowRight" size={24} strokeWidth={1.75} className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)] group-hover:translate-x-2" />
          </Link>
        </div>
      </section>
    </>
  );
}
