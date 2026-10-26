import { getRequestConfig } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { defaultLocale, isLocale } from "./routing";

export default getRequestConfig(async ({ locale: override }) => {
  const requested = override ?? (await rootLocale());
  const locale = isLocale(requested) ? requested : defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: "Europe/Lisbon",
  };
});
