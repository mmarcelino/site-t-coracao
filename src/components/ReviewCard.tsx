import { useLocale, useTranslations } from "next-intl";
import { ReviewQuote } from "@/components/ReviewQuote";
import { SourceIcon } from "@/components/SourceIcon";
import { createFormatter } from "@/lib/format";
import type { Review } from "@/lib/data";

/**
 * One quote: the text (cut at four lines), then source, first name ("Guest" when the source
 * doesn't share it) and month. Renders on server or client.
 * In a flex column (cards in a strip) the caption sits at the bottom, so captions line up.
 */
export function ReviewCard({ review }: { review: Review }) {
  const t = useTranslations("reviews");
  const locale = useLocale();
  const format = createFormatter(locale);
  return (
    <figure className="flex flex-1 flex-col">
      <ReviewQuote text={review.text} lang={review.language} moreLabel={t("readMore")} lessLabel={t("readLess")} />
      <figcaption className="label mt-auto pt-6 text-granite">
        {/* The platform mark is centred on the name's capitals (the line box sits a little low for caps). */}
        <span className="flex items-center gap-2">
          <SourceIcon source={review.source} label={t(`source.${review.source}`)} size={review.source === "booking" ? 16 : 14} />
          <span>
            {review.author ?? t("guest")} · {format.dateTime(new Date(`${review.date}T12:00:00Z`), { month: "long", year: "numeric" })}
          </span>
        </span>
        {review.translatedFrom ? (
          <span className="mt-1.5 block">
            {t("translated", { language: languageName(review.translatedFrom, locale) })}
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}

/** "German" / "alemão": the language a review was written in, named in the page's language. */
function languageName(code: string, locale: string): string {
  try {
    return new Intl.DisplayNames([locale === "pt" ? "pt-PT" : "en-GB"], { type: "language" }).of(code) ?? code;
  } catch {
    return code;
  }
}
