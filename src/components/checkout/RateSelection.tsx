"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { createContext, useContext, useState, type ReactNode } from "react";
import { isoToLocalDate } from "@/lib/dates";
import type { Quote, RateOption } from "@/lib/data/types";
import { useFormat } from "@/lib/format";
import { PriceBreakdown } from "@/components/booking/PriceBreakdown";

/**
 * The rate the guest picks at checkout (Guesty rate plans: e.g. free cancellation vs
 * non-refundable). Shared by the summary card and the form, so the price follows the choice.
 */
interface RateSelection {
  quote: Quote;
  selected: RateOption;
  select: (ratePlanId: string) => void;
}

const RateContext = createContext<RateSelection | null>(null);

export function RateSelectionProvider({ quote, children }: { quote: Quote; children: ReactNode }) {
  const [id, setId] = useState(quote.options[0]?.ratePlanId);
  const selected = quote.options.find((o) => o.ratePlanId === id) ?? quote.options[0]!;
  return <RateContext.Provider value={{ quote, selected, select: setId }}>{children}</RateContext.Provider>;
}

export function useRateSelection(): RateSelection {
  const ctx = useContext(RateContext);
  if (!ctx) throw new Error("useRateSelection must be used inside <RateSelectionProvider>");
  return ctx;
}

/** "Free cancellation before 2 Dec 2026" / "Non-refundable". */
export function useRateLabel(): (option: RateOption) => string {
  const t = useTranslations("checkout");
  const format = useFormat();
  return (option) =>
    option.freeCancellationUntil
      ? t("rateFreeCancellation", {
          // "6 Nov 2026" / "6 nov. 2026" (dayMonth: Intl's pt-PT short month is numeric).
          // Non-breaking spaces keep the date on one line.
          date: `${format.dayMonth(isoToLocalDate(option.freeCancellationUntil))} ${option.freeCancellationUntil.slice(0, 4)}`.replace(/ /g, "\u00a0"),
        })
      : t("rateNonRefundable");
}

/** The summary's price lines for the chosen rate. */
export function SelectedPriceBreakdown() {
  const { quote, selected } = useRateSelection();
  return <PriceBreakdown quote={{ ...quote, ...selected }} />;
}

/** The chosen rate's cancellation terms, under the summary's total. */
export function SelectedRateNote() {
  const { selected } = useRateSelection();
  const label = useRateLabel();
  return <p className="text-small mt-3 text-right text-granite">{label(selected)}</p>;
}

/** One compact row per rate, as radio buttons; the chosen one is a light grey fill (a touch deeper than `sand`, which faded on some screens) with no outline. */
export function RateChooser() {
  const t = useTranslations("checkout");
  const format = useFormat();
  const label = useRateLabel();
  const { quote, selected, select } = useRateSelection();
  return (
    <fieldset className="space-y-2">
      <legend className="sr-only">{t("rateTitle")}</legend>
      {quote.options.map((option) => {
        const checked = option.ratePlanId === selected.ratePlanId;
        return (
          <label
            key={option.ratePlanId}
            className={clsx(
              "flex cursor-pointer items-center gap-3 rounded-[var(--radius-tile)] border px-4 py-3 text-small transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-azulejo",
              checked ? "border-transparent bg-ink/[0.07] font-medium" : "border-ink/20 hover:border-ink/50",
            )}
          >
            <input
              type="radio"
              name="rate"
              value={option.ratePlanId}
              checked={checked}
              onChange={() => select(option.ratePlanId)}
              className="size-4 shrink-0 accent-[var(--color-ink)] outline-none"
            />
            <span className="min-w-0 flex-1">{label(option)}</span>
            <span className="whitespace-nowrap tabular-nums">{format.money(option.total, quote.currency)}</span>
          </label>
        );
      })}
    </fieldset>
  );
}
