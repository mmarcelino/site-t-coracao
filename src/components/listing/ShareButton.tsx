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
    // A white pill on the photos, like "View all photos": hard to miss, no extra chrome on the page.
    <button
      type="button"
      onClick={share}
      className="text-small inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2.5 font-semibold text-ink shadow-sm transition-colors hover:bg-white"
    >
      <Icon name={copied ? "check" : "share"} size={16} />
      <span role="status">{copied ? t("shareCopied") : t("share")}</span>
    </button>
  );
}
