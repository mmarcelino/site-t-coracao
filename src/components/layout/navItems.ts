import type { StaticPathname } from "@/i18n/routing";
import type { Messages } from "next-intl";

export const primaryNav: Array<{ href: StaticPathname; key: keyof Messages["nav"] }> = [
  { href: "/apartments", key: "apartments" },
  { href: "/buildings", key: "buildings" },
  { href: "/neighbourhoods", key: "neighbourhoods" },
  { href: "/experiences", key: "experiences" },
  { href: "/property-management", key: "owners" },
];
