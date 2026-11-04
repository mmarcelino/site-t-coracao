"use client";

import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { requestBlockedNights, requestQuote } from "@/lib/actions/booking";
import { track } from "@/lib/analytics";
import { site } from "@/content/site";
import { isISODate, isoToLocalDate, localDateToISO, nightsBetween } from "@/lib/dates";
import type { QuoteResult } from "@/lib/data/types";
import { useFormat } from "@/lib/format";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { DateRangeCalendar } from "./DateRangeCalendar";
import { PriceBreakdown } from "./PriceBreakdown";
import { Reassurance } from "./Reassurance";

export interface BookingListing {
  id: string;
  slug: string;
  buildingId: string;
  title: string;
  buildingName: string;
  /** Lowest bookable nightly rate (the card's "from" price). */
  fromPrice: number;
  currency: string;
  minNights: number;
  accommodates: number;
  /** Formatted on the server ("9,7", "110"). */
  rating?: { score: string; count: string };
}

type QuoteState = { status: "idle" } | { status: "loading" } | { status: "done"; result: QuoteResult };

/**
 * Booking widget (live Guesty availability and quotes when keys are set; "Reserve" opens the
 * checkout, still a demo, CLAUDE.md §2). Desktop: sticky card beside the content.
 * Mobile: a compact bar pinned to the bottom that opens a full-screen sheet. One state for both.
 * Quotes and availability come through server actions, the seam for Guesty's Booking Engine API.
 */
