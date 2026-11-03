import { useLocale } from "next-intl";

/**
 * Number/date formatting with the right regional conventions. Our route locales are `pt` and
 * `en`, but bare `pt` means Brazilian Portuguese to Intl ("€ 60" instead of "60 €") and bare `en`
 * means US English. Map to the variants this site speaks: pt-PT and en-GB.
 * Same shape as next-intl's formatter, so call sites read the same.
 *
 * Thousands are always grouped, from 1,000 up: "6,000" (en-GB), "6 000" (pt-PT, non-breaking space).
 * pt-PT on its own leaves four-digit numbers ungrouped ("6000" but "12 000"). Numbers written into
 * content files follow the same rule by hand.
 */
const grouping = { useGrouping: "always" } as const;
const intlTags: Record<string, string> = { pt: "pt-PT", en: "en-GB" };

export function intlLocale(locale: string): string {
  return intlTags[locale] ?? locale;
}

export function createFormatter(locale: string) {
  const tag = intlLocale(locale);
  return {
    number: (value: number, options?: Intl.NumberFormatOptions) => new Intl.NumberFormat(tag, { ...grouping, ...options }).format(value),
    // No timeZone on purpose: calendar dates are built as local midnight (see lib/dates).
    dateTime: (date: Date, options?: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(tag, options).format(date),
    dateTimeRange: (start: Date, end: Date, options?: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(tag, options).formatRange(start, end),
    /** "4 dez." / "4 Dec": Intl's pt-PT short day+month is numeric ("4/12"), so build it. */
    dayMonth: (date: Date) => `${date.getDate()} ${new Intl.DateTimeFormat(tag, { month: "short" }).format(date)}`,
    /** "60 €" in every locale: the symbol always follows the number (client's style; en-GB alone would give "€60"). */
    money: (amount: number, currency = "EUR") => {
      const parts = new Intl.NumberFormat(tag, { ...grouping, style: "currency", currency, maximumFractionDigits: 0 }).formatToParts(amount);
      const symbol = parts.find((p) => p.type === "currency")?.value ?? currency;
      const number = parts
        .filter((p) => p.type !== "currency")
        .map((p) => p.value)
        .join("")
        .trim();
      return `${number}\u00a0${symbol}`;
    },
  };
}

/** For components (server or client) rendered inside the intl provider. */
export function useFormat() {
  return createFormatter(useLocale());
}
