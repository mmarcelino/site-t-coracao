import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { isISODate, isoToLocalDate } from "@/lib/dates";
import { createFormatter } from "@/lib/format";
import { findMovedListing, getBuilding, getListingBySlug, getQuote } from "@/lib/data";
import { alternates } from "@/lib/seo";
import { buttonClasses } from "@/components/ui/Button";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { RateSelectionProvider, SelectedPriceBreakdown, SelectedRateNote } from "@/components/checkout/RateSelection";
import { Icon } from "@/components/ui/Icon";

/**
 * Checkout (CLAUDE.md §7.12): a DEMO for now. The stay and price are real (a live Guesty quote when
 * keys are set), but nothing is booked or charged, and the guest's details never leave the browser.
 * Payments decision (§16): the card goes into the provider's own secure fields, shown where the
 * payment placeholder sits; this path runs no third-party scripts (no analytics, strict CSP).
 * Reached by a full page load from the booking widget (?listing=<slug>&checkIn&checkOut&guests).
 * The guest chooses between the stay's Guesty rate plans (e.g. free cancellation or non-refundable).
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations("checkout");
  return {
    title: t("metaTitle"),
    robots: { index: false, follow: false },
    alternates: alternates(locale, "/checkout"),
  };
}

type SearchParams = PageProps<"/[locale]/checkout">["searchParams"];

export default function CheckoutPage({ searchParams }: PageProps<"/[locale]/checkout">) {
  return (
    <Suspense fallback={<div aria-hidden className="container-page min-h-[60vh] pt-10" />}>
      <Checkout searchParams={searchParams} />
    </Suspense>
  );
}

async function Checkout({ searchParams }: { searchParams: SearchParams }) {
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations();
  const format = createFormatter(locale);
  const sp = await searchParams;
  // Per-request: the quote's cancellation deadlines are checked against today's date.
  await connection();
  const str = (v: unknown) => (typeof v === "string" ? v : undefined);
  const slug = str(sp.listing);
  const checkIn = str(sp.checkIn);
  const checkOut = str(sp.checkOut);
  const guests = Number(sp.guests);

  // A link made before the listing was renamed still finds it.
  const moved = slug ? await findMovedListing(slug) : null;
  const listing = slug ? await getListingBySlug(locale, moved ?? slug) : null;
  const result =
    listing && isISODate(checkIn) && isISODate(checkOut) && Number.isInteger(guests)
      ? await getQuote({ listingId: listing.id, checkIn, checkOut, guests })
      : null;

  if (!listing || !result?.ok) {
    // Stale or hand-edited link, or the dates were just booked: back to choosing.
    return (
      <div className="container-page max-w-2xl py-[clamp(4rem,10vw,8rem)]">
        <h1 className="text-h2">{t("checkout.problemTitle")}</h1>
        <p className="mt-5">{result && !result.ok && result.reason === "unavailable" ? t("booking.unavailable") : t("checkout.problemBody")}</p>
        <p className="mt-8">
          {listing ? (
            <Link href={{ pathname: "/apartments/[slug]", params: { slug: listing.slug } }} className={buttonClasses("primary", "md")}>
              {t("checkout.backToHome", { title: listing.title })}
            </Link>
          ) : (
            <Link href="/apartments" className={buttonClasses("primary", "md")}>
              {t("checkout.seeApartments")}
            </Link>
          )}
        </p>
      </div>
    );
  }

  const { quote } = result;
  const building = await getBuilding(locale, listing.buildingId);
  const cover = listing.pictures[0];
  // "Wed 11 Nov – Sat 14 Nov 2026" / "qua. 11 nov. – sáb. 14 nov. 2026" (built by hand: Intl's
  // pt-PT short month is numeric).
  const stayDay = (iso: string) => {
    const d = isoToLocalDate(iso);
    return `${format.dateTime(d, { weekday: "short" })} ${format.dayMonth(d)}`;
  };
  const stayDates = `${stayDay(quote.checkIn)} – ${stayDay(quote.checkOut)} ${isoToLocalDate(quote.checkOut).getFullYear()}`;

  return (
    <div className="container-page pt-8 pb-[clamp(4rem,8vw,7rem)]">
      <p className="text-small">
        <Link href={{ pathname: "/apartments/[slug]", params: { slug: listing.slug } }} className="link-quiet text-granite">
          ← {listing.title}
        </Link>
      </p>
      <h1 className="text-h2 mt-6">{t("checkout.title")}</h1>

      {/* The rate the guest picks (cancellation terms) drives both the form and the summary. */}
      <RateSelectionProvider quote={quote}>
        <div className="mt-10 grid gap-x-[clamp(2rem,5vw,6rem)] gap-y-12 lg:grid-cols-[minmax(0,1fr)_24rem]">
          {/* The stay, as priced by Guesty: first on phones, beside the form (sticky) on desktop. */}
          <aside className="lg:order-last" aria-labelledby="summary-title">
            <div className="overflow-hidden rounded-[var(--radius-card)] border border-ink/10 bg-white lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              {cover ? (
                <div className="relative aspect-[16/9] bg-limestone">
                  <Image src={cover.src} alt={cover.alt} fill sizes="(min-width: 1024px) 24rem, 100vw" className="object-cover" />
                </div>
              ) : null}
              <div className="p-6">
                {building ? <p className="label text-granite">{building.name}</p> : null}
                <h2 id="summary-title" className="mt-2 text-balance">
                  {listing.title}
                </h2>
                {/* The stay in two quiet lines: dates, then length and party. */}
                <ul className="mt-5 space-y-2 text-small">
                  <li className="flex items-center gap-2.5">
                    <Icon name="calendar" size={16} className="shrink-0" />
                    {stayDates}
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Icon name="guests" size={16} className="shrink-0" />
                    {t("common.nights", { count: quote.nights })} · {t("common.guests", { count: quote.guests })}
                  </li>
                </ul>
                <div className="mt-6 border-t border-ink/10 pt-5">
                  <SelectedPriceBreakdown />
                  <SelectedRateNote />
                </div>
              </div>
            </div>
          </aside>

          <CheckoutForm listingId={listing.id} />
        </div>
      </RateSelectionProvider>
    </div>
  );
}
