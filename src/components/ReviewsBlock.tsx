import clsx from "clsx";
import { getLocale, getTranslations } from "next-intl/server";
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
  eyebrow: string;
  headingId: string;
}) {
  const t = await getTranslations("reviews");
  const tc = await getTranslations("common");
  const format = createFormatter(await getLocale());
  const score = (n: number) => format.number(n, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const hasMock = overall.mock || reviews.some((r) => r.mock) || Object.values(bySource ?? {}).some((s) => s.mock);

  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
      <div className="reveal lg:col-span-4">
        <p className="label mb-5 text-granite">{eyebrow}</p>
        <h2 id={headingId} className="text-h2">
          {heading}
        </h2>
        <div className="mt-10 flex items-end gap-4">
          <p className="text-mega leading-none font-semibold tabular-nums">{score(overall.score)}</p>
          <p className="pb-2 text-small text-granite">
            {t("outOf")}
            <br />
            {t("basedOn", { count: format.number(overall.count) })}
          </p>
        </div>
        <p className="text-small mt-2 text-granite">{t(`source.${overall.source}`)}</p>
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

      <ul className="grid gap-3 self-start sm:grid-cols-2 lg:col-span-8">
        {reviews.map((review, i) => (
          <li key={review.id} className={clsx(
              "reveal rounded-[var(--radius-card)] p-7 md:p-9",
              i === 0 ? "bg-wash" : "bg-sand",
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
              <figcaption className="text-small mt-6 text-ink-soft-text">
                {review.author} · {t(`source.${review.source}`)} ·{" "}
                {format.dateTime(new Date(`${review.date}T12:00:00Z`), { month: "long", year: "numeric" })}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {hasMock ? (
        <p className="text-[0.8125rem] text-granite lg:col-span-12">
          <span className="label mr-2 bg-azulejo-tint px-1.5 py-0.5 text-azulejo">{tc("demo")}</span>
          {t("mockNote")}
        </p>
      ) : null}
    </div>
  );
}
