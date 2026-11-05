import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { faq, faqTopics, type FaqTopic } from "@/content/faq";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { alternates } from "@/lib/seo";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { PageIntro } from "@/components/page/PageIntro";
import { buttonClasses } from "@/components/ui/Button";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations("faqPage");
  return { title: t("metaTitle"), description: t("metaDescription"), alternates: alternates(locale, "/faq") };
}

/**
 * The full FAQ (CLAUDE.md §10), grouped by topic, with topic links up top and one FAQPage JSON-LD
 * for the whole page. Same `<details>` rows as the excerpts elsewhere.
 */
export default async function FaqPage() {
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations("faqPage");
  const tw = await getTranslations("whatsapp");
  const topics = (Object.keys(faqTopics) as FaqTopic[])
    .map((topic) => ({ topic, items: faq.filter((item) => item.topic === topic) }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")}>
        <nav aria-label={t("topicsLabel")} className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {topics.map(({ topic }) => (
              <li key={topic}>
                <a
                  href={`#${topic}`}
                  className="inline-flex h-10 items-center rounded-full border border-ink/20 px-4 text-[0.9375rem] transition-colors duration-[var(--duration-fast)] hover:border-ink"
                >
                  {faqTopics[topic][locale]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageIntro>

      <div className="container-page section-y-tight space-y-[clamp(4rem,8vw,7rem)]">
        {topics.map(({ topic, items }) => (
          <section key={topic} id={topic} aria-labelledby={`${topic}-title`} className="grid scroll-mt-24 gap-8 lg:grid-cols-12">
            <h2 id={`${topic}-title`} className="text-h3 lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
              {faqTopics[topic][locale]}
            </h2>
            <div className="lg:col-span-8">
              <FaqList items={items} locale={locale} withJsonLd={false} />
            </div>
          </section>
        ))}
      </div>

      <section aria-labelledby="more-title" className="bg-sand">
        <div className="container-page section-y-tight grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 id="more-title" className="text-h2 reveal">
              {t("moreTitle")}
            </h2>
            <p className="text-lead mt-6 max-w-2xl">{t("moreBody", { email: site.email })}</p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:justify-self-end">
            <WhatsAppLink message={tw("messageGeneric")} page="faq" className={buttonClasses("primary", "lg")}>
              {tw("cta")}
            </WhatsAppLink>
          </div>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question[locale],
            acceptedAnswer: { "@type": "Answer", text: item.answer[locale] },
          })),
        }}
      />
    </>
  );
}
