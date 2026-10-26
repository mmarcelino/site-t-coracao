import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { faqFor } from "@/content/faq";
import { site, siteUrl } from "@/content/site";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import {
  getBuilding,
  getListingBySlug,
  getListingSlugs,
  getListings,
  getNeighbourhood,
  getReviews,
  type Listing,
} from "@/lib/data";
import { absoluteUrl, alternates, ogLocale } from "@/lib/seo";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { Gallery } from "@/components/listing/Gallery";
import { ListingCard } from "@/components/listing/ListingCard";
import { TrackListingView } from "@/components/listing/TrackListingView";
import { ReviewsBlock } from "@/components/ReviewsBlock";
import { Icon, type IconName } from "@/components/ui/Icon";

export async function generateStaticParams() {
  return (await getListingSlugs()).map((slug) => ({ slug }));
}

async function load(slug: string) {
  const locale = (await rootLocale()) as Locale;
  const listing = await getListingBySlug(locale, slug);
  if (!listing) notFound();
  const building = await getBuilding(locale, listing.buildingId);
  if (!building) notFound();
  return { locale, listing, building };
}

export async function generateMetadata({ params }: PageProps<"/[locale]/apartments/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { locale, listing, building } = await load(slug);
  const title = `${listing.title}, ${building.name}`;
  const href = { pathname: "/apartments/[slug]" as const, params: { slug } };
  return {
    title,
    description: `${listing.tagline} ${building.historyLine}`,
    alternates: alternates(locale, href),
    openGraph: {
      title,
      description: listing.tagline,
      type: "website",
      locale: ogLocale[locale],
      siteName: site.name,
      images: listing.pictures[0] ? [{ url: listing.pictures[0].src, alt: listing.pictures[0].alt }] : [],
    },
  };
}

function vacationRentalJsonLd(listing: Listing, buildingName: string, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    "@id": absoluteUrl(locale, { pathname: "/apartments/[slug]", params: { slug: listing.slug } }),
    identifier: listing.id,
    name: `${listing.title}, ${buildingName}`,
    description: listing.description.summary,
    url: absoluteUrl(locale, { pathname: "/apartments/[slug]", params: { slug: listing.slug } }),
    image: listing.pictures.map((p) => new URL(p.src, absoluteUrl(locale, "/")).toString()),
    brand: { "@id": `${siteUrl}/#organization` },
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address.street,
      postalCode: listing.address.zipcode,
      addressLocality: listing.address.city,
      addressCountry: "PT",
    },
    latitude: listing.address.lat,
    longitude: listing.address.lng,
    checkinTime: listing.checkInTime,
    checkoutTime: listing.checkOutTime,
    containsPlace: {
      "@type": "Accommodation",
      additionalType: "EntirePlace",
      occupancy: { "@type": "QuantitativeValue", value: listing.accommodates },
      numberOfBedrooms: listing.bedrooms,
      numberOfBathroomsTotal: listing.bathrooms,
      floorSize: { "@type": "QuantitativeValue", value: listing.areaSqm, unitCode: "MTK" },
      amenityFeature: listing.amenities.map((a) => ({ "@type": "LocationFeatureSpecification", name: a, value: true })),
    },
    ...(listing.reviews
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: listing.reviews.score,
            bestRating: 10,
            ratingCount: listing.reviews.count,
          },
        }
      : {}),
  };
}

type Params = PageProps<"/[locale]/apartments/[slug]">["params"];

/**
 * `params` is URL data, so it sits under <Suspense> (Cache Components). Direct visits still get
 * the fully prerendered page (generateStaticParams); client navigations show the skeleton first.
 */
export default function ApartmentPage({ params }: PageProps<"/[locale]/apartments/[slug]">) {
  return (
    <Suspense fallback={<ApartmentSkeleton />}>
      <ApartmentContent params={params} />
    </Suspense>
  );
}

function ApartmentSkeleton() {
  return (
    <div aria-hidden className="animate-fade-in">
      <div className="container-page pt-6 pb-5">
        <div className="h-5 w-64 bg-limestone/70" />
      </div>
      <div className="container-page">
        <div className="h-[min(72vh,44rem)] bg-limestone/70" />
      </div>
      <div className="container-page pt-14">
        <div className="h-4 w-48 bg-limestone/70" />
        <div className="mt-5 h-14 w-2/3 max-w-xl bg-limestone/70" />
      </div>
    </div>
  );
}

