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
import { getBuildings, getListings, getNeighbourhoods, isRangeAvailable, listingTags, type Listing, type ListingTag } from "@/lib/data";
import { alternates } from "@/lib/seo";
import { Icon } from "@/components/ui/Icon";
import { ListingCard } from "@/components/listing/ListingCard";
import { MapView, type MapPin } from "@/components/listing/MapView";
import { BuildingFilter, type BuildingOption } from "@/components/listing/BuildingFilter";
import { SearchBar } from "@/components/home/SearchBar";
import { SearchStateProvider } from "@/components/home/SearchState";

/**
 * All apartments, filterable by collection tag (?tag=), by building (?building=<slug>) and by
 * the home search (?checkIn&checkOut&guests: capacity + mock availability). Filters are links, so
 * every filtered view has a shareable URL. ?view=map shows the same results on a street map, one
 * pin per building. Neighbourhood filter: later.
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations("apartments");
  return { title: { absolute: t("metaTitle") }, description: t("metaDescription"), alternates: alternates(locale, "/apartments") };
}

type SearchParams = PageProps<"/[locale]/apartments">["searchParams"];

interface Search {
  view?: "map";
  tag?: ListingTag;
  /** Building slug; checked against the buildings in Results. */
  building?: string;
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
    view: str(sp.view) === "map" ? "map" : undefined,
    tag: listingTags.includes(tag as ListingTag) ? (tag as ListingTag) : undefined,
    building: str(sp.building),
    ...(datesOk ? { checkIn, checkOut } : {}),
    guests: Number.isInteger(guests) && guests > 0 ? guests : undefined,
  };
}

/** The current search as a query, with some filters changed (pass `undefined` to drop one). */
function toQuery(search: Search, patch: Partial<Pick<Search, "view" | "tag" | "building">> = {}) {
  const { view, tag, building } = { ...search, ...patch };
  return {
    ...(view ? { view } : {}),
    ...(tag ? { tag } : {}),
    ...(building ? { building } : {}),
    ...(search.checkIn && search.checkOut ? { checkIn: search.checkIn, checkOut: search.checkOut } : {}),
    ...(search.guests ? { guests: String(search.guests) } : {}),
  };
}

