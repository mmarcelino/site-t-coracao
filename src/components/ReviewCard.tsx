import { useLocale, useTranslations } from "next-intl";
import { ReviewQuote } from "@/components/ReviewQuote";
import { SourceIcon } from "@/components/SourceIcon";
import { createFormatter } from "@/lib/format";
import type { Review } from "@/lib/data";

/** One quote: the text (cut at five lines), then source, name and month. Renders on server or client. */
export function ReviewCard({ review }: { review: Review }) {
  const t = useTranslations("reviews");
  const format = createFormatter(useLocale());
  return (
    <figure>
      <ReviewQuote text={review.text} lang={review.language} moreLabel={t("readMore")} lessLabel={t("readLess")} />
      <figcaption className="label mt-6 text-ink">
        <SourceIcon source={review.source} label={t(`source.${review.source}`)} size={14} className="mr-2 align-[-2px]" />
        {review.author} · {format.dateTime(new Date(`${review.date}T12:00:00Z`), { month: "long", year: "numeric" })}
      </figcaption>
    </figure>
  );
}
