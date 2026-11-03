"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * Share this home: the system share sheet where there is one (phones, Safari), otherwise copies
 * the link and says so for a moment. The shared link is the page without search dates.
 */
export function ShareButton({ title }: { title: string }) {
  const t = useTranslations("listing");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(id);
  }, [copied]);

  async function share() {
    const url = `${location.origin}${location.pathname}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text: t("shareText", { title }), url });
      } catch {
        // Closed the sheet: nothing to do.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt(t("share"), url);
    }
  }

  return (
    <button type="button" onClick={share} className="-m-2 inline-flex shrink-0 items-center gap-2 p-2 text-small font-semibold">
      <Icon name="share" size={18} strokeWidth={1.5} />
      {/* Icon alone on phones, so a long title keeps the width; the word from sm up. */}
      <span className="sr-only sm:not-sr-only sm:link-quiet">{t("share")}</span>
      <span role="status" className="font-normal text-granite">
        {copied ? `· ${t("shareCopied")}` : ""}
      </span>
    </button>
  );
}
