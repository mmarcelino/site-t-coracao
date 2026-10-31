import { getLocale, getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/Icon";
import { ReviewQuote } from "@/components/ReviewQuote";
import { createFormatter } from "@/lib/format";
import type { Review, ReviewAggregate, ReviewSource } from "@/lib/data";

/**
 * Rating block + excerpts (CLAUDE.md §5 trust signals). Shows source, score, count. Placeholders
 * stay flagged `mock: true` in the data (no visible note, at the client's request).
 */
export async function ReviewsBlock({
  overall,
  bySource,
  reviews,
  heading,
  eyebrow,
  headingId,
}: {
  overall: ReviewAggregate;
  bySource?: Record<ReviewSource, ReviewAggregate>;
  reviews: Review[];
  heading: string;
  eyebrow?: string;
  headingId: string;
}) {
  const t = await getTranslations("reviews");
  const format = createFormatter(await getLocale());
  const score = (n: number) => format.number(n, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
      {/* Starts on an ink rule, level with the first quote's. */}
      <div className="reveal border-t-2 border-ink pt-6 lg:col-span-4">
        {eyebrow ? <p className="label mb-5 text-granite">{eyebrow}</p> : null}
        <h2 id={headingId} className="text-h2">
          {heading}
        </h2>
        {/* One big score when there's a single source (apartment pages); per-platform scores otherwise. */}
        {bySource ? null : (
          <>
            <div className="mt-10 flex items-end gap-4">
              <p className="text-mega flex items-start gap-2 leading-none font-semibold tabular-nums">
                {score(overall.score)}
                <Icon name="star" size={32} fill="currentColor" stroke="var(--color-ink)" strokeWidth={1.25} className="mt-2 text-pop" />
              </p>
              <p className="pb-2 text-small text-granite">
                {t("outOf", { max: overall.outOf })}
                <br />
                {t("basedOn", { count: format.number(overall.count) })}
              </p>
            </div>
            <p className="label mt-3">{t(`source.${overall.source}`)}</p>
          </>
        )}
        {bySource ? (
          <ul className="mt-10 grid grid-cols-3 gap-4">
            {(Object.keys(bySource) as ReviewSource[]).map((source) => (
              <li key={source}>
                <p className="label text-granite">{t(`source.${source}`)}</p>
                <p className="mt-2 text-[clamp(1.75rem,1.3rem+1.6vw,2.75rem)] leading-none font-semibold tabular-nums">
                  {score(bySource[source].score)}
                </p>
                <p className="mt-2 text-small text-granite">{t("basedOn", { count: format.number(bySource[source].count) })}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* Four quotes, fixed (no carousel); long ones are cut at five lines with "Read more". */}
      <div className="min-w-0 self-start lg:col-span-8">
        <ul className="grid gap-x-8 gap-y-16 sm:grid-cols-2">
          {reviews.slice(0, 4).map((review) => (
            <li key={review.id} className="border-t-2 border-ink pt-6">
              <figure>
                <ReviewQuote text={review.text} lang={review.language} moreLabel={t("readMore")} lessLabel={t("readLess")} />
                <figcaption className="label mt-6 text-ink">
                  {review.author} · {t(`source.${review.source}`)} ·{" "}
                  {format.dateTime(new Date(`${review.date}T12:00:00Z`), { month: "long", year: "numeric" })}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
