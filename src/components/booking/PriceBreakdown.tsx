"use client";

import { useTranslations } from "next-intl";
import type { Quote } from "@/lib/data/types";
import { useFormat } from "@/lib/format";

/** Itemised mock quote. Every line Guesty will return is shown, so the layout is final. */
export function PriceBreakdown({ quote }: { quote: Quote }) {
  const t = useTranslations();
  const format = useFormat();
  const money = (amount: number) => format.money(amount, quote.currency);

  const lines: Array<{ label: string; amount: number; muted?: boolean }> = [
    {
      label: t("booking.nightlyLine", { nights: t("common.nights", { count: quote.nights }) }),
      amount: quote.accommodation,
    },
    ...(quote.lengthOfStayAdjustment
      ? [{ label: t("booking.lengthOfStay"), amount: quote.lengthOfStayAdjustment }]
      : []),
    ...(quote.extraGuestFee ? [{ label: t("booking.extraGuests"), amount: quote.extraGuestFee }] : []),
    { label: t("booking.cleaning"), amount: quote.cleaningFee },
    { label: t("booking.touristTax"), amount: quote.touristTax, muted: true },
  ];

  return (
    <div data-testid="price-breakdown" aria-live="polite">
      <dl className="text-small space-y-2.5">
        {lines.map((line) => (
          <div key={line.label} className="flex items-baseline justify-between gap-4">
            <dt className={line.muted ? "text-granite" : undefined}>{line.label}</dt>
            <dd className="tabular-nums">{money(line.amount)}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-baseline justify-between border-t border-ink/15 pt-4">
        <span className="font-semibold">{t("booking.total")}</span>
        <span className="text-h3 font-semibold tabular-nums" data-testid="quote-total">
          {money(quote.total)}
        </span>
      </div>
    </div>
  );
}
