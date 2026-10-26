import { notFound } from "next/navigation";

/** Unknown paths inside a locale render the localized not-found page (next-intl pattern). */
export default function CatchAll() {
  notFound();
}

// This segment only ever 404s, so instant-navigation validation has nothing to check.
export const instant = false;
