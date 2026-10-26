import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { faqFor } from "@/content/faq";
import { site } from "@/content/site";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getBuildings, getListings, getNeighbourhoods, getReviewSummary, getReviews } from "@/lib/data";
import { createFormatter } from "@/lib/format";
import { alternates, ogLocale } from "@/lib/seo";
import { FaqList } from "@/components/FaqList";
import { BookDirect } from "@/components/home/BookDirect";
import { BuildingsSection } from "@/components/home/BuildingsSection";
import { ExperiencesTeaser } from "@/components/home/ExperiencesTeaser";
import { Hero } from "@/components/home/Hero";
import { NeighbourhoodsTeaser } from "@/components/home/NeighbourhoodsTeaser";
import { OwnersTeaser } from "@/components/home/OwnersTeaser";
import { ReviewsBlock } from "@/components/ReviewsBlock";
import { Icon } from "@/components/ui/Icon";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations("home");
  return {
    title: { absolute: t("metaTitle") },
    description: t("metaDescription"),
    alternates: alternates(locale, "/"),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      type: "website",
      locale: ogLocale[locale],
      siteName: site.name,
      images: [{ url: "/images/placeholder/cordoaria-garden-01.jpg", width: 2400, height: 1599 }],
    },
  };
}

export default async function HomePage() {
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations("home");
  const tr = await getTranslations("reviews");
  const format = createFormatter(locale);
  const [listings, buildings, neighbourhoods, summary, reviews] = await Promise.all([
    getListings(locale),
    getBuildings(locale),
    getNeighbourhoods(locale),
    getReviewSummary(locale),
    getReviews(locale, { limit: 3 }),
  ]);
  const maxGuests = Math.max(...listings.map((l) => l.accommodates));

  const facts = [
    { value: String(site.foundedYear), label: t("factSince") },
    { value: "40+", label: t("factApartments") },
    { value: format.number(summary.overall.score, { minimumFractionDigits: 1 }), label: t("factRating") },
  ];

  return (
    <>
      <Hero maxGuests={maxGuests} />

      <section aria-labelledby="intro-title" className="container-page section-y">
        <div className="grid gap-12 lg:grid-cols-12">
          <p id="intro-title" className="label text-granite lg:col-span-3">
            {t("introEyebrow")}
          </p>
          <div className="reveal lg:col-span-9">
            <p className="text-statement max-w-[34ch] font-light">{t("intro")}</p>
            <Link href="/about" className="text-lead mt-8 inline-flex items-center gap-3 link-quiet">
              {t("introLink")}
              <Icon name="arrowRight" size={20} />
            </Link>
          </div>
        </div>
        <dl className="mt-[clamp(3.5rem,7vw,6rem)] grid gap-10 border-t border-ink/15 pt-10 sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.value} className="reveal flex flex-col-reverse">
              <dt className="mt-2 text-granite">{fact.label}</dt>
              <dd className="text-h1 font-light tabular-nums">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <BuildingsSection buildings={buildings} listings={listings} neighbourhoods={neighbourhoods} />

      <BookDirect />

      <NeighbourhoodsTeaser neighbourhoods={neighbourhoods} />

      <section aria-labelledby="reviews-title" className="container-page section-y">
        <ReviewsBlock
          overall={summary.overall}
          bySource={summary.bySource}
          reviews={reviews}
          eyebrow={tr("eyebrow")}
          heading={tr("title")}
          headingId="reviews-title"
        />
      </section>

      <OwnersTeaser />

      <ExperiencesTeaser />

      <section aria-labelledby="faq-title" className="border-t border-ink/10">
        <div className="container-page section-y grid gap-12 lg:grid-cols-12">
          <div className="reveal lg:col-span-4">
            <p className="label mb-5 text-granite">{t("faqEyebrow")}</p>
            <h2 id="faq-title" className="text-h2">
              {t("faqTitle")}
            </h2>
            <Link href="/faq" className="text-lead mt-8 inline-flex items-center gap-3 link-quiet">
              {t("faqCta")}
              <Icon name="arrowRight" size={20} />
            </Link>
          </div>
          <div className="lg:col-span-8">
            <FaqList items={faqFor("home")} locale={locale} />
          </div>
        </div>
      </section>
    </>
  );
}
