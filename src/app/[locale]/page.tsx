import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { faqFor } from "@/content/faq";
import { site } from "@/content/site";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { heroSlides } from "@/content/featured";
import { getListings, getReviewSummary, getReviews } from "@/lib/data";
import { createFormatter } from "@/lib/format";
import { alternates, ogLocale } from "@/lib/seo";
import { FaqList } from "@/components/FaqList";
import { BookDirect } from "@/components/home/BookDirect";
import { Collections } from "@/components/home/Collections";
import { ExperiencesStrip } from "@/components/home/ExperiencesStrip";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Intro } from "@/components/home/Intro";
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
      images: [{ url: "/images/placeholder/casa-do-farol-09.jpg", width: 2400, height: 1602 }],
    },
  };
}

/**
 * Home, in order: hero + search · intro line · collections · why book direct · reviews ·
 * how it works · experiences · FAQ excerpt (footer comes from the layout).
 */
export default async function HomePage() {
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations("home");
  const tr = await getTranslations("reviews");
  const tTags = await getTranslations("tags");
  const [listings, summary, reviews] = await Promise.all([
    getListings(locale),
    getReviewSummary(locale),
    getReviews(locale, { limit: 12 }),
  ]);
  const maxGuests = Math.max(...listings.map((l) => l.accommodates));
  const format = createFormatter(locale);
  // One slide per collection: a home that really carries the tag, shown with a fitting photo.
  const slides = heroSlides.flatMap(({ tag, slug, image, alt }) =>
    listings.some((l) => l.slug === slug && l.tags.includes(tag))
      ? [{ key: tag, label: tTags(tag), image: { src: image, alt: alt[locale] } }]
      : [],
  );
  // Hero: the Google rating, as shown on Google (whole business, checkable by guests).
  const google = summary.bySource.google;
  const rating = {
    score: format.number(google.score, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    count: format.number(google.count),
    mock: google.mock,
  };

  return (
    <>
      <Hero maxGuests={maxGuests} slides={slides} rating={rating} />

      <Intro />

      <Collections listings={listings} />

      <BookDirect />

      <section aria-labelledby="reviews-title" className="container-page section-y">
        {/* Google now; Airbnb and Booking.com aggregates join when Guesty is connected. */}
        <ReviewsBlock
          overall={summary.bySource.google}
          bySource={summary.bySource}
          reviews={reviews}
          heading={tr("title")}
          headingId="reviews-title"
        />
      </section>

      <HowItWorks />

      <ExperiencesStrip />

      <section aria-labelledby="faq-title">
        <div className="container-page section-y grid gap-12 lg:grid-cols-12">
          <h2 id="faq-title" className="text-h2 reveal lg:col-span-4">
            {t("faqTitle")}
          </h2>
          <div className="lg:col-span-8">
            <FaqList items={faqFor("home")} locale={locale} />
            {/* The way on, after the last question. */}
            <Link href="/faq" className="group mt-8 inline-flex items-center gap-4">
              {t("faqCta")}
              <span className="grid size-10 place-items-center rounded-full border border-current transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)] group-hover:translate-x-2">
                <Icon name="arrowRight" size={20} />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
