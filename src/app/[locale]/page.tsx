import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { faqFor } from "@/content/faq";
import { site } from "@/content/site";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { heroSlides } from "@/content/featured";
import { getBuildings, getListings, getNeighbourhoods, getReviewSummary, getReviews } from "@/lib/data";
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
  const [listings, buildings, neighbourhoods, summary, reviews] = await Promise.all([
    getListings(locale),
    getBuildings(locale),
    getNeighbourhoods(locale),
    getReviewSummary(locale),
    getReviews(locale, { limit: 4 }),
  ]);
  const maxGuests = Math.max(...listings.map((l) => l.accommodates));
  const format = createFormatter(locale);
  const slides = heroSlides.flatMap(({ slug, image }) => {
    const l = listings.find((x) => x.slug === slug);
    if (!l) return [];
    const building = buildings.find((b) => b.id === l.buildingId);
    const home = {
      slug: l.slug,
      title: l.title,
      place: neighbourhoods.find((n) => n.slug === l.neighbourhoodSlug)?.name ?? "",
      image: { src: l.pictures[0]?.src ?? "", alt: l.pictures[0]?.alt ?? "" },
      price: format.money(l.price.base.amount, l.price.base.currency),
      rating: l.reviews ? format.number(l.reviews.score, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : null,
    };
    const alt = l.pictures.find((p) => p.src === image)?.alt ?? l.title;
    return [{ key: slug, label: building?.name === l.title ? l.title : (building?.name ?? l.title), image: { src: image, alt }, home }];
  });

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
