"use client";

import { useTranslations } from "next-intl";
import { Icon, type IconName } from "@/components/ui/Icon";

/** Quiet trust lines beside the booking widget (CLAUDE.md §5). */
export function Reassurance({ licence }: { licence: string | null }) {
  const t = useTranslations("reassurance");
  const items: Array<{ icon: IconName; text: string }> = [
    { icon: "lock", text: t("secure") },
    { icon: "refresh", text: t("cancellation") },
    { icon: "pin", text: t("local") },
    { icon: "clock", text: t("since") },
    ...(licence ? [{ icon: "shield" as const, text: t("licence", { licence }) }] : []),
  ];
  return (
    <ul className="space-y-2.5 text-[0.8125rem] text-granite">
      {items.map((item) => (
        <li key={item.text} className="flex items-start gap-3">
          <Icon name={item.icon} size={16} className="mt-0.5 shrink-0" />
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}
