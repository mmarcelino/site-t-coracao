"use client";

import { useTranslations } from "next-intl";
import { site } from "@/content/site";
import { useFormat } from "@/lib/format";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * Quiet trust lines beside the booking widget (CLAUDE.md §5). `cancellation` replaces the generic
 * cancellation line with the real terms of the rate being shown (from the Guesty quote).
 */
export function Reassurance({ cancellation }: { cancellation?: string } = {}) {
  const t = useTranslations("reassurance");
  const format = useFormat();
  const items: Array<{ icon: IconName; text: string }> = [
    { icon: "lock", text: t("secure") },
    { icon: "refresh", text: cancellation ?? t("cancellation") },
    { icon: "clock", text: t("since", { year: String(site.foundedYear), guests: format.number(site.guestsPerYear) }) },
  ];
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.text} className="flex items-start gap-3">
          <Icon name={item.icon} size={16} className="mt-0.5 shrink-0" />
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}
