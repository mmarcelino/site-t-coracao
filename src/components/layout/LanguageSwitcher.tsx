"use client";

import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { track } from "@/lib/analytics";

/** Switches locale while staying on the equivalent page (localized slug, same params and query). */
export function LanguageSwitcher({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const t = useTranslations("language");
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;
    track("language_switched", { from: locale, to: next });
    // Read at click time (not useSearchParams) so the header stays in the static shell.
    const query = Object.fromEntries(new URLSearchParams(window.location.search).entries());
    startTransition(() => {
      router.replace(
        // pathname + params come from the current route, so they always match a route template.
        // @ts-expect-error -- next-intl can't relate a runtime pathname to its params type
        { pathname, params, query },
        { locale: next, scroll: false },
      );
    });
  }

  return (
    <div role="group" aria-label={t("label")} className={clsx("flex items-center", pending && "opacity-60", className)}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 ? (
            <span aria-hidden className={clsx("mx-1.5", tone === "light" ? "text-paper/50" : "text-stone")}>
              /
            </span>
          ) : null}
          <button
            type="button"
            lang={l}
            onClick={() => switchTo(l)}
            aria-current={l === locale ? "true" : undefined}
            data-testid={`lang-${l}`}
            className={clsx(
              "label py-2 transition-colors",
              l === locale ? "" : tone === "light" ? "text-paper/80 hover:text-paper" : "text-granite hover:text-ink",
            )}
          >
            {/* Visible code + full language name for assistive tech (name must contain the visible text). */}
            {l.toUpperCase()}
            <span className="sr-only"> {t(l)}</span>
          </button>
        </span>
      ))}
    </div>
  );
}
