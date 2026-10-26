"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { DayPicker, type DateRange, type Matcher } from "react-day-picker";
import { enGB } from "react-day-picker/locale/en-GB";
import { pt } from "react-day-picker/locale/pt";
import { isoToLocalDate } from "@/lib/dates";
import "react-day-picker/style.css";

/**
 * Accessible range calendar (react-day-picker: full keyboard support, ARIA grid).
 * Only rendered once opened, so "today" is never evaluated during prerendering.
 */
export function DateRangeCalendar({
  selected,
  onSelect,
  blockedNights = [],
  months = 1,
}: {
  selected: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  blockedNights?: string[];
  months?: 1 | 2;
}) {
  const locale = useLocale();
  const t = useTranslations("booking");

  const disabled = useMemo<Matcher[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return [{ before: today }, ...blockedNights.map(isoToLocalDate)];
  }, [blockedNights]);

  return (
    <DayPicker
      mode="range"
      selected={selected}
      onSelect={onSelect}
      disabled={disabled}
      excludeDisabled
      numberOfMonths={months}
      pagedNavigation
      showOutsideDays={false}
      weekStartsOn={1}
      locale={locale === "pt" ? pt : enGB}
      className="tc-calendar"
      aria-label={t("calendarLabel")}
      modifiersClassNames={{ disabled: "tc-day-unavailable" }}
    />
  );
}
