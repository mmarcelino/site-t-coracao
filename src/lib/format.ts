import { useLocale } from "next-intl";

/**
 * Number/date formatting with the right regional conventions. Our route locales are `pt` and
 * `en`, but bare `pt` means Brazilian Portuguese to Intl ("€ 60" instead of "60 €") and bare `en`
 * means US English. Map to the variants this site speaks: pt-PT and en-GB.
 * Same shape as next-intl's formatter, so call sites read the same.
 */
const intlTags: Record<string, string> = { pt: "pt-PT", en: "en-GB" };

export function intlLocale(locale: string): string {
  return intlTags[locale] ?? locale;
}

export function createFormatter(locale: string) {
  const tag = intlLocale(locale);
  return {
    number: (value: number, options?: Intl.NumberFormatOptions) => new Intl.NumberFormat(tag, options).format(value),
    // No timeZone on purpose: calendar dates are built as local midnight (see lib/dates).
    dateTime: (date: Date, options?: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(tag, options).format(date),
    dateTimeRange: (start: Date, end: Date, options?: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(tag, options).formatRange(start, end),
    money: (amount: number, currency = "EUR") =>
      new Intl.NumberFormat(tag, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount),
  };
}

/** For components (server or client) rendered inside the intl provider. */
export function useFormat() {
  return createFormatter(useLocale());
}
