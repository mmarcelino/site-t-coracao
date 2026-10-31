import { getLocale, getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/Icon";
import { Carousel } from "@/components/Carousel";
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
      {/* Starts on a hairline, level with the first quote's. */}
      <div className="reveal border-t border-ink/15 pt-6 lg:col-span-4">
        {eyebrow ? <p className="label mb-5 text-granite">{eyebrow}</p> : null}
        <h2 id={headingId} className="text-[clamp(2rem,1.4rem+2.2vw,3.5rem)] leading-[1.05]">
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
          /* One quiet row per platform: name, score on its own scale, count. */
          <ul className="mt-10 border-b border-ink/15">
            {(Object.keys(bySource) as ReviewSource[]).map((source) => (
              <li key={source} className="flex items-baseline justify-between gap-4 border-t border-ink/15 py-3">
                <span>{t(`source.${source}`)}</span>
                <span className="text-small text-granite tabular-nums">
                  <span className="text-lead font-semibold text-ink">{score(bySource[source].score)}</span>/
                  {bySource[source].outOf}
                  {" · "}
                  {t("basedOn", { count: format.number(bySource[source].count) })}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* Two quotes at a time (one on phones), paging sideways. */}
      <div className="min-w-0 self-start lg:col-span-8">
        <Carousel prevLabel={t("prev")} nextLabel={t("next")}>
          <ul className="grid auto-cols-[85%] grid-flow-col gap-x-10 sm:auto-cols-[calc(50%-1.25rem)]">
            {reviews.map((review) => (
              <li key={review.id} className="snap-start border-t border-ink/15 pt-6">
                <figure>
                  <blockquote lang={review.language} className="text-[clamp(1.1875rem,1rem+0.5vw,1.4375rem)] leading-[1.45]">
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
        </Carousel>
      </div>

    </div>
  );
}
