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
  // One slide per collection: a home from it (photo) + that home's guest review.
  const reviewSources = { google: "Google", airbnb: "Airbnb", booking: "Booking.com" } as const;
  const slides = (
    await Promise.all(
      heroSlides.map(async ({ tag, slug, image }) => {
        const l = listings.find((x) => x.slug === slug && x.tags.includes(tag));
        const [review] = l ? await getReviews(locale, { listingId: l.id, limit: 1 }) : [];
        if (!l || !review) return null;
        return {
          key: tag,
          label: tTags(tag),
          image: { src: image, alt: l.pictures.find((p) => p.src === image)?.alt ?? l.title },
          review: {
            quote: review.text,
            lang: review.language,
            author: review.author,
            source: reviewSources[review.source],
            score: `${format.number(review.rating)}/${review.source === "booking" ? 10 : 5}`,
            mock: review.mock,
            home: { slug: l.slug, title: l.title, image: l.pictures[0]?.src ?? image },
          },
        };
      }),
    )
  ).filter((s): s is NonNullable<typeof s> => s !== null);

  return (
    <>
      <Hero maxGuests={maxGuests} slides={slides} />

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
    </>
  );
}
