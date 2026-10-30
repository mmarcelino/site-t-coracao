import clsx from "clsx";
import { getLocale, getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/Icon";
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
      <div className="reveal border-t-2 border-ink pt-6 lg:col-span-4">
        {eyebrow ? <p className="label mb-5 text-granite">{eyebrow}</p> : null}
        <h2 id={headingId} className="text-h2">
          {heading}
        </h2>
        <div className="mt-10 flex items-end gap-4">
          <p className="text-mega flex items-start gap-2 leading-none font-semibold tabular-nums">
            {score(overall.score)}
            <Icon name="star" size={32} fill="currentColor" stroke="var(--color-ink)" strokeWidth={1.25} className="mt-2 text-pop" />
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

      <ul className="grid gap-x-8 gap-y-12 self-start sm:grid-cols-2 lg:col-span-8">
        {reviews.map((review, i) => (
          <li key={review.id} className={clsx(
              "reveal border-t-2 border-ink pt-6",
              // A lead quote spans the row only when it leaves an even number below it.
              i === 0 && reviews.length % 2 === 1 && "sm:col-span-2",
            )}>
            <figure>
              <blockquote
                lang={review.language}
                className={clsx(i === 0 && reviews.length % 2 === 1 ? "text-h3 font-semibold" : "text-lead font-medium")}
              >
                “{review.text}”
              </blockquote>
              <figcaption className="label mt-6 text-ink">
                {review.author} · {t(`source.${review.source}`)} ·{" "}
                {format.dateTime(new Date(`${review.date}T12:00:00Z`), { month: "long", year: "numeric" })}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {hasMock ? (
        <p className="text-[0.8125rem] text-granite lg:col-span-12">
          <span className="label mr-2 bg-pop px-1.5 py-0.5 text-ink">{tc("demo")}</span>
          {t("mockNote")}
        </p>
      ) : null}
    </div>
  );
}
