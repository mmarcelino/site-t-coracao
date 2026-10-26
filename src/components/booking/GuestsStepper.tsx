"use client";

import { useTranslations } from "next-intl";
import { useId } from "react";
import { Icon } from "@/components/ui/Icon";

export function GuestsStepper({
  value,
  onChange,
  min = 1,
  max,
  tone = "dark",
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max: number;
  tone?: "dark" | "light";
}) {
  const t = useTranslations();
  const id = useId();
  const btn =
    tone === "light"
      ? "border-paper/40 hover:border-paper disabled:hover:border-paper/40"
      : "border-ink/25 hover:border-ink disabled:hover:border-ink/25";

  return (
    <div className="flex items-center justify-between gap-4">
      <span id={id} className="sr-only">
        {t("search.guests")}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={t("search.fewerGuests")}
        className={`grid size-9 place-items-center rounded-full border transition-colors disabled:opacity-30 ${btn}`}
      >
        <Icon name="minus" size={16} />
      </button>
      <output aria-labelledby={id} aria-live="polite" className="min-w-[6.5rem] text-center tabular-nums">
        {t("common.guests", { count: value })}
      </output>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={t("search.moreGuests")}
        className={`grid size-9 place-items-center rounded-full border transition-colors disabled:opacity-30 ${btn}`}
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}
