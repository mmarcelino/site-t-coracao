import type { StaticPathname } from "@/i18n/routing";
import type { Messages } from "next-intl";

/** Main navigation. Collections replace buildings on the home page, so buildings aren't listed. */
export const primaryNav: Array<{ href: StaticPathname; key: keyof Messages["nav"] }> = [
  { href: "/apartments", key: "apartments" },
  { href: "/neighbourhoods", key: "neighbourhoods" },
  { href: "/experiences", key: "experiences" },
  { href: "/about", key: "about" },
  { href: "/property-management", key: "owners" },
];

/** Links always visible in the desktop header (client's priority order). Others: menu + footer. */
export const headerNav: Array<{ href: StaticPathname; key: keyof Messages["nav"] }> = [
  { href: "/apartments", key: "apartments" },
  { href: "/experiences", key: "experiences" },
  { href: "/about", key: "about" },
  { href: "/property-management", key: "owners" },
];

/** Footer "Explore" column: the header's links plus the help pages. */
export const footerNav: Array<{ href: StaticPathname; key: keyof Messages["nav"] }> = [
  { href: "/apartments", key: "apartments" },
  { href: "/experiences", key: "experiences" },
  { href: "/about", key: "about" },
  { href: "/property-management", key: "owners" },
  { href: "/faq", key: "faq" },
  { href: "/contact", key: "contact" },
];
