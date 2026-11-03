import clsx from "clsx";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icon";
import { ReviewQuote } from "@/components/ReviewQuote";
import { SourceIcon } from "@/components/SourceIcon";
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
  more,
}: {
  overall: ReviewAggregate;
  bySource?: Record<ReviewSource, ReviewAggregate>;
  reviews: Review[];
  heading: string;
  eyebrow?: string;
  headingId: string;
  /** "Read all reviews" under the quotes (home page). */
  more?: string;
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
              <p className="flex items-start gap-2 text-[4rem] leading-none font-semibold tracking-[-0.03em] tabular-nums">
                {score(overall.score)}
                <Icon name="star" size={22} fill="currentColor" stroke="var(--color-ink)" strokeWidth={1.25} className="mt-1.5 text-pop" />
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
        {bySource ? <SourceScores bySource={bySource} className="mt-8" /> : null}
      </div>

      {/* Four quotes, fixed (no carousel); long ones are cut at five lines with "Read more". */}
      <div className="min-w-0 self-start lg:col-span-8">
        <ul className="grid gap-x-8 gap-y-16 sm:grid-cols-2">
          {reviews.slice(0, 4).map((review) => (
            <li key={review.id} className="border-t-2 border-ink pt-6">
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
        {more ? (
          <Link href="/reviews" className="group mt-12 inline-flex items-center gap-4 font-semibold">
            {more}
            <Icon name="arrowRight" size={24} strokeWidth={1.75} className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)] group-hover:translate-x-2" />
          </Link>
        ) : null}
      </div>

    </div>
  );
}

/** Score and review count per platform, side by side. */
export async function SourceScores({ bySource, className }: { bySource: Record<ReviewSource, ReviewAggregate>; className?: string }) {
  const t = await getTranslations("reviews");
  const format = createFormatter(await getLocale());
  return (
    <ul className={clsx("grid grid-cols-3 gap-4", className)}>
      {(Object.keys(bySource) as ReviewSource[]).map((source) => (
        <li key={source}>
          <p className="label text-granite">{t(`source.${source}`)}</p>
          <p className="mt-1.5 text-[1.75rem] leading-none font-semibold tabular-nums">
            {format.number(bySource[source].score, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </p>
          <p className="mt-1.5 text-small text-granite">{t("basedOn", { count: format.number(bySource[source].count) })}</p>
        </li>
      ))}
    </ul>
  );
}

/** One quote: the text (cut at five lines), then source, name and month; optionally the home it's about. */
export async function ReviewCard({ review, home }: { review: Review; home?: { title: string; slug: string } }) {
  const t = await getTranslations("reviews");
  const format = createFormatter(await getLocale());
  return (
    <figure>
      <ReviewQuote text={review.text} lang={review.language} moreLabel={t("readMore")} lessLabel={t("readLess")} />
      <figcaption className="label mt-6 text-ink">
        <SourceIcon source={review.source} label={t(`source.${review.source}`)} size={14} className="mr-2 align-[-2px]" />
        {review.author} · {format.dateTime(new Date(`${review.date}T12:00:00Z`), { month: "long", year: "numeric" })}
        {home ? (
          <Link
            href={{ pathname: "/apartments/[slug]", params: { slug: home.slug } }}
            className="mt-2 block text-small tracking-normal normal-case text-granite underline-offset-4 hover:underline"
          >
            {home.title}
          </Link>
        ) : null}
      </figcaption>
    </figure>
  );
}
