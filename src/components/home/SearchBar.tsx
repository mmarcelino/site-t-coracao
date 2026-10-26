"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";
import { useRouter } from "@/i18n/navigation";
import { track } from "@/lib/analytics";
import { localDateToISO } from "@/lib/dates";
import { useFormat } from "@/lib/format";
import { DateRangeCalendar } from "@/components/booking/DateRangeCalendar";
import { GuestsStepper } from "@/components/booking/GuestsStepper";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/** Hero search: dates + guests → apartments list. The one primary action on the home page. */
export function SearchBar({ maxGuests }: { maxGuests: number }) {
  const t = useTranslations("search");
  const format = useFormat();
  const router = useRouter();
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);
  const [open, setOpen] = useState(false);
  const [months, setMonths] = useState<1 | 2>(1);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setMonths(mq.matches ? 2 : 1);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (wrapper.current && !wrapper.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const dateLabel =
    range?.from && range.to
      ? format.dateTimeRange(range.from, range.to, { day: "numeric", month: "short" })
      : range?.from
        ? format.dateTime(range.from, { day: "numeric", month: "short" })
        : t("addDates");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const checkIn = range?.from ? localDateToISO(range.from) : undefined;
    const checkOut = range?.to ? localDateToISO(range.to) : undefined;
    track("search_submitted", { checkIn, checkOut, guests });
    router.push({
      pathname: "/apartments",
      query: { ...(checkIn && checkOut ? { checkIn, checkOut } : {}), guests: String(guests) },
    });
  }

  return (
    <form
      role="search"
      aria-label={t("label")}
      onSubmit={submit}
      className="relative w-full text-ink"
      data-testid="hero-search"
    >
      <div ref={wrapper} className="grid bg-paper md:grid-cols-[1.3fr_1fr_auto]">
        <div className="relative border-b border-ink/10 md:border-r md:border-b-0">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="search-calendar"
            className="flex w-full items-center gap-4 px-5 py-4 text-left md:px-6 md:py-5"
          >
            <Icon name="calendar" size={22} className="shrink-0 text-granite" />
            <span>
              <span className="label block text-granite">{t("dates")}</span>
              <span className="mt-1 block">{dateLabel}</span>
            </span>
          </button>
          {open ? (
            <div
              id="search-calendar"
              role="group"
              aria-label={t("calendarLabel")}
              className="animate-fade-in-fast absolute top-full left-0 z-30 mt-2 bg-white p-4 shadow-2xl md:p-6"
            >
              <DateRangeCalendar selected={range} onSelect={setRange} months={months} />
              <div className="mt-2 flex items-center justify-between border-t border-ink/10 pt-4">
                <button type="button" onClick={() => setRange(undefined)} className="link-quiet text-small">
                  {t("clearDates")}
                </button>
                <button type="button" onClick={() => setOpen(false)} className={buttonClasses("secondary", "sm")}>
                  {t("done")}
                </button>
              </div>
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-4 px-5 py-3 md:px-6">
          <Icon name="guests" size={22} className="shrink-0 text-granite" />
          <div className="flex-1">
            <span className="label block text-granite">{t("guests")}</span>
            <GuestsStepper value={guests} onChange={setGuests} max={maxGuests} />
          </div>
        </div>
        <button type="submit" className={buttonClasses("primary", "fluid", "md:px-9")}>
          {t("submit")}
          <Icon name="arrowRight" size={18} />
        </button>
      </div>
    </form>
  );
}
