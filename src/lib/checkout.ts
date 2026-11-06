import { locales, routing } from "@/i18n/routing";

/**
 * Checkout pages (payment step) get special treatment (CLAUDE.md §11, payments decision 2026-11-04):
 * no third-party scripts at all, so analytics never loads there and a strict Content Security
 * Policy is sent for these paths (`next.config.ts`, which keeps its own copy of the paths).
 */
export const checkoutPaths: string[] = locales.map((locale) => `/${locale}${routing.pathnames["/checkout"][locale]}`);

export function isCheckoutPath(pathname: string): boolean {
  return checkoutPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
