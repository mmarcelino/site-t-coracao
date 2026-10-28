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
    getReviews(locale, { limit: 4 }),
  ]);
  const maxGuests = Math.max(...listings.map((l) => l.accommodates));
  const format = createFormatter(locale);
  // One slide per collection: a home that really carries the tag, shown with a fitting photo.
  const slides = heroSlides.flatMap(({ tag, slug, image, alt }) =>
    listings.some((l) => l.slug === slug && l.tags.includes(tag))
      ? [{ key: tag, label: tTags(tag), image: { src: image, alt: alt[locale] } }]
      : [],
  );
  const rating = {
    score: format.number(summary.overall.score, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    count: format.number(summary.overall.count),
    mock: summary.overall.mock,
  };

  return (
    <>
      <Hero maxGuests={maxGuests} slides={slides} rating={rating} />

      {/* Everything below the hero, with the yellow hand-drawn line drawing itself as you scroll. */}
      <div className="relative">
        <svg
          aria-hidden
          viewBox="0 0 100 1000"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 z-20 size-full overflow-visible text-pop"
        >
          <path
            d="M96 0 C70 40 40 60 62 120 C84 180 20 220 30 300 C40 380 90 400 80 480 C70 560 8 580 18 660 C28 740 88 760 76 840 C64 920 30 950 4 1000"
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            vectorEffect="non-scaling-stroke"
            className="draw-on-scroll"
          />
        </svg>

        <Intro />

        <Collections listings={listings} />

        <BookDirect />

        <section aria-labelledby="reviews-title" className="container-page section-y">
          {/* Google now; Airbnb and Booking.com aggregates join when Guesty is connected. */}
          <ReviewsBlock
            overall={summary.bySource.google}
            reviews={reviews}
            eyebrow={tr("eyebrow")}
            heading={tr("title")}
            headingId="reviews-title"
          />
        </section>

        <HowItWorks />

        <ExperiencesStrip />

        <section aria-labelledby="faq-title" className="bg-sand">
          <div className="container-page section-y grid gap-12 lg:grid-cols-12">
            <div className="reveal lg:col-span-4">
              <h2 id="faq-title" className="text-h2">
                {t("faqTitle")}
              </h2>
              <Link href="/faq" className="text-lead mt-8 inline-flex items-center gap-2 font-semibold hover:text-azulejo-bright">
                <Icon name="arrowUpRight" size={22} />
                {t("faqCta")}
              </Link>
            </div>
            <div className="lg:col-span-8">
              <FaqList items={faqFor("home")} locale={locale} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
