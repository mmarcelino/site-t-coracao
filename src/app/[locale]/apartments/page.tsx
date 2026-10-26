import type { Metadata } from "next";
import { Suspense } from "react";
import clsx from "clsx";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { collections } from "@/content/collections";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { isISODate, isoToLocalDate } from "@/lib/dates";
import { createFormatter } from "@/lib/format";
import { getBuildings, getListings, isRangeAvailable, listingTags, type Listing, type ListingTag } from "@/lib/data";
import { alternates } from "@/lib/seo";
import { ListingCard } from "@/components/listing/ListingCard";

/**
 * All apartments, filterable by collection tag (?tag=) and by the home search
 * (?checkIn&checkOut&guests: capacity + mock availability). Filters are links, so every
 * filtered view has a shareable URL. Neighbourhood filter and grouped-by-building view: later.
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations("apartments");
  return { title: { absolute: t("metaTitle") }, description: t("metaDescription"), alternates: alternates(locale, "/apartments") };
}

type SearchParams = PageProps<"/[locale]/apartments">["searchParams"];

interface Search {
  tag?: ListingTag;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

function parseSearch(sp: Awaited<SearchParams>): Search {
  const str = (v: unknown) => (typeof v === "string" ? v : undefined);
  const tag = str(sp.tag);
  const checkIn = str(sp.checkIn);
  const checkOut = str(sp.checkOut);
  const guests = Number(sp.guests);
  const datesOk = isISODate(checkIn) && isISODate(checkOut) && checkOut > checkIn;
  return {
    tag: listingTags.includes(tag as ListingTag) ? (tag as ListingTag) : undefined,
    ...(datesOk ? { checkIn, checkOut } : {}),
    guests: Number.isInteger(guests) && guests > 0 ? guests : undefined,
  };
}

function toQuery(search: Search, tag: ListingTag | undefined) {
  return {
    ...(tag ? { tag } : {}),
    ...(search.checkIn && search.checkOut ? { checkIn: search.checkIn, checkOut: search.checkOut } : {}),
    ...(search.guests ? { guests: String(search.guests) } : {}),
  };
}

async function Results({ searchParams }: { searchParams: SearchParams }) {
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations();
  const format = createFormatter(locale);
  const search = parseSearch(await searchParams);
  const [all, buildings] = await Promise.all([getListings(locale), getBuildings(locale)]);

  // Capacity + dates first (they define what's bookable), then the tag on top.
  const bookable: Listing[] = [];
  for (const l of all) {
    if (search.guests && l.accommodates < search.guests) continue;
    if (search.checkIn && search.checkOut && !(await isRangeAvailable(l.id, search.checkIn, search.checkOut))) continue;
    bookable.push(l);
  }
  const shown = search.tag ? bookable.filter((l) => l.tags.includes(search.tag!)) : bookable;
  const hasSearch = Boolean(search.checkIn || search.guests);
  const d = (iso: string) => format.dateTime(isoToLocalDate(iso), { day: "numeric", month: "long" });

  const chip = (active: boolean) =>
    clsx(
      "inline-flex h-10 items-center gap-2 rounded-full border-[1.5px] px-4 text-[0.9375rem] font-semibold whitespace-nowrap transition-colors",
      active ? "border-ink bg-ink text-paper" : "border-ink/20 hover:border-ink",
    );

  return (
    <>
      <nav aria-label={t("apartments.filterLabel")} className="mt-10">
        <ul className="scrollbar-none -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-1 sm:flex-wrap">
          <li>
            <Link href={{ pathname: "/apartments", query: toQuery(search, undefined) }} aria-current={!search.tag ? "page" : undefined} className={chip(!search.tag)}>
              {t("apartments.all")}
              <span className="opacity-70">{bookable.length}</span>
            </Link>
          </li>
          {collections.map((c) => {
            const count = bookable.filter((l) => l.tags.includes(c.tag)).length;
            const active = search.tag === c.tag;
            return (
              <li key={c.tag}>
                <Link
                  href={{ pathname: "/apartments", query: toQuery(search, c.tag) }}
                  aria-current={active ? "page" : undefined}
                  className={chip(active)}
                >
                  {t(`tags.${c.tag}`)}
                  <span className="opacity-70">{count}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2" role="status">
        <p className="font-semibold">
          {t("apartments.results", { count: shown.length })}
          {search.checkIn && search.checkOut
            ? ` ${t("apartments.available", { checkIn: d(search.checkIn), checkOut: d(search.checkOut) })}`
            : null}
          {search.guests ? ` ${t("apartments.forGuests", { guests: t("common.guests", { count: search.guests }) })}` : null}
        </p>
        {hasSearch || search.tag ? (
          <Link href="/apartments" className="link-quiet text-small">
            {t("apartments.clear")}
          </Link>
        ) : null}
      </div>

      {shown.length ? (
        <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              buildingName={buildings.find((b) => b.id === listing.buildingId)?.name ?? ""}
              query={toQuery(search, undefined)}
            />
          ))}
        </div>
      ) : (
        <p className="text-lead mt-10 max-w-xl text-granite">{t("apartments.none")}</p>
      )}
    </>
  );
}

export default async function ApartmentsPage({ searchParams }: PageProps<"/[locale]/apartments">) {
  const t = await getTranslations("apartments");

  return (
    <section className="container-page section-y-tight">
      <h1 className="text-h1">{t("title")}</h1>
      <p className="text-lead mt-5 max-w-2xl text-granite">{t("body")}</p>
      {/* Filters + results read the URL, so they stream in under Suspense (Cache Components). */}
      <Suspense
        fallback={
          <div aria-hidden className="mt-10">
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-28 rounded-full bg-sand" />
              ))}
            </div>
            <div className="mt-[4.5rem] grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="aspect-[4/5] rounded-[var(--radius-card)] bg-sand" />
              ))}
            </div>
          </div>
        }
      >
        <Results searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