export function BookingWidget({ listing }: { listing: BookingListing }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const format = useFormat();
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(Math.min(2, listing.accommodates));
  const [blocked, setBlocked] = useState<string[] | null>(null);
  // Separate flags: the desktop card stays mounted (CSS-hidden) on mobile, so it mustn't open too.
  const [cardCalendar, setCardCalendar] = useState(false);
  const [sheetCalendar, setSheetCalendar] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [quote, setQuote] = useState<QuoteState>({ status: "idle" });
  const opened = useRef(false);
  const sheetClose = useRef<HTMLButtonElement>(null);
  const sheetTrigger = useRef<HTMLButtonElement>(null);

  const checkIn = range?.from ? localDateToISO(range.from) : undefined;
  const checkOut = range?.to ? localDateToISO(range.to) : undefined;
  const money = (amount: number) => format.money(amount, listing.currency);
  const shortDate = (iso: string) => format.dayMonth(isoToLocalDate(iso));

  const ensureOpened = useCallback(() => {
    if (!opened.current) {
      opened.current = true;
      track("booking_widget_opened", { listingId: listing.id });
    }
    if (blocked === null) {
      requestBlockedNights(listing.id, localDateToISO(new Date())).then(setBlocked, () => setBlocked([]));
    }
  }, [blocked, listing.id]);

  // Prefill from the home search (?checkIn&checkOut&guests). Read once on mount, client-only.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("checkIn");
    const to = params.get("checkOut");
    const g = Number(params.get("guests"));
    // Syncing from the URL (an external source) once on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isISODate(from) && isISODate(to) && to > from) setRange({ from: isoToLocalDate(from), to: isoToLocalDate(to) });
    if (g >= 1) setGuests(Math.min(g, listing.accommodates));
  }, [listing.accommodates]);

  // Fetch a quote whenever a complete range + guest count is chosen.
  useEffect(() => {
    if (!checkIn || !checkOut || checkIn === checkOut) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuote({ status: "idle" });
      return;
    }
    let cancelled = false;
    setQuote({ status: "loading" });
    const nights = nightsBetween(checkIn, checkOut);
    track("dates_selected", { listingId: listing.id, checkIn, checkOut, nights });
    requestQuote({ listingId: listing.id, checkIn, checkOut, guests }).then(
      (result) => {
        if (cancelled) return;
        setQuote({ status: "done", result });
        if (result.ok) {
          track("quote_viewed", { listingId: listing.id, nights, guests, total: result.quote.total });
        }
      },
      () => !cancelled && setQuote({ status: "done", result: { ok: false, reason: "invalid-dates" } }),
    );
    return () => {
      cancelled = true;
    };
  }, [checkIn, checkOut, guests, listing.id]);

  // Mobile sheet: lock scroll, focus management, Escape to close.
  useEffect(() => {
    if (!sheetOpen) return;
    const trigger = sheetTrigger.current;
    document.body.style.overflow = "hidden";
    sheetClose.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheetOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [sheetOpen]);

  const okQuote = quote.status === "done" && quote.result.ok ? quote.result.quote : null;

  function onReserve() {
    if (!okQuote) return;
    track("checkout_started", {
      listingId: listing.id,
      nights: okQuote.nights,
      guests: okQuote.guests,
      total: okQuote.total,
    });
    // A full page load, not a client navigation: checkout must start without any third-party
    // script that may be running on this page (CLAUDE.md §16, payments).
    const query = new URLSearchParams({
      listing: listing.slug,
      checkIn: okQuote.checkIn,
      checkOut: okQuote.checkOut,
      guests: String(okQuote.guests),
    });
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- full load on purpose (above)
    window.location.assign(`${getPathname({ locale, href: "/checkout" })}?${query}`);
  }

  const whatsappMessage =
    checkIn && checkOut
      ? t("whatsapp.messageDates", {
          listing: listing.title,
          building: listing.buildingName,
          checkIn: shortDate(checkIn),
          checkOut: shortDate(checkOut),
        })
      : t("whatsapp.messageListing", { listing: listing.title, building: listing.buildingName });

  function errorMessage(result: Extract<QuoteResult, { ok: false }>) {
    switch (result.reason) {
      case "unavailable":
        return t("booking.unavailable");
      case "min-nights":
        return t("booking.minNights", { count: result.minNights ?? listing.minNights });
      case "max-guests":
        return t("booking.tooManyGuests", { count: listing.accommodates });
      case "error":
        return t("booking.quoteError");
      default:
        return t("booking.invalid");
    }
  }

  // One field group, one label style: dates on the first row, guests on the second, every value
  // starting on the same left edge. Helper text and the total follow on that edge too.
  const field = "block text-[0.75rem] leading-tight font-medium text-ink";
  const stepButton =
    "grid size-8 place-items-center rounded-full border border-ink/25 transition-colors hover:border-ink disabled:opacity-30 disabled:hover:border-ink/25";

  const body = (idPrefix: string, calendarOpen: boolean, setCalendarOpen: (fn: (v: boolean) => boolean) => void) => (
    <div className="space-y-5">
      <div>
        <div className="overflow-hidden rounded-[var(--radius-tile)] border border-ink/20">
          <button
            type="button"
            aria-expanded={calendarOpen}
            aria-controls={`${idPrefix}-calendar`}
            onClick={() => {
              ensureOpened();
              setCalendarOpen((v) => !v);
            }}
            className="grid w-full grid-cols-2 text-left transition-colors hover:bg-sand"
            data-testid="booking-dates"
          >
            <span className="border-r border-ink/20 px-4 py-3">
              <span className={field}>{t("booking.checkIn")}</span>
              <span className={clsx("mt-1 block", !checkIn && "text-granite")}>{checkIn ? shortDate(checkIn) : t("booking.addDate")}</span>
            </span>
            <span className="px-4 py-3">
              <span className={field}>{t("booking.checkOut")}</span>
              <span className={clsx("mt-1 block", !checkOut && "text-granite")}>{checkOut ? shortDate(checkOut) : t("booking.addDate")}</span>
            </span>
          </button>
          <div className="flex items-center justify-between gap-4 border-t border-ink/20 px-4 py-3">
            <div>
              <span id={`${idPrefix}-guests`} className={field}>
                {t("booking.guests")}
              </span>
              <output aria-labelledby={`${idPrefix}-guests`} aria-live="polite" className="mt-1 block tabular-nums">
                {t("common.guests", { count: guests })}
              </output>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                disabled={guests <= 1}
                aria-label={t("search.fewerGuests")}
                className={stepButton}
              >
                <Icon name="minus" size={14} />
              </button>
              <button
                type="button"
                onClick={() => setGuests(Math.min(listing.accommodates, guests + 1))}
                disabled={guests >= listing.accommodates}
                aria-label={t("search.moreGuests")}
                className={stepButton}
              >
                <Icon name="plus" size={14} />
              </button>
            </div>
          </div>
        </div>
        {calendarOpen ? (
          <div id={`${idPrefix}-calendar`} className="animate-fade-in-fast mt-3 rounded-[var(--radius-tile)] border border-ink/10 bg-white p-3">
            <DateRangeCalendar
              selected={range}
              onSelect={setRange}
              blockedNights={blocked ?? []}
              minNights={Math.max(listing.minNights, site.minNights)}
            />
            <div className="flex items-center justify-between border-t border-ink/10 px-1 pt-3">
              <button
                type="button"
                onClick={() => setRange(undefined)}
                className="link-quiet text-small disabled:opacity-40"
                disabled={!range}
              >
                {t("search.clearDates")}
              </button>
              <button type="button" onClick={() => setCalendarOpen(() => false)} className={buttonClasses("secondary", "sm")}>
                {t("search.done")}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="min-h-[1.5rem]">
        {quote.status === "idle" ? (
          <p className="text-small text-granite">
            {t("booking.minNightsHint", { count: listing.minNights })} {t("booking.maxGuests", { count: listing.accommodates })}.
          </p>
        ) : quote.status === "loading" ? (
          <p className="text-small text-granite" aria-live="polite">
            {t("booking.loading")}
          </p>
        ) : quote.result.ok ? (
          <PriceBreakdown quote={quote.result.quote} />
        ) : (
          <p className="text-small" role="alert">
            {errorMessage(quote.result)}
          </p>
        )}
      </div>

      <div>
        <button
          type="button"
          onClick={onReserve}
          disabled={!okQuote}
          className={buttonClasses("primary", "lg", "w-full")}
          data-testid="booking-reserve"
        >
          {t("booking.reserve")}
        </button>
        <p className="text-small mt-3 text-center text-granite">{t("booking.noChargeYet")}</p>
      </div>
    </div>
  );

  // "from 300 € / night" on one baseline, the rating on the right edge (links to the reviews).
  const price = (
    <p className="whitespace-nowrap">
      <span className="text-small text-granite">{t("common.from")} </span>
      <span className="text-h3 font-semibold">{money(listing.fromPrice)}</span>
      <span className="text-small text-granite"> {t("common.perNight")}</span>
    </p>
  );
  const priceFrom = (
    <div className="flex items-baseline justify-between gap-4">
      {price}
      {listing.rating ? (
        <a href="#reviews" className="inline-flex items-center gap-1.5 text-small whitespace-nowrap">
          <Icon name="star" size={13} fill="currentColor" strokeWidth={0} />
          <span className="font-semibold">{listing.rating.score}</span>
          <span className="link-quiet text-granite">{t("reviews.basedOn", { count: listing.rating.count })}</span>
        </a>
      ) : null}
    </div>
  );

  // Concierge + trust lines, inside the card under a hairline: one icon column, one text size.
  const extras = (
    <div className="space-y-2.5 border-t border-ink/10 pt-5 text-[0.8125rem]">
      <WhatsAppLink message={whatsappMessage} page="listing" listingId={listing.id} icon={false} className="flex items-start gap-3 font-semibold">
        <Icon name="whatsapp" size={16} className="mt-0.5 shrink-0" />
        <span className="link-quiet">{t("whatsapp.cta")}</span>
      </WhatsAppLink>
      <Reassurance />
    </div>
  );

  return (
    <>
      {/* Desktop: sticky card */}
      <div className="sticky top-[calc(var(--header-h)+2rem)] hidden lg:block" data-testid="booking-widget">
        <div className="space-y-6 rounded-[var(--radius-card)] border border-ink/10 bg-white p-6 shadow-[0_1px_0_rgba(27,26,24,0.04),0_24px_60px_-30px_rgba(27,26,24,0.25)]">
          <div>
            <p className="label mb-2 text-granite">{t("booking.title")}</p>
            {priceFrom}
          </div>
          {body("desktop", cardCalendar, setCardCalendar)}
          {extras}
        </div>
      </div>

      {/* Mobile: compact bar + sheet */}
      <div
        data-bottom-bar
        className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-paper/95 backdrop-blur-md lg:hidden"
        data-testid="booking-bar"
      >
        <div className="container-page flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            {okQuote ? (
              <p className="truncate">
                <span className="font-medium">{money(okQuote.total)}</span>
                <span className="text-small text-granite">
                  {" · "}
                  {shortDate(okQuote.checkIn)} – {shortDate(okQuote.checkOut)}
                </span>
              </p>
            ) : (
              price
            )}
            <p className="text-[0.75rem] text-granite">{t("booking.bestRate")}</p>
          </div>
          <button
            ref={sheetTrigger}
            type="button"
            onClick={() => {
              ensureOpened();
              setSheetCalendar(!okQuote);
              setSheetOpen(true);
            }}
            className={buttonClasses("primary", "md", "shrink-0")}
            aria-haspopup="dialog"
          >
            {okQuote ? t("booking.reserve") : t("booking.checkAvailability")}
          </button>
        </div>
      </div>

      {sheetOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-sheet-title"
          className="animate-fade-in-fast fixed inset-0 z-50 overflow-y-auto bg-paper lg:hidden"
        >
          <div className="sticky top-0 z-10 flex h-[var(--header-h)] items-center justify-between border-b border-ink/10 bg-paper px-[var(--gutter)]">
            <div>
              <p id="booking-sheet-title" className="font-medium">
                {listing.title}
              </p>
              <p className="text-small text-granite">{listing.buildingName}</p>
            </div>
            <button ref={sheetClose} type="button" onClick={() => setSheetOpen(false)} className="-mr-2 p-2">
              <Icon name="close" size={26} />
              <span className="sr-only">{t("booking.closeSheet")}</span>
            </button>
          </div>
          <div className="container-page max-w-lg py-8">
            <div className="mb-6">{price}</div>
            {body("sheet", sheetCalendar, setSheetCalendar)}
            <div className="mt-8">{extras}</div>
          </div>
        </div>
      ) : null}
    </>
  );
}
