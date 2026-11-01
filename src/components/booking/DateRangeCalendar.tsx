"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { DayPicker, type DateRange, type Matcher } from "react-day-picker";
import { enGB } from "react-day-picker/locale/en-GB";
import { pt } from "react-day-picker/locale/pt";
import { isoToLocalDate, localDateToISO } from "@/lib/dates";
import "react-day-picker/style.css";

const DAY_MS = 24 * 60 * 60 * 1000;
const nights = (from: Date, to: Date) => Math.round((to.getTime() - from.getTime()) / DAY_MS);

/**
 * Accessible range calendar (react-day-picker: full keyboard support, ARIA grid).
 * Only rendered once opened, so "today" is never evaluated during prerendering.
 *
 * Selection is ours, not the library's: the first click sets arrival only; the next sets departure,
 * unless it's shorter than `minNights` (then a tooltip says so and arrival stays) or before arrival
 * (then it becomes the new arrival). A click on a complete range starts over.
 */
export function DateRangeCalendar({
  selected,
  onSelect,
  blockedNights = [],
  months = 1,
  minNights = 1,
}: {
  selected: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  blockedNights?: string[];
  months?: 1 | 2;
  minNights?: number;
}) {
  const locale = useLocale();
  const t = useTranslations("booking");
  const wrapper = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);

  const disabled = useMemo<Matcher[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return [{ before: today }, ...blockedNights.map(isoToLocalDate)];
  }, [blockedNights]);

  // The tooltip fades on its own after a moment.
  useEffect(() => {
    if (!tip) return;
    const id = window.setTimeout(() => setTip(null), 2500);
    return () => window.clearTimeout(id);
  }, [tip]);

  function onDayClick(day: Date, _modifiers: unknown, e: MouseEvent) {
    setTip(null);
    const from = selected?.from;
    if (!from || selected?.to || day <= from) return onSelect({ from: day, to: undefined });
    // A blocked night inside the stay: start again from this day.
    const blocked = new Set(blockedNights);
    for (let d = new Date(from); d < day; d = new Date(d.getTime() + DAY_MS)) {
      if (blocked.has(localDateToISO(d))) return onSelect({ from: day, to: undefined });
    }
    if (nights(from, day) < minNights) {
      const box = wrapper.current?.getBoundingClientRect();
      const cell = (e.currentTarget as HTMLElement).getBoundingClientRect();
      if (box) setTip({ x: cell.left + cell.width / 2 - box.left, y: cell.top - box.top });
      return;
    }
    onSelect({ from, to: day });
  }

  return (
    <div ref={wrapper} className="relative">
      <DayPicker
        mode="range"
        selected={selected}
        // Controlled: the library's own range logic is bypassed (it would pick a one-night stay).
        onSelect={() => {}}
        onDayClick={onDayClick}
        disabled={disabled}
        numberOfMonths={months}
        pagedNavigation
        showOutsideDays={false}
        weekStartsOn={1}
        locale={locale === "pt" ? pt : enGB}
        className="tc-calendar"
        aria-label={t("calendarLabel")}
        modifiersClassNames={{ disabled: "tc-day-unavailable" }}
      />
      {/* Also announced to screen readers. */}
      <p role="status" className="sr-only">
        {tip ? t("minNightsTooltip", { count: minNights }) : ""}
      </p>
      {tip ? (
        <span
          aria-hidden
          className="animate-fade-in-fast pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full pb-2 whitespace-nowrap"
          style={{ left: tip.x, top: tip.y }}
        >
          <span className="relative block rounded-full bg-ink px-3.5 py-2 text-[0.8125rem] leading-none font-medium text-paper shadow-[0_8px_20px_-8px_rgba(27,26,24,0.5)]">
            {t("minNightsTooltip", { count: minNights })}
            <span className="absolute top-full left-1/2 -ml-1 size-2 -translate-y-1 rotate-45 bg-ink" />
          </span>
        </span>
      ) : null}
    </div>
  );
}
