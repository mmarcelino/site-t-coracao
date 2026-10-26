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
      <div
        ref={wrapper}
        className="grid gap-1 rounded-[1.75rem] bg-white p-2 shadow-[0_18px_50px_-20px_rgba(27,26,24,0.45)] md:grid-cols-[1.25fr_1fr_auto] md:items-center md:rounded-full md:pl-6"
      >
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="search-calendar"
            className="w-full px-4 py-3 text-left md:px-3"
          >
            <span className="block text-[0.8125rem] font-semibold">{t("dates")}</span>
            <span className="mt-1 flex items-center gap-2 border-b border-ink/20 pb-1.5 text-granite">
              <Icon name="calendar" size={18} className="shrink-0" />
              {dateLabel}
            </span>
          </button>
          {open ? (
            <div
              id="search-calendar"
              role="group"
              aria-label={t("calendarLabel")}
              className="animate-fade-in-fast absolute top-full left-0 z-30 mt-3 rounded-[var(--radius-card)] bg-white p-4 shadow-2xl md:p-6"
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
        <div className="px-4 py-2 md:px-3">
          <span className="block text-[0.8125rem] font-semibold">{t("guests")}</span>
          <div className="mt-1 border-b border-ink/20 pb-1 text-granite">
            <GuestsStepper value={guests} onChange={setGuests} max={maxGuests} />
          </div>
        </div>
        <button type="submit" className={buttonClasses("primary", "fluid", "md:ml-2")}>
          <Icon name="arrowUpRight" size={18} />
          {t("submit")}
        </button>
      </div>
    </form>
  );
}