async function ApartmentContent({ params }: { params: Params }) {
  const { slug } = await params;
  const { locale, listing, building } = await load(slug);
  const t = await getTranslations();
  const [neighbourhood, siblings, reviews] = await Promise.all([
    getNeighbourhood(locale, listing.neighbourhoodSlug),
    getListings(locale, { buildingId: listing.buildingId }),
    getReviews(locale, { listingId: listing.id, limit: 3 }),
  ]);
  const others = siblings.filter((l) => l.id !== listing.id);

  const facts: Array<{ icon: IconName; label: string }> = [
    { icon: "guests", label: t("common.guests", { count: listing.accommodates }) },
    { icon: "bed", label: t("common.bedrooms", { count: listing.bedrooms }) },
    { icon: "bath", label: t("common.bathrooms", { count: Math.max(1, Math.floor(listing.bathrooms)) }) },
    { icon: "area", label: t("common.area", { count: listing.areaSqm }) },
    { icon: "stairs", label: `${listing.floor} · ${listing.hasLift ? t("listing.lift") : t("listing.noLift")}` },
  ];
  const primaryAmenities = listing.amenities.slice(0, 10);
  const restAmenities = listing.amenities.slice(10);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${listing.address.street}, ${listing.address.zipcode} ${listing.address.city}`)}`;

  return (
    <>
      <TrackListingView listingId={listing.id} buildingId={listing.buildingId} />

      <nav aria-label={t("listing.breadcrumbLabel")} className="container-page pt-6 pb-5">
        <ol className="text-small flex flex-wrap items-center gap-2 text-granite">
          <li>
            <Link href="/apartments" className="link-quiet">
              {t("listing.breadcrumbApartments")}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={{ pathname: "/buildings/[slug]", params: { slug: building.slug } }} className="link-quiet">
              {building.name}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-ink">
            {listing.title}
          </li>
        </ol>
      </nav>

      <Gallery pictures={listing.pictures} title={`${listing.title}, ${building.name}`} />

      <div className="container-page pt-10 md:pt-14">
        <div className="grid gap-x-[clamp(2rem,5vw,6rem)] lg:grid-cols-[minmax(0,1fr)_24rem]">
          <article className="min-w-0">
            <header className="max-w-3xl">
              <p className="label text-granite">
                {building.name} · {neighbourhood?.name}
              </p>
              <h1 className="text-display mt-4">{listing.title}</h1>
              <p className="text-lead mt-5 text-granite">{listing.tagline}</p>
            </header>

            <ul
              aria-label={t("listing.factsLabel")}
              className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-y border-ink/15 py-6"
            >
              {facts.map((fact) => (
                <li key={fact.icon} className="flex items-center gap-3">
                  <Icon name={fact.icon} size={22} className="text-granite" />
                  <span>{fact.label}</span>
                </li>
              ))}
            </ul>

            <section className="mt-12 max-w-3xl">
              <p className="text-lead">{listing.description.summary}</p>
              <h2 className="sr-only">{t("listing.highlights")}</h2>
              <ul className="mt-8 grid gap-3 sm:grid-cols-3">
                {listing.highlights.map((h) => (
                  <li key={h} className="flex gap-3 border-t border-ink/15 pt-4 text-small">
                    <Icon name="check" size={18} className="mt-0.5 shrink-0 text-azulejo" />
                    {h}
                  </li>
                ))}
              </ul>
            </section>

            {/* The building's story sits above specs: "why this place" first. */}
            <section aria-labelledby="building-title" className="mt-16 grid gap-8 rounded-[var(--radius-card)] bg-wash p-[clamp(1.5rem,4vw,3rem)] md:grid-cols-5">
              <div className="relative aspect-[3/2] overflow-hidden rounded-[var(--radius-tile)] bg-limestone md:col-span-2 md:aspect-[4/5]">
                <Image
                  src={building.storyImage.src}
                  alt={building.storyImage.alt}
                  fill
                  sizes="(min-width: 1024px) 22vw, (min-width: 768px) 35vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="md:col-span-3">
                <p className="label text-ink-soft-text">
                  {t("listing.theBuilding")} · {building.era}
                </p>
                <h2 id="building-title" className="text-h3 mt-4">
                  {building.historyLine}
                </h2>
                <p className="mt-5 text-ink-soft-text">{building.story}</p>
                <Link
                  href={{ pathname: "/buildings/[slug]", params: { slug: building.slug } }}
                  className="mt-6 inline-flex items-center gap-2 link-quiet"
                >
                  {t("listing.aboutBuilding", { building: building.name })}
                  <Icon name="arrowRight" size={18} />
                </Link>
              </div>
            </section>

            <section aria-labelledby="space-title" className="mt-16 max-w-3xl">
              <h2 id="space-title" className="text-h3">
                {t("listing.theSpace")}
              </h2>
              <p className="mt-5 text-ink/80">{listing.description.space}</p>
            </section>

            <section aria-labelledby="amenities-title" className="mt-16">
              <h2 id="amenities-title" className="text-h3">
                {t("listing.amenities")}
              </h2>
              <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {primaryAmenities.map((a) => (
                  <li key={a} className="flex items-center gap-3 border-b border-ink/10 py-2.5">
                    <Icon name="check" size={16} className="text-granite" />
                    {t(`amenities.${a}`)}
                  </li>
                ))}
              </ul>
              {restAmenities.length ? (
                <details className="group mt-4">
                  <summary className="link-quiet inline-flex cursor-pointer list-none items-center gap-2 py-2 [&::-webkit-details-marker]:hidden">
                    {t("listing.showAllAmenities", { count: listing.amenities.length })}
                    <Icon name="chevronDown" size={16} className="transition-transform group-open:rotate-180" />
                  </summary>
                  <ul className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {restAmenities.map((a) => (
                      <li key={a} className="flex items-center gap-3 border-b border-ink/10 py-2.5">
                        <Icon name="check" size={16} className="text-granite" />
                        {t(`amenities.${a}`)}
                      </li>
                    ))}
                  </ul>
                </details>
              ) : null}
            </section>

            {neighbourhood ? (
              <section aria-labelledby="location-title" className="mt-16">
                <h2 id="location-title" className="text-h3">
                  {t("listing.location")}
                </h2>
                <div className="mt-6 grid gap-8 md:grid-cols-2">
                  <div>
                    <p className="label text-granite">{neighbourhood.name}</p>
                    <p className="mt-3 text-ink/80">{neighbourhood.intro}</p>
                    <Link
                      href={{ pathname: "/neighbourhoods/[slug]", params: { slug: neighbourhood.slug } }}
                      className="mt-5 inline-flex items-center gap-2 link-quiet"
                    >
                      {neighbourhood.name}
                      <Icon name="arrowRight" size={18} />
                    </Link>
                  </div>
                  <div>
                    <p className="label text-granite">{t("listing.nearby")}</p>
                    <ul className="mt-3">
                      {neighbourhood.nearby.map((place) => (
                        <li key={place} className="border-b border-ink/10 py-2.5">
                          {place}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 flex items-start gap-3">
                      <Icon name="pin" size={20} className="mt-0.5 shrink-0 text-granite" />
                      <span>
                        {listing.address.street},{" "}
                        <span className="whitespace-nowrap">
                          {listing.address.zipcode} {listing.address.city}
                        </span>
                        <br />
                        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="link-quiet text-small">
                          {t("listing.openMap")}
                        </a>
                      </span>
                    </p>
                  </div>
                </div>
              </section>
            ) : null}

            <section aria-labelledby="rules-title" className="mt-16">
              <h2 id="rules-title" className="text-h3">
                {t("listing.houseRules")}
              </h2>
              {!listing.hasLift ? (
                <p className="mt-5 flex gap-3 rounded-[var(--radius-tile)] bg-sand p-4 text-small">
                  <Icon name="stairs" size={20} className="shrink-0" />
                  {t("listing.stairsNote", { building: building.name, floor: listing.floor.toLowerCase() })}
                </p>
              ) : null}
              <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
                {[
                  t("listing.checkInFrom", { time: listing.checkInTime }),
                  t("listing.checkOutBy", { time: listing.checkOutTime }),
                  t("listing.quietHours"),
                  t("listing.noSmoking"),
                  t("listing.noPets"),
                  t("listing.noParties"),
                  t("listing.guestRegistration"),
                ].map((rule) => (
                  <li key={rule} className="border-b border-ink/10 py-2.5">
                    {rule}
                  </li>
                ))}
              </ul>
              {listing.licence ? (
                <p className="text-small mt-6 text-granite">{t("listing.licence", { licence: listing.licence })}</p>
              ) : null}
            </section>
          </article>

          <aside className="lg:row-span-2">
            <BookingWidget
              listing={{
                id: listing.id,
                buildingId: listing.buildingId,
                title: listing.title,
                buildingName: building.name,
                basePrice: listing.price.base.amount,
                currency: listing.price.base.currency,
                minNights: listing.minNights,
                accommodates: listing.accommodates,
                licence: listing.licence,
              }}
            />
          </aside>
        </div>
      </div>

      {listing.reviews ? (
        <section aria-labelledby="listing-reviews-title" className="container-page section-y">
          <ReviewsBlock
            overall={listing.reviews}
            reviews={reviews}
            eyebrow={t("reviews.listingTitle")}
            heading={t("reviews.title")}
            headingId="listing-reviews-title"
          />
        </section>
      ) : null}

      <section aria-labelledby="listing-faq-title" className="border-t border-ink/10">
        <div className="container-page section-y-tight grid gap-10 lg:grid-cols-12">
          <h2 id="listing-faq-title" className="text-h2 lg:col-span-4">
            {t("listing.faqTitle")}
          </h2>
          <div className="lg:col-span-8">
            <FaqList items={faqFor("listing")} locale={locale} />
          </div>
        </div>
      </section>

      {others.length ? (
        <section aria-labelledby="more-title" className="bg-sand">
          <div className="container-page section-y-tight">
            <h2 id="more-title" className="text-h2">
              {t("listing.moreInBuilding", { building: building.name })}
            </h2>
            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((l) => (
                <ListingCard key={l.id} listing={l} buildingName={building.name} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Room for the mobile booking bar */}
      <div className="h-20 lg:hidden" aria-hidden />

      <JsonLd data={vacationRentalJsonLd(listing, building.name, locale)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: t("listing.breadcrumbApartments"), item: absoluteUrl(locale, "/apartments") },
            {
              "@type": "ListItem",
              position: 2,
              name: building.name,
              item: absoluteUrl(locale, { pathname: "/buildings/[slug]", params: { slug: building.slug } }),
            },
            { "@type": "ListItem", position: 3, name: listing.title },
          ],
        }}
      />
    </>
  );
}
