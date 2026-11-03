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
 * All apartments, filterable by collection tags (?tag=couples,views), by building (?building=<slug>)
 * and by the home search (?checkIn&checkOut&guests: capacity + mock availability). Collections are
 * multi-select and widen the results (homes in any of them); every other filter narrows them (and).
 * Filters are links, so every filtered view has a shareable URL. ?view=map shows the same results on a street map, one
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
  /** Collections; a home matches if it is in any of them. Empty = all. */
  tags: ListingTag[];
  /** Building slug; checked against the buildings in Results. */
  building?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

function parseSearch(sp: Awaited<SearchParams>): Search {
  const str = (v: unknown) => (typeof v === "string" ? v : undefined);
  // `tag` is a comma list (?tag=couples,views); repeated params (?tag=a&tag=b) work too.
  const tagParam = Array.isArray(sp.tag) ? sp.tag.join(",") : (str(sp.tag) ?? "");
  const tags = listingTags.filter((t) => tagParam.split(",").includes(t));
  const checkIn = str(sp.checkIn);
  const checkOut = str(sp.checkOut);
  const guests = Number(sp.guests);
  const datesOk = isISODate(checkIn) && isISODate(checkOut) && checkOut > checkIn;
  return {
    view: str(sp.view) === "map" ? "map" : undefined,
    tags,
    building: str(sp.building),
    ...(datesOk ? { checkIn, checkOut } : {}),
    guests: Number.isInteger(guests) && guests > 0 ? guests : undefined,
  };
}

/** The current search as a query, with some filters changed (pass `undefined` / `[]` to drop one). */
function toQuery(search: Search, patch: Partial<Pick<Search, "view" | "tags" | "building">> = {}) {
  const { view, tags, building } = { ...search, ...patch };
  return {
    ...(view ? { view } : {}),
    ...(tags.length ? { tag: tags.join(",") } : {}),
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
  const cardQuery = toQuery(search, { view: undefined, tags: [], building: undefined });

  // Capacity + dates first (they define what's bookable), then collections and building on top.
  // Each filter's counts take the other filter into account.
  const bookable: Listing[] = [];
  for (const l of all) {
    if (search.guests && l.accommodates < search.guests) continue;
    if (search.checkIn && search.checkOut && !(await isRangeAvailable(l.id, search.checkIn, search.checkOut))) continue;
    bookable.push(l);
  }
  const inAnyTag = (tags: ListingTag[]) => (l: Listing) => !tags.length || tags.some((tag) => l.tags.includes(tag));
  const inBuilding = building ? bookable.filter((l) => l.buildingId === building.id) : bookable;
  const inTag = bookable.filter(inAnyTag(search.tags));
  const shown = building ? inTag.filter((l) => l.buildingId === building.id) : inTag;
  const hasSearch = Boolean(search.checkIn || search.guests);
  const tagName = (tag: ListingTag) => t(`tags.${tag}`);

  // Nothing matches: offer the filters that would bring homes back, one tap each, with their
  // counts. Collections and building only; dates and guests are the stay itself.
  const fixes = shown.length
    ? []
    : [
        ...(search.tags.length
          ? [{
              label: search.tags.length === 1 ? t("apartments.remove", { filter: tagName(search.tags[0]!) }) : t("apartments.removeCollections"),
              count: inBuilding.length,
              query: toQuery(search, { tags: [] }),
            }]
          : []),
        ...(building
          ? [{ label: t("apartments.remove", { filter: building.name }), count: inTag.length, query: toQuery(search, { building: undefined }) }]
          : []),
      ].filter((f) => f.count > 0);
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
        {/* Choosing a pin scrolls down to here, away from the list/map switch: a way back. */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <p className="flex items-center gap-2 font-semibold">
            <Icon name="pin" size={16} strokeWidth={1.75} />
            {area(b.neighbourhoodSlug)}
            <span className="font-normal text-granite">· {b.street.replace(/\s\d+$/, "")}</span>
          </p>
          <Link
            href={{ pathname: "/apartments", query: toQuery(search, { view: undefined }) }}
            className="inline-flex items-center gap-2 text-small font-semibold"
          >
            <Icon name="grid" size={16} strokeWidth={1.75} />
            <span className="link-quiet">{t("apartments.backToList")}</span>
          </Link>
        </div>
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
  // menu and list/map as a two-way pill on the right; chosen ones filled ink. Collection pills
  // toggle (a chosen one shows × and removes itself); "All" clears them. On phones the building
  // menu and list/map come first, so the pills get the full width.
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
              <Link href={{ pathname: "/apartments", query: toQuery(search, { tags: [] }) }} aria-current={!search.tags.length ? "true" : undefined} className={pill(!search.tags.length)}>
                {t("apartments.all")}
                <span className="font-normal opacity-70">{inBuilding.length}</span>
              </Link>
            </li>
            {collections.map((c) => {
              const count = inBuilding.filter((l) => l.tags.includes(c.tag)).length;
              const active = search.tags.includes(c.tag);
              const tags = active ? search.tags.filter((tag) => tag !== c.tag) : [...search.tags, c.tag];
              return (
                <li key={c.tag}>
                  <Link
                    href={{ pathname: "/apartments", query: toQuery(search, { tags }) }}
                    aria-current={active ? "true" : undefined}
                    className={pill(active)}
                  >
                    {tagName(c.tag)}
                    <span className="font-normal opacity-70">{count}</span>
                    {active ? <Icon name="close" size={14} strokeWidth={2} className="-mr-1" /> : null}
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
        {hasSearch || search.tags.length || building ? (
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
        <div className="mt-10 max-w-xl">
          <p className="text-lead">{t("apartments.none")}</p>
          {fixes.length ? (
            <ul className="mt-6 flex flex-wrap gap-2">
              {fixes.map((f) => (
                <li key={f.label}>
                  <Link href={{ pathname: "/apartments", query: f.query }} className={pill(false)}>
                    {f.label}
                    <span className="font-normal opacity-70">{f.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
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
    ...(search.tags.length ? { tag: search.tags.join(",") } : {}),
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
