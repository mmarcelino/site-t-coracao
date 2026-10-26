"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/Button";
import { useConsent } from "./ConsentProvider";

/**
 * On-brand consent banner: "accept" and "decline" are identical in weight (CLAUDE.md §11).
 * Non-modal, so the page stays usable; it's a labelled region that receives focus when reopened.
 */
export function ConsentBanner() {
  const t = useTranslations("consent");
  const { bannerOpen, consent, accept, reject } = useConsent();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reopened from the footer: move focus so keyboard users land in the banner.
    if (bannerOpen && consent !== "unknown") ref.current?.focus();
  }, [bannerOpen, consent]);

  if (!bannerOpen) return null;

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="region"
      aria-labelledby="consent-title"
      data-testid="consent-banner"
      className="on-dark animate-fade-in-fast fixed inset-x-3 bottom-3 z-50 max-w-md bg-ink p-6 text-paper shadow-2xl outline-none sm:inset-x-auto sm:bottom-6 sm:left-6 sm:p-7"
    >
      <h2 id="consent-title" className="text-h3 mb-3">
        {t("title")}
      </h2>
      <p className="text-small text-paper/80">{t("body")}</p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button type="button" onClick={reject} className={buttonClasses("outline-light", "md", "w-full")}>
          {t("reject")}
        </button>
        <button type="button" onClick={accept} className={buttonClasses("outline-light", "md", "w-full")}>
          {t("accept")}
        </button>
      </div>
      <Link href="/cookies" className="link-quiet text-small mt-4 inline-block text-paper/80">
        {t("policy")}
      </Link>
    </div>
  );
}

export function CookiePreferencesButton({ label, className }: { label: string; className?: string }) {
  const { openPreferences } = useConsent();
  return (
    <button type="button" onClick={openPreferences} className={className}>
      {label}
    </button>
  );
}
