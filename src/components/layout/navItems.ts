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

/** Guest links in the centre of the desktop header (client's priority order). */
export const headerNav: Array<{ href: StaticPathname; key: keyof Messages["nav"] }> = [
  { href: "/apartments", key: "apartments" },
  { href: "/about", key: "about" },
  { href: "/experiences", key: "experiences" },
];

/** The owners' entry point: a different audience, so it sits with the utilities on the right. */
export const ownersNav: { href: StaticPathname; key: keyof Messages["nav"] } = { href: "/property-management", key: "owners" };

/** Footer "Explore" column: the header's links plus the help pages. */
export const footerNav: Array<{ href: StaticPathname; key: keyof Messages["nav"] }> = [
  { href: "/apartments", key: "apartments" },
  { href: "/about", key: "about" },
  { href: "/experiences", key: "experiences" },
  { href: "/property-management", key: "owners" },
  { href: "/reviews", key: "reviews" },
  { href: "/faq", key: "faq" },
];

/** Full-screen menu: the header's links plus the FAQ (the logo links home). */
export const menuNav: Array<{ href: StaticPathname; key: keyof Messages["nav"] }> = [...headerNav, ownersNav, { href: "/faq", key: "faq" }];
