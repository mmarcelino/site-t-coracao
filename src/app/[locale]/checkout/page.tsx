import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { isISODate, isoToLocalDate } from "@/lib/dates";
import { createFormatter } from "@/lib/format";
import { getBuilding, getListingBySlug, getQuote } from "@/lib/data";
import { alternates } from "@/lib/seo";
import { buttonClasses } from "@/components/ui/Button";
import { PriceBreakdown } from "@/components/booking/PriceBreakdown";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

/**
 * Checkout (CLAUDE.md §7.12): a DEMO for now. The stay and price are real (a live Guesty quote when
 * keys are set), but nothing is booked or charged, and the guest's details never leave the browser.
 * Payments decision (§16): the card goes into the provider's own secure fields, shown where the
 * payment placeholder sits; this path runs no third-party scripts (no analytics, strict CSP).
 * Reached by a full page load from the booking widget (?listing=<slug>&checkIn&checkOut&guests).
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
  const str = (v: unknown) => (typeof v === "string" ? v : undefined);
  const slug = str(sp.listing);
  const checkIn = str(sp.checkIn);
  const checkOut = str(sp.checkOut);
  const guests = Number(sp.guests);

  const listing = slug ? await getListingBySlug(locale, slug) : null;
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
  const date = (iso: string) => format.dateTime(isoToLocalDate(iso), { weekday: "short", day: "numeric", month: "long" });

  return (
    <div className="container-page pt-8 pb-[clamp(4rem,8vw,7rem)]">
      <p className="text-small">
        <Link href={{ pathname: "/apartments/[slug]", params: { slug: listing.slug } }} className="link-quiet text-granite">
          ← {listing.title}
        </Link>
      </p>
      <h1 className="text-h2 mt-6">{t("checkout.title")}</h1>

      <div className="mt-10 grid gap-x-[clamp(2rem,5vw,6rem)] gap-y-12 lg:grid-cols-[minmax(0,1fr)_24rem]">
        {/* The stay, as priced by Guesty: first on phones, beside the form (sticky) on desktop. */}
        <aside className="lg:order-last" aria-labelledby="summary-title">
          <div className="space-y-6 rounded-[var(--radius-card)] border border-ink/10 bg-white p-6 lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <div className="flex gap-4">
              {cover ? (
                <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-[var(--radius-tile)] bg-limestone">
                  <Image src={cover.src} alt={cover.alt} fill sizes="112px" className="object-cover" />
                </div>
              ) : null}
              <div className="min-w-0">
                {building ? <p className="label text-granite">{building.name}</p> : null}
                <h2 id="summary-title" className="mt-1.5 font-semibold">
                  {listing.title}
                </h2>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-y border-ink/10 py-5 text-small">
              <div>
                <dt className="label text-granite">{t("booking.checkIn")}</dt>
                <dd className="mt-1.5">{date(quote.checkIn)}</dd>
              </div>
              <div>
                <dt className="label text-granite">{t("booking.checkOut")}</dt>
                <dd className="mt-1.5">{date(quote.checkOut)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="label text-granite">{t("booking.guests")}</dt>
                <dd className="mt-1.5">{t("common.guests", { count: quote.guests })}</dd>
              </div>
            </dl>
            <PriceBreakdown quote={quote} />
          </div>
        </aside>

        <CheckoutForm listingId={listing.id} total={quote.total} />
      </div>
    </div>
  );
}
