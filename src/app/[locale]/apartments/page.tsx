import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import type { Locale } from "@/i18n/routing";
import { isISODate, isoToLocalDate } from "@/lib/dates";
import { createFormatter } from "@/lib/format";
import { getBuildings, getListings } from "@/lib/data";
import { alternates } from "@/lib/seo";
import { ListingCard } from "@/components/listing/ListingCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

/**
 * Milestone 1: a lean index so the home search has somewhere to land.
 * Filters (type, guests, neighbourhood, dates) and the grouped-by-building view are milestone 2.
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations("apartments");
  return { title: { absolute: t("metaTitle") }, description: t("metaDescription"), alternates: alternates(locale, "/apartments") };
}

async function SearchSummary({ searchParams }: { searchParams: PageProps<"/[locale]/apartments">["searchParams"] }) {
  const sp = await searchParams;
  const t = await getTranslations();
  const format = createFormatter(await getLocale());
  const checkIn = typeof sp.checkIn === "string" ? sp.checkIn : undefined;
  const checkOut = typeof sp.checkOut === "string" ? sp.checkOut : undefined;
  const guests = Number(sp.guests) || 0;
  if (!isISODate(checkIn) || !isISODate(checkOut) || !guests) return null;
  const d = (iso: string) => format.dateTime(isoToLocalDate(iso), { day: "numeric", month: "long" });
  return (
    <p className="text-small mt-8 inline-block bg-sand px-4 py-3" role="status">
      {t("apartments.forDates", { checkIn: d(checkIn), checkOut: d(checkOut), guests: t("common.guests", { count: guests }) })}
    </p>
  );
}

export default async function ApartmentsPage({ searchParams }: PageProps<"/[locale]/apartments">) {
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations("apartments");
  const [listings, buildings] = await Promise.all([getListings(locale), getBuildings(locale)]);

  return (
    <section className="container-page section-y-tight">
      <SectionHeader as="h1" eyebrow={t("eyebrow")} title={t("title")}>
        <p>{t("body")}</p>
      </SectionHeader>
      <Suspense fallback={null}>
        <SearchSummary searchParams={searchParams} />
      </Suspense>
      <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            buildingName={buildings.find((b) => b.id === listing.buildingId)?.name ?? ""}
          />
        ))}
      </div>
    </section>
  );
}