async function Results({ searchParams }: { searchParams: SearchParams }) {
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations();
  const format = createFormatter(locale);
  const parsed = parseSearch(await searchParams);
  const [all, neighbourhoods, buildings] = await Promise.all([getListings(locale), getNeighbourhoods(locale), getBuildings(locale)]);
  const building = buildings.find((b) => b.slug === parsed.building);
  const search: Search = { ...parsed, building: building?.slug };
  // Only what each card should carry to the apartment page: dates and guests.
  const cardQuery = toQuery(search, { view: undefined, tag: undefined, building: undefined });

  // Capacity + dates first (they define what's bookable), then tag and building on top. Each
  // filter's counts take the other filter into account.
  const bookable: Listing[] = [];
  for (const l of all) {
    if (search.guests && l.accommodates < search.guests) continue;
    if (search.checkIn && search.checkOut && !(await isRangeAvailable(l.id, search.checkIn, search.checkOut))) continue;
    bookable.push(l);
  }
  const inBuilding = building ? bookable.filter((l) => l.buildingId === building.id) : bookable;
  const inTag = search.tag ? bookable.filter((l) => l.tags.includes(search.tag!)) : bookable;
  const shown = building ? inTag.filter((l) => l.buildingId === building.id) : inTag;
  const hasSearch = Boolean(search.checkIn || search.guests);
  const d = (iso: string) => format.dateTime(isoToLocalDate(iso), { day: "numeric", month: "long" });

  // Map view: one pin per building that has homes in the current results.
  const area = (slug: string) => neighbourhoods.find((n) => n.slug === slug)?.name ?? "";
  const groups = buildings.flatMap((b) => {
    const homes = shown.filter((l) => l.buildingId === b.id);
    const first = homes[0];
    return first ? [{ b, homes, lat: first.address.lat, lng: first.address.lng }] : [];
  });
  const mapPins: MapPin[] = groups.map(({ b, homes, lat, lng }) => ({
    id: b.id,
    lat,
    lng,
    count: homes.length,
    label: `${area(b.neighbourhoodSlug)}, ${t("home.collectionCount", { count: homes.length })}`,
  }));
  const mapPanels = Object.fromEntries(
    groups.map(({ b, homes }) => [
      b.id,
      <div key={b.id}>
        <p className="flex items-center gap-2 font-semibold">
          <Icon name="pin" size={16} strokeWidth={1.75} />
          {area(b.neighbourhoodSlug)}
          <span className="font-normal text-granite">· {b.street.replace(/\s\d+$/, "")}</span>
        </p>
        <div className="mt-6 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {homes.map((listing) => (
            <ListingCard key={listing.id} listing={listing} location={area(listing.neighbourhoodSlug)} query={cardQuery} />
          ))}
        </div>
      </div>,
    ]),
  );

  const buildingOptions: BuildingOption[] = [
    { id: null, label: t("apartments.allBuildings"), count: inTag.length, query: toQuery(search, { building: undefined }) },
    ...buildings.map((b) => ({
      id: b.slug,
      label: b.name,
      detail: `${b.street.replace(/\s\d+$/, "")} · ${area(b.neighbourhoodSlug)}`,
      count: inTag.filter((l) => l.buildingId === b.id).length,
      query: toQuery(search, { building: b.slug }),
    })),
  ];

  // Under the home page's 2px ink rule: collections as pills on the left, then the building
  // menu and list/map as a two-way pill on the right; the chosen one filled ink. On phones the
  // building menu and list/map come first, so the pills get the full width.
  const pill = (active: boolean) =>
    clsx(
      "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[0.9375rem] font-semibold whitespace-nowrap transition-colors",
      active ? "border-ink bg-ink text-paper" : "border-ink/20 hover:border-ink",
    );
  const segment = (active: boolean) =>
    clsx(
      "inline-flex h-8 items-center gap-2 rounded-full px-3.5 text-[0.9375rem] font-semibold transition-colors",
      active ? "bg-ink text-paper" : "hover:bg-ink/5",
    );

  return (
    <>
      <div className="mt-12 flex flex-col gap-4 border-t-2 border-ink pt-6 sm:flex-row sm:items-center sm:gap-3">
        <nav aria-label={t("apartments.filterLabel")} className="order-last min-w-0 sm:order-none sm:flex-1">
          <ul className="scrollbar-none -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] sm:mx-0 sm:px-0">
            <li>
              <Link href={{ pathname: "/apartments", query: toQuery(search, { tag: undefined }) }} aria-current={!search.tag ? "page" : undefined} className={pill(!search.tag)}>
                {t("apartments.all")}
                <span className="font-normal opacity-70">{inBuilding.length}</span>
              </Link>
            </li>
            {collections.map((c) => {
              const count = inBuilding.filter((l) => l.tags.includes(c.tag)).length;
              const active = search.tag === c.tag;
              return (
                <li key={c.tag}>
                  <Link
                    href={{ pathname: "/apartments", query: toQuery(search, { tag: c.tag }) }}
                    aria-current={active ? "page" : undefined}
                    className={pill(active)}
                  >
                    {t(`tags.${c.tag}`)}
                    <span className="font-normal opacity-70">{count}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        {/* Building + list/map: their own row above the pills on phones (the menu spans it). */}
        <div className="relative flex items-center justify-between gap-3">
          <BuildingFilter
            key={search.building ?? "all"}
            options={buildingOptions}
            activeId={search.building ?? null}
            label={t("apartments.buildingLabel")}
            buttonLabel={building?.name ?? t("apartments.buildingLabel")}
          />
          {/* List / map: links, so each view has its own URL. */}
          <div className="flex shrink-0 rounded-full border border-ink/20 p-1" role="group" aria-label={t("apartments.viewLabel")}>
            {(["list", "map"] as const).map((v) => {
              const active = (search.view ?? "list") === v;
              return (
                <Link
                  key={v}
                  href={{ pathname: "/apartments", query: toQuery(search, { view: v === "map" ? "map" : undefined }) }}
                  aria-current={active ? "page" : undefined}
                  className={segment(active)}
                >
                  <Icon name={v === "map" ? "pin" : "grid"} size={16} strokeWidth={1.75} />
                  <span className="sr-only sm:not-sr-only">{t(v === "map" ? "apartments.viewMap" : "apartments.viewList")}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* What's showing, quietly. */}
      <div role="status" className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-small text-granite">
        <p>
          {t("apartments.results", { count: shown.length })}
          {search.checkIn && search.checkOut
            ? ` ${t("apartments.available", { checkIn: d(search.checkIn), checkOut: d(search.checkOut) })}`
            : null}
          {search.guests ? ` ${t("apartments.forGuests", { guests: t("common.guests", { count: search.guests }) })}` : null}
        </p>
        {hasSearch || search.tag || building ? (
          <Link href="/apartments" className="link-quiet text-ink">
            {t("apartments.clear")}
          </Link>
        ) : null}
      </div>

      {shown.length && search.view === "map" ? (
        <div className="mt-8">
          <MapView
            pins={mapPins}
            panels={mapPanels}
            ariaLabel={t("apartments.mapLabel")}
            hint={t("apartments.mapHint")}
          />
        </div>
      ) : shown.length ? (
        <div className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              location={neighbourhoods.find((n) => n.slug === listing.neighbourhoodSlug)?.name ?? ""}
              query={cardQuery}
            />
          ))}
        </div>
      ) : (
        <p className="text-lead mt-10 max-w-xl">{t("apartments.none")}</p>
      )}
    </>
  );
}

/** Change dates and guests in place; starts from the URL, keeps collection and view. */
async function Search({ searchParams }: { searchParams: SearchParams }) {
  const locale = (await rootLocale()) as Locale;
  const search = parseSearch(await searchParams);
  const all = await getListings(locale);
  const maxGuests = Math.max(...all.map((l) => l.accommodates));
  const keep = {
    ...(search.tag ? { tag: search.tag } : {}),
    ...(search.building ? { building: search.building } : {}),
    ...(search.view ? { view: search.view } : {}),
  };
  return (
    // Keyed so "Clear search" resets the bar.
    <SearchStateProvider
      key={`${search.checkIn}-${search.checkOut}-${search.guests}`}
      initial={{ checkIn: search.checkIn, checkOut: search.checkOut, guests: search.guests }}
    >
      <SearchBar maxGuests={maxGuests} docked keepQuery={keep} calendarAlign="right" testId="apartments-search" />
    </SearchStateProvider>
  );
}

export default async function ApartmentsPage({ searchParams }: PageProps<"/[locale]/apartments">) {
  const t = await getTranslations("apartments");

  return (
    <section className="container-page section-y-tight">
      {/* Title and a line on the left, the search on the right (stacked below xl). */}
      <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-h2">{t("title")}</h1>
          <p className="text-lead mt-5 max-w-2xl">{t("body")}</p>
        </div>
        <div className="md:w-max xl:shrink-0">
          <Suspense fallback={<div aria-hidden className="h-[3.75rem] w-[36rem] max-w-full rounded-full border border-ink/15" />}>
            <Search searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
      {/* Filters + results read the URL, so they stream in under Suspense (Cache Components). */}
      <Suspense
        fallback={
          <div aria-hidden className="mt-12">
            <div className="flex items-center gap-2 border-t-2 border-ink pt-6">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-24 rounded-full bg-sand" />
              ))}
            </div>
            <div className="mt-[3.75rem] grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
