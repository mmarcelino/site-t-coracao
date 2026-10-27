"use client";

import clsx from "clsx";
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
export function SearchBar({
  maxGuests,
  calendarPlacement = "bottom",
}: {
  maxGuests: number;
  /** "top" when the bar sits at the bottom of a clipped area (the hero). */
  calendarPlacement?: "top" | "bottom";
}) {
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

  // One prompt only: "Quando?" under arrival; departure stays an empty underline until set.
  const placeholder = "text-granite";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const checkIn = range?.from ? localDateToISO(range.from) : undefined;
    const checkOut = range?.to ? localDateToISO(range.to) : undefined;
    track("search_submitted", { checkIn, checkOut, guests });
    router.push({
      pathname: "/apartments",
      query: {
        ...(checkIn && checkOut ? { checkIn, checkOut } : {}),
        guests: String(guests),
      },
    });
  }

  // Numa-style fields: small bold label over an underlined value.
  // On desktop fields are exactly the round button's height (64px), so the pill's 8px padding
  // reads as an even inset all the way round the button.
  const field = "flex w-full flex-col items-stretch justify-center px-5 py-2 text-left md:h-16 md:px-6 md:py-0";
  const fieldLabel = "block text-[0.8125rem] leading-tight font-semibold text-ink";
  const fieldValue = "mt-1.5 block w-full border-b border-ink/70 pb-1.5 text-[1rem] leading-tight text-ink";

  return (
    <form
      role="search"
      aria-label={t("label")}
      onSubmit={submit}
      className="relative w-full"
      data-testid="hero-search"
    >
      {/* Solid white pill spanning the content width; the hero's one interactive object. */}
      <div
        ref={wrapper}
        className="grid grid-cols-1 gap-y-1 rounded-[1.75rem] bg-white p-2 text-ink shadow-[0_24px_60px_-30px_rgba(0,0,0,0.55)] md:grid-cols-[1fr_1fr_1.2fr_auto] md:items-center md:gap-x-2 md:rounded-full md:pl-2"
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="search-calendar"
          className={field}
        >
          <span className={fieldLabel}>{t("arrive")}</span>
          <span className={clsx(fieldValue, !range?.from && placeholder)}>
            {range?.from ? format.dayMonth(range.from) : t("when")}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="search-calendar"
          className={field}
        >
          <span className={fieldLabel}>{t("depart")}</span>
          <span className={clsx(fieldValue, !range?.to && placeholder)}>
            {range?.to ? format.dayMonth(range.to) : "\u00a0"}
          </span>
        </button>
        <div className={field}>
          <span className={fieldLabel}>{t("guests")}</span>
          <div className="mt-1 border-b border-ink/70 pb-0.5 text-[1rem] text-ink">
            <GuestsStepper value={guests} onChange={setGuests} max={maxGuests} compact />
          </div>
        </div>
        <button
          type="submit"
          aria-label={t("submit")}
          className="mt-1 inline-flex h-14 items-center justify-center gap-3 rounded-full bg-ink px-8 text-[1rem] font-semibold whitespace-nowrap text-paper transition-colors hover:bg-azulejo md:mt-0 md:size-16 md:px-0"
        >
          <Icon name="search" size={22} strokeWidth={1.75} />
          {/* Label on phones (full-width button); magnifying glass only from md up. */}
          <span className="md:hidden">{t("submit")}</span>
        </button>

        {open ? (
          <div
            id="search-calendar"
            role="group"
            aria-label={t("calendarLabel")}
            className={clsx(
              // Sized to its content (two months side by side), anchored to the box's right edge.
              "animate-fade-in-fast absolute left-0 z-30 rounded-[var(--radius-card)] bg-white p-4 text-ink shadow-2xl md:right-0 md:left-auto md:w-max md:p-6",
              calendarPlacement === "top" ? "bottom-full mb-3" : "top-full mt-3",
            )}
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
    </form>
  );
}
