import { getLocale, getTranslations } from "next-intl/server";
import { ReviewList } from "@/components/ReviewList";
import { site } from "@/content/site";
import { createFormatter } from "@/lib/format";
import type { Review, ReviewAggregate, ReviewSource } from "@/lib/data";

/**
 * Rating block (home page): the headline with a quiet line on how many guests a year (volume backs
 * the scores), per-platform scores, + real quotes from Guesty (CLAUDE.md §5 trust signals). A platform
 * without data (no Guesty keys) is left out; with no quotes, the scores stand alone.
 */
export async function ReviewsBlock({
  bySource,
  reviews,
  heading,
  eyebrow,
  headingId,
  total,
}: {
  bySource: Partial<Record<ReviewSource, ReviewAggregate>>;
  reviews: Review[];
  heading: string;
  eyebrow?: string;
  headingId: string;
  /** How many reviews there are in all; with it, "Show more reviews" loads the rest in place. */
  total?: number;
}) {
  const t = await getTranslations("reviews");
  const tr = await getTranslations("reassurance");
  const format = createFormatter(await getLocale());
  const score = (n: number) => format.number(n, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <div className="grid lg:grid-cols-12 lg:gap-x-10 lg:gap-y-12">
      {/* On desktop the side column follows the quotes' two rows: the headline on the thick ink rule
          beside the first two quotes, the scores level with the top of the next two. */}
      <div className="reveal border-t-2 border-ink pt-6 lg:col-span-4 lg:row-start-1">
        {eyebrow ? <p className="label mb-5 text-granite">{eyebrow}</p> : null}
        <h2 id={headingId} className="text-h2">
          {heading}
        </h2>
        {/* Volume backs the scores: one quiet line under the headline, not a fourth big figure. */}
        <p className="mt-4">
          {tr("since", { year: String(site.foundedYear), guests: format.number(site.guestsPerYear) })}
        </p>
      </div>
      <ul className="reveal mt-10 mb-14 grid grid-cols-3 gap-4 lg:col-span-4 lg:row-start-2 lg:m-0">
        {Object.values(bySource).map((aggregate) => (
          <li key={aggregate.source}>
            <p className="label text-granite">{t(`source.${aggregate.source}`)}</p>
            <p className="mt-1.5 text-[1.75rem] leading-none font-semibold tabular-nums">{score(aggregate.score)}</p>
            <p className="mt-1.5 text-small text-granite">{t("basedOn", { count: format.number(aggregate.count) })}</p>
          </li>
        ))}
      </ul>

      {/* Four quotes (no carousel), more on request; long ones are cut at five lines with "Read more".
          On desktop they share the side column's two rows (subgrid), so the ink rules line up. */}
      {reviews.length ? (
        <ReviewList
          initial={reviews.slice(0, 4)}
          total={total}
          placement={{
            first: "min-w-0 lg:col-span-8 lg:col-start-5 lg:row-span-2 lg:row-start-1 lg:grid-rows-subgrid",
            rest: "min-w-0 lg:col-span-8 lg:col-start-5 lg:mt-0",
          }}
        />
      ) : null}
    </div>
  );
}
