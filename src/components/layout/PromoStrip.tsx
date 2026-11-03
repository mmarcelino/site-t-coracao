"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Promo } from "@/content/promo";

/**
 * A quiet line above the header announcing a seasonal direct-booking code: one sentence, the code
 * as a copy button, no badges or percentages shouting. It is 2.5rem tall; the home hero
 * subtracts that while the strip exists, so it still fits above the fold.
 */
export function PromoStrip({ promo }: { promo: Promo }) {
  const t = useTranslations("promo");
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(promo.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the code is visible anyway.
    }
  }

  return (
    <aside aria-label={t("label")} data-promo-strip className="relative z-50 h-10 bg-ink text-paper on-dark">
      <div className="container-page flex h-full items-center justify-center gap-x-3 text-[0.8125rem] leading-none sm:text-small">
        <span className="label hidden text-granite-light md:inline">{t("label")}</span>
        <span aria-hidden className="hidden h-3 w-px bg-paper/30 md:block" />
        <p className="truncate">
          <span className="sm:hidden">{t("short")}</span>
          <span className="hidden sm:inline">{t("text")}</span>
        </p>
        <button
          type="button"
          onClick={copy}
          className="flex h-10 shrink-0 items-center gap-1.5 transition-opacity hover:opacity-70"
        >
          <span className="hidden text-granite-light sm:inline">{t("code")}</span>
          <span className="label underline decoration-paper/40 decoration-dotted underline-offset-4">{promo.code}</span>
          {copied ? <Icon name="check" size={14} strokeWidth={1.5} /> : null}
          <span className="sr-only" aria-live="polite">
            {copied ? t("copied") : t("copy")}
          </span>
        </button>
      </div>
    </aside>
  );
}
