import { getLocale, getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/Icon";
import { ReviewsScroller } from "@/components/ReviewsScroller";
import { createFormatter } from "@/lib/format";
import type { Review, ReviewAggregate, ReviewSource } from "@/lib/data";

/**
 * Rating block + excerpts (CLAUDE.md §5 trust signals). Shows source, score, count; anything
 * flagged `mock` gets a visible "demo data" note so placeholders can't be mistaken for real.
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
  const tc = await getTranslations("common");
  const format = createFormatter(await getLocale());
  const score = (n: number) => format.number(n, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const hasMock = overall.mock || reviews.some((r) => r.mock) || Object.values(bySource ?? {}).some((s) => s.mock);

  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
      {/* Starts on an ink rule, level with the first quote's. */}
      <div className="reveal border-t border-ink/20 pt-6 lg:col-span-4">
        {eyebrow ? <p className="label mb-5 text-granite">{eyebrow}</p> : null}
        <h2 id={headingId} className="text-h2">
          {heading}
        </h2>
        <div className="mt-10 flex items-end gap-4">
          <p className="text-mega flex items-start gap-2 leading-none font-light tabular-nums">
            {score(overall.score)}
            <Icon name="star" size={28} strokeWidth={1.25} className="mt-2" />
          </p>
          <p className="pb-2 text-small text-granite">
            {t("outOf")}
            <br />
            {t("basedOn", { count: format.number(overall.count) })}
          </p>
        </div>
        <p className="label mt-3">{t(`source.${overall.source}`)}</p>
        {bySource ? (
          <ul className="mt-10 grid grid-cols-3 gap-4 border-t border-ink/15 pt-6">
            {(Object.keys(bySource) as ReviewSource[]).map((source) => (
              <li key={source}>
                <p className="label text-granite">{t(`source.${source}`)}</p>
                <p className="mt-2 text-h3 font-semibold tabular-nums">{score(bySource[source].score)}</p>
                <p className="text-[0.75rem] text-granite">{format.number(bySource[source].count)}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* Four quotes at a time (two on phones), in columns that page sideways. */}
      <div className="min-w-0 self-start lg:col-span-8">
        <ReviewsScroller prevLabel={t("prev")} nextLabel={t("next")}>
          <ul className="grid auto-cols-[85%] grid-flow-col grid-rows-1 gap-x-8 gap-y-12 sm:auto-cols-[calc(50%-1rem)] sm:grid-rows-2">
            {reviews.map((review) => (
              <li key={review.id} className="snap-start border-t border-ink/20 pt-6">
                <figure>
                  <blockquote lang={review.language} className="text-lead">
                    “{review.text}”
                  </blockquote>
                  <figcaption className="label mt-6 text-granite">
                    {review.author} · {t(`source.${review.source}`)} ·{" "}
                    {format.dateTime(new Date(`${review.date}T12:00:00Z`), { month: "long", year: "numeric" })}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </ReviewsScroller>
      </div>

      {hasMock ? (
        <p className="text-[0.8125rem] text-granite lg:col-span-12">
          <span className="label mr-2 bg-azulejo-tint px-1.5 py-0.5 text-azulejo">{tc("demo")}</span>
          {t("mockNote")}
        </p>
      ) : null}
    </div>
  );
}
