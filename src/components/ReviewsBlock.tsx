import { getLocale, getTranslations } from "next-intl/server";
import { ReviewList } from "@/components/ReviewList";
import { createFormatter } from "@/lib/format";
import type { Review, ReviewAggregate, ReviewSource } from "@/lib/data";

/**
 * Home rating block: per-platform scores + excerpts (CLAUDE.md §5 trust signals). Placeholders
 * stay flagged `mock: true` in the data (no visible note, at the client's request).
 */
export async function ReviewsBlock({
  bySource,
  reviews,
  heading,
  eyebrow,
  headingId,
  total,
}: {
  bySource: Record<ReviewSource, ReviewAggregate>;
  reviews: Review[];
  heading: string;
  eyebrow?: string;
  headingId: string;
  /** How many reviews there are in all; with it, "Show more reviews" loads the rest in place. */
  total?: number;
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
        <ul className="mt-8 grid grid-cols-3 gap-4">
          {(Object.keys(bySource) as ReviewSource[]).map((source) => (
            <li key={source}>
              <p className="label text-granite">{t(`source.${source}`)}</p>
              <p className="mt-1.5 text-[1.75rem] leading-none font-semibold tabular-nums">
                {score(bySource[source].score)}
              </p>
              <p className="mt-1.5 text-small text-granite">{t("basedOn", { count: format.number(bySource[source].count) })}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Four quotes (no carousel), more on request; long ones are cut at five lines with "Read more". */}
      <div className="min-w-0 self-start lg:col-span-8">
        <ReviewList initial={reviews.slice(0, 4)} total={total} />
      </div>
    </div>
  );
}
