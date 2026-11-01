"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { track } from "@/lib/analytics";
import { localDateToISO } from "@/lib/dates";
import { useFormat } from "@/lib/format";
import { DateRangeCalendar } from "@/components/booking/DateRangeCalendar";
import { GuestsStepper } from "@/components/booking/GuestsStepper";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useSearchState } from "./SearchState";

/** Hero search: dates + guests → apartments list. The one primary action on the home page. */
export function SearchBar({
  maxGuests,
  calendarPlacement = "bottom",
  docked = false,
  testId = "hero-search",
}: {
  maxGuests: number;
  /** "top" when the bar sits at the bottom of a clipped area (the hero). */
  calendarPlacement?: "top" | "bottom";
  /** The slim copy docked at the top of the screen once the hero has scrolled away. */
  docked?: boolean;
  testId?: string;
}) {
  const t = useTranslations("search");
  const format = useFormat();
  const router = useRouter();
  const { range, setRange, guests, setGuests } = useSearchState();
  const calendarId = useId();
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

  // One prompt only: "Quando?" under arrival, a quiet dash under departure until dates are set.
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

  // A pill bar, flush fields with thin ink dividers, ending in a round search button (md up).
  // The docked copy stays slim at every width (no larger "hd" sizes).
  const field = clsx(
    "flex min-h-14 w-full flex-col justify-center px-5 py-2.5 text-left md:w-auto md:py-0",
    docked ? "md:h-11 md:min-h-0" : "md:h-14 hd:h-16 hd:px-6",
  );
  // Small sentence-case labels; values (dates and guests alike) in one size.
  const fieldLabel = clsx("block text-[0.75rem] leading-tight text-granite", !docked && "hd:text-[0.8125rem]");
  const valueText = clsx("text-[0.9375rem] leading-tight font-medium text-ink", !docked && "hd:text-[1.0625rem]");
  // Label-to-value gap leaves room for the guest stepper's circles, which are taller than the text line.
  const valueGap = docked ? "mt-1.5" : "mt-2.5";
  const fieldValue = clsx("block", valueGap, valueText);

  return (
    <form
      role="search"
      aria-label={t("label")}
      onSubmit={submit}
      className="relative w-full"
      data-testid={testId}
    >
      {/* Solid white bar: the one interactive object at the bottom of the hero. */}
      <div
        ref={wrapper}
        className={clsx(
          "grid grid-cols-1 rounded-[1.75rem] bg-white text-ink md:grid-cols-[9rem_9rem_13rem_auto] md:items-center md:rounded-full md:p-2 md:pl-3",
          docked ? "border border-ink/15 md:p-1.5" : "overflow-hidden hd:grid-cols-[11.5rem_11.5rem_15rem_auto]",
        )}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={calendarId}
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
          aria-controls={calendarId}
          className={clsx(field, "border-t border-ink/15 md:border-t-0 md:border-l")}
        >
          <span className={fieldLabel}>{t("depart")}</span>
          <span className={clsx(fieldValue, !range?.to && placeholder)}>
            {range?.to ? format.dayMonth(range.to) : "—"}
          </span>
        </button>
        <div className={clsx(field, "border-t border-ink/15 md:border-t-0 md:border-l")}>
          <span className={fieldLabel}>{t("guests")}</span>
          <div className={clsx("flex h-[1.25em] items-center *:flex-1", valueGap, valueText, docked && "[&_button]:size-6")}>
            <GuestsStepper value={guests} onChange={setGuests} max={maxGuests} compact />
          </div>
        </div>
        <button
          type="submit"
          aria-label={t("submit")}
          className={clsx(
            "inline-flex h-14 items-center justify-center gap-3 bg-ink px-7 text-[0.9375rem] font-semibold whitespace-nowrap text-paper transition-colors hover:bg-ink-soft md:ml-1 md:rounded-full md:px-0",
            docked ? "md:size-11" : "md:size-14 hd:size-16",
          )}
        >
          <Icon name="search" size={20} strokeWidth={1.75} />
          {/* Full label on phones (full-width block); icon only in the round button from md up. */}
          <span className="md:hidden">{t("submit")}</span>
        </button>

        {open ? (
          <div
            id={calendarId}
            role="group"
            aria-label={t("calendarLabel")}
            className={clsx(
              // Sized to its content (two months side by side), anchored to the bar's left edge (the bar
              // sits on the left margin, so the calendar opens over the photo, not off-screen).
              "animate-fade-in-fast absolute left-0 z-30 rounded-[var(--radius-card)] bg-white p-4 text-ink shadow-2xl md:w-max md:p-6",
              calendarPlacement === "top" ? "bottom-full mb-2" : "top-full mt-2",
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
