import { useLocale } from "next-intl";

/**
 * Number/date formatting with the right regional conventions. Our route locales are `pt` and
 * `en`, but bare `pt` means Brazilian Portuguese to Intl ("€ 60" instead of "60 €") and bare `en`
 * means US English. Map to the variants this site speaks: pt-PT and en-GB.
 * Same shape as next-intl's formatter, so call sites read the same.
 *
 * Thousands: one style in every locale (client's choice), a non-breaking space from 1 000 up:
 * "6 000", "1 200 €". en-GB would write "6,000", and pt-PT alone leaves four-digit numbers bare
 * ("6000" but "12 000"). Numbers written into content files follow the same rule by hand (\u00a0).
 */
const grouping = { useGrouping: "always" } as const;

/** Intl's parts joined back, with every thousands separator as a non-breaking space. */
const joinParts = (parts: Intl.NumberFormatPart[]) =>
  parts.map((p) => (p.type === "group" ? "\u00a0" : p.value)).join("");
const intlTags: Record<string, string> = { pt: "pt-PT", en: "en-GB" };

export function intlLocale(locale: string): string {
  return intlTags[locale] ?? locale;
}

export function createFormatter(locale: string) {
  const tag = intlLocale(locale);
  return {
    number: (value: number, options?: Intl.NumberFormatOptions) =>
      joinParts(new Intl.NumberFormat(tag, { ...grouping, ...options }).formatToParts(value)),
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
      const number = joinParts(parts.filter((p) => p.type !== "currency")).trim();
      return `${number}\u00a0${symbol}`;
    },
  };
}

/** For components (server or client) rendered inside the intl provider. */
export function useFormat() {
  return createFormatter(useLocale());
}
