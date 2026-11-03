import type { Metadata } from "next";
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
  getReviewPage,
  type Listing,
} from "@/lib/data";
import { createFormatter } from "@/lib/format";
import { absoluteUrl, alternates, ogLocale } from "@/lib/seo";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { Gallery } from "@/components/listing/Gallery";
import { ListingCard } from "@/components/listing/ListingCard";
import { TrackListingView } from "@/components/listing/TrackListingView";
import { ShareButton } from "@/components/listing/ShareButton";
import { Carousel } from "@/components/Carousel";
import { ReviewCard } from "@/components/ReviewCard";
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
    getReviewPage(locale, { listingId: listing.id, limit: 12 }),
  ]);
  const format = createFormatter(locale);
  const others = siblings.filter((l) => l.id !== listing.id);

  // Each fact reads on its own ("2 guests", "1 bathroom"), so no labels are needed.
  const facts: Array<{ icon: IconName; text: string }> = [
    { icon: "guests", text: t("common.guests", { count: listing.accommodates }) },
    { icon: "bed", text: t("common.bedrooms", { count: listing.bedrooms }) },
    { icon: "bath", text: t("common.bathrooms", { count: Math.max(1, Math.floor(listing.bathrooms)) }) },
    { icon: "area", text: t("common.area", { count: listing.areaSqm }) },
    {
      icon: "stairs",
      text: `${listing.floor}, ${(listing.hasLift ? t("listing.lift") : t("listing.noLift")).toLocaleLowerCase(locale)}`,
    },
  ];
  const primaryAmenities = listing.amenities.slice(0, 8);
  const restAmenities = listing.amenities.slice(8);
  const detail = "mt-14 grid gap-x-8 gap-y-5 border-t-2 border-ink pt-5 md:grid-cols-[11rem_minmax(0,1fr)]";
  const hasReviews = Boolean(listing.reviews && reviews.reviews.length);
  // Portuguese law requires the AL registration number wherever the home is advertised: one quiet
  // line closing this home's own content (after its reviews), before the sections shared with other pages.
  const licenceLine = listing.licence ? (
    <p className="text-small text-granite">{t("listing.licence", { licence: listing.licence })}</p>
  ) : null;
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
              {/* Share runs inline after the title's last word, on its baseline, so it sits in the
                  same place whether the title takes one line or two. */}
              <div className="mt-4 text-balance">
                <h1 className="text-h2 inline">{listing.title}</h1>
                <span className="ml-5 inline-block whitespace-nowrap sm:ml-7">
                  <ShareButton title={`${listing.title}, ${building.name}`} />
                </span>
              </div>
              <p className="text-lead mt-4 font-medium">{listing.tagline}</p>
            </header>

            {/* At a glance: one row between hairlines, icon + plain text, the body size throughout. */}
            <ul
              aria-label={t("listing.factsLabel")}
              className="mt-8 flex flex-wrap gap-x-7 gap-y-3 border-y border-ink/10 py-5"
            >
              {facts.map((fact) => (
                <li key={fact.icon} className="flex items-center gap-2.5 whitespace-nowrap">
                  <Icon name={fact.icon} size={20} strokeWidth={1.5} className="shrink-0" />
                  {fact.text}
                </li>
              ))}
            </ul>

            {/* The apartment's story: two paragraphs, body text only. */}
            <div className="mt-8 max-w-2xl space-y-5">
              <p>{listing.description.summary}</p>
              {listing.description.space ? <p>{listing.description.space}</p> : null}
            </div>

            {/* The building: one row in the details' rhythm, no colour block, so it supports the
                apartment instead of competing with it. Its history line still comes before the specs. */}
            <section aria-labelledby="building-title" className={detail}>
              <div>
                <h2 id="building-title" className="card-title">
                  {t("listing.theBuilding")}
                </h2>
                <p className="label mt-2 text-granite">{building.era}</p>
              </div>
              <div>
                <p className="font-semibold">{building.historyLine}</p>
                <p className="mt-3">{building.story}</p>
                {/* No lift is a fact about the building, so the heads-up lives here. */}
                {!listing.hasLift ? (
                  <p className="mt-5 flex gap-3 text-small">
                    <Icon name="stairs" size={20} className="shrink-0" />
                    {listing.category === "house"
                      ? t("listing.stairsNoteHouse", { building: building.name })
                      : t("listing.stairsNote", { building: building.name, floor: listing.floor.toLowerCase() })}
                  </p>
                ) : null}
                {others.length ? (
                  <p className="mt-5">
                    <a href="#more-homes" className="inline-flex items-center gap-2 link-quiet">
                      {t("listing.moreHomesLink", { count: others.length })}
                      <Icon name="chevronDown" size={18} />
                    </a>
                  </p>
                ) : null}
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
                      <Icon name="check" size={16} />
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
                          <Icon name="check" size={16} />
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
                  <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="flex items-start gap-2 font-semibold">
                      <Icon name="pin" size={18} className="mt-[0.2em] shrink-0" />
                      <span>
                        {listing.address.street},{" "}
                        <span className="whitespace-nowrap">
                          {listing.address.zipcode} {listing.address.city}
                        </span>
                      </span>
                    </span>
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="link-quiet text-small">
                      {t("listing.openMap")}
                    </a>
                  </p>
                  <p className="mt-5">{neighbourhood.intro}</p>
                  <p className="label mt-6 text-granite">{t("listing.nearby")}</p>
                  {/* Compact: two columns, no lines; the walk in grey after each place. */}
                  <ul className="mt-3 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
                    {neighbourhood.nearby.map((place) => {
                      const [name, time] = place.split(" · ");
                      return (
                        <li key={place}>
                          {name}
                          {time ? <span className="text-small text-granite"> · {time}</span> : null}
                        </li>
                      );
                    })}
                  </ul>
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
                      <Icon name="close" size={14} />
                      {rule}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-small text-granite">{t("listing.guestRegistration")}</p>
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
                rating: listing.reviews
                  ? {
                      score: format.number(listing.reviews.score, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
                      count: format.number(listing.reviews.count),
                    }
                  : undefined,
              }}
            />
          </aside>
        </div>
      </div>

      {/* Reviews straight after the details: the score once, then the quotes as a strip of cards
          (swipe on phones, arrows from md up), so any number of them takes the same space. */}
      {hasReviews && listing.reviews ? (
        <section id="reviews" aria-labelledby="reviews-title" className="section-y-tight scroll-mt-24">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 border-t-2 border-ink pt-6">
              <h2 id="reviews-title" className="text-h2">
                {t("reviews.listingTitle")}
              </h2>
              <p className="flex items-baseline gap-3">
                <span className="inline-flex items-center gap-2 text-[1.75rem] leading-none font-semibold tabular-nums">
                  <Icon name="star" size={18} fill="currentColor" strokeWidth={0} />
                  {format.number(listing.reviews.score, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                </span>
                <span className="text-small text-granite">
                  {t("reviews.basedOn", { count: format.number(listing.reviews.count) })} ·{" "}
                  {t(`reviews.source.${listing.reviews.source}`)}
                </span>
              </p>
            </div>
          </div>
          <Carousel
            prevLabel={t("reviews.prev")}
            nextLabel={t("reviews.next")}
            scrollClassName="mt-10 px-[var(--gutter)] pb-2 [scroll-padding-inline:var(--gutter)] lg:px-[max(var(--gutter),calc((100vw-var(--page-max))/2+var(--gutter)))]"
            controlsClassName="container-page"
          >
            <ul aria-label={t("reviews.listingTitle")} className="flex items-stretch gap-4">
              {reviews.reviews.map((review) => (
                <li key={review.id} className="w-[min(82vw,24rem)] shrink-0 snap-start">
                  <div className="flex h-full flex-col rounded-[var(--radius-card)] bg-sand p-7">
                    <ReviewCard review={review} />
                  </div>
                </li>
              ))}
            </ul>
          </Carousel>
          {licenceLine ? <div className="container-page mt-12">{licenceLine}</div> : null}
        </section>
      ) : null}

      {/* Without reviews, the licence line closes the details on its own. */}
      {licenceLine && !hasReviews ? <div className="container-page pb-10">{licenceLine}</div> : null}

      {/* The other homes in this building: a band of its own after the reviews, so it reads as
          the next step rather than an afterthought. */}
      {others.length ? (
        <section id="more-homes" aria-labelledby="more-title" className="mt-[var(--section-tight)] scroll-mt-24 bg-sand">
          <div className="container-page section-y-tight">
            <div className="border-t-2 border-ink pt-6">
              <h2 id="more-title" className="text-h2">
                {t("listing.moreInBuilding", { building: building.name })}
              </h2>
              <p className="mt-4 max-w-2xl">{t("listing.moreInBuildingIntro")}</p>
            </div>
            <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((l) => (
                <ListingCard key={l.id} listing={l} location={neighbourhood?.name ?? ""} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="listing-faq-title">
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
