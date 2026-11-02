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
import { Icon } from "@/components/ui/Icon";

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

  const facts: Array<{ label: string; value: string; note?: string }> = [
    { label: t("listing.factGuests"), value: String(listing.accommodates) },
    { label: t("listing.factBedrooms"), value: listing.bedrooms ? String(listing.bedrooms) : t("listing.studio") },
    { label: t("listing.factBathrooms"), value: String(Math.max(1, Math.floor(listing.bathrooms))) },
    { label: t("listing.factSize"), value: t("common.area", { count: listing.areaSqm }) },
    { label: t("listing.factFloor"), value: listing.floor, note: listing.hasLift ? t("listing.lift") : t("listing.noLift") },
  ];
  const primaryAmenities = listing.amenities.slice(0, 8);
  const restAmenities = listing.amenities.slice(8);
  const detail = "mt-14 grid gap-x-8 gap-y-5 border-t border-ink pt-5 md:grid-cols-[11rem_minmax(0,1fr)]";
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
              <h1 className="text-h2 mt-4">{listing.title}</h1>
              <p className="mt-4 text-granite">{listing.tagline}</p>
            </header>

            {/* At a glance: the home page's rule-topped columns, label over value. */}
            <dl aria-label={t("listing.factsLabel")} className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 xl:grid-cols-5">
              {facts.map((fact) => (
                <div key={fact.label} className="border-t border-ink pt-3">
                  <dt className="label text-granite">{fact.label}</dt>
                  <dd className="mt-2 text-[1.0625rem] leading-snug font-semibold">
                    {fact.value}
                    {fact.note ? <span className="block text-small font-normal text-granite">{fact.note}</span> : null}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 max-w-3xl">{listing.description.summary}</p>

            {/* The building's story sits above specs: "why this place" first. */}
            <section aria-labelledby="building-title" className="mt-14 grid gap-8 rounded-[var(--radius-card)] bg-pop p-[clamp(1.5rem,4vw,2.5rem)] md:grid-cols-5">
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
                <p className="label">
                  {t("listing.theBuilding")} · {building.era}
                </p>
                <h2 id="building-title" className="card-title mt-3">
                  {building.historyLine}
                </h2>
                <p className="mt-4">{building.story}</p>
                <Link
                  href={{ pathname: "/buildings/[slug]", params: { slug: building.slug } }}
                  className="mt-6 inline-flex items-center gap-2 link-quiet"
                >
                  {t("listing.aboutBuilding", { building: building.name })}
                  <Icon name="arrowRight" size={18} />
                </Link>
              </div>
            </section>

            {/* The details, one rhythm (as "Before you book." on the home page): an ink rule, the
                heading on the left, the content on the right. */}
            <section aria-labelledby="amenities-title" className={detail}>
              <h2 id="amenities-title" className="card-title">
                {t("listing.amenities")}
              </h2>
              <div>
                <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {primaryAmenities.map((a) => (
                    <li key={a} className="flex items-center gap-3">
                      <Icon name="check" size={16} className="text-granite" />
                      {t(`amenities.${a}`)}
                    </li>
                  ))}
                </ul>
                {restAmenities.length ? (
                  <details className="group mt-3">
                    <summary className="link-quiet mt-3 inline-flex cursor-pointer list-none items-center gap-2 py-2 [&::-webkit-details-marker]:hidden">
                      {t("listing.showAllAmenities", { count: listing.amenities.length })}
                      <Icon name="chevronDown" size={16} className="transition-transform group-open:rotate-180" />
                    </summary>
                    <ul className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                      {restAmenities.map((a) => (
                        <li key={a} className="flex items-center gap-3">
                          <Icon name="check" size={16} className="text-granite" />
                          {t(`amenities.${a}`)}
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : null}
              </div>
            </section>

            {neighbourhood ? (
              <section aria-labelledby="location-title" className={detail}>
                <div>
                  <h2 id="location-title" className="card-title">
                    {t("listing.location")}
                  </h2>
                  <p className="label mt-2 text-granite">{neighbourhood.name}</p>
                </div>
                <div>
                  <p className="text-granite">{neighbourhood.intro}</p>
                  <p className="label mt-8 text-granite">{t("listing.nearby")}</p>
                  <ul className="mt-2">
                    {neighbourhood.nearby.map((place) => {
                      const [name, time] = place.split(" · ");
                      return (
                        <li key={place} className="flex items-baseline justify-between gap-6 border-b border-ink/10 py-2.5">
                          <span>{name}</span>
                          {time ? <span className="shrink-0 text-small text-granite">{time}</span> : null}
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="flex items-center gap-2">
                      <Icon name="pin" size={18} className="shrink-0 text-granite" />
                      {listing.address.street}, {listing.address.zipcode} {listing.address.city}
                    </span>
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="link-quiet text-small">
                      {t("listing.openMap")}
                    </a>
                  </p>
                </div>
              </section>
            ) : null}

            <section aria-labelledby="rules-title" className={detail}>
              <h2 id="rules-title" className="card-title">
                {t("listing.houseRules")}
              </h2>
              <div>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
                  {[
                    [t("listing.ruleCheckIn"), t("listing.fromTime", { time: listing.checkInTime })],
                    [t("listing.ruleCheckOut"), t("listing.byTime", { time: listing.checkOutTime })],
                    [t("listing.ruleQuiet"), t("listing.quietTime")],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="label text-granite">{label}</dt>
                      <dd className="mt-2 text-[1.0625rem] font-semibold">{value}</dd>
                    </div>
                  ))}
                </dl>
                <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                  {[t("listing.noSmoking"), t("listing.noPets"), t("listing.noParties")].map((rule) => (
                    <li key={rule} className="flex items-center gap-2">
                      <Icon name="close" size={14} className="text-granite" />
                      {rule}
                    </li>
                  ))}
                </ul>
                {!listing.hasLift ? (
                  <p className="mt-6 flex gap-3 rounded-[var(--radius-tile)] bg-pop/40 p-4 text-small">
                    <Icon name="stairs" size={20} className="shrink-0" />
                    {listing.category === "house"
                      ? t("listing.stairsNoteHouse", { building: building.name })
                      : t("listing.stairsNote", { building: building.name, floor: listing.floor.toLowerCase() })}
                  </p>
                ) : null}
                <p className="mt-6 text-small text-granite">
                  {t("listing.guestRegistration")}
                  {/* Portuguese law requires the AL registration number wherever the home is advertised. */}
                  {listing.licence ? <span className="block">{t("listing.licence", { licence: listing.licence })}</span> : null}
                </p>
              </div>
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
            heading={t("reviews.listingTitle")}
            headingId="listing-reviews-title"
          />
        </section>
      ) : null}


      {others.length ? (
        <section aria-labelledby="more-title" className="border-t border-ink/10">
          <div className="container-page section-y-tight">
            <h2 id="more-title" className="text-h2">
              {t("listing.moreInBuilding", { building: building.name })}
            </h2>
            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((l) => (
                <ListingCard key={l.id} listing={l} location={neighbourhood?.name ?? ""} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="listing-faq-title" className="border-t border-ink/10">
        <div className="container-page section-y-tight grid gap-10 lg:grid-cols-12">
          <h2 id="listing-faq-title" className="text-h2 lg:col-span-4">
            {t("listing.faqTitle")}
          </h2>
          <div className="lg:col-span-8">
            <FaqList items={faqFor("listing").slice(0, 5)} locale={locale} />
          </div>
        </div>
      </section>

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
