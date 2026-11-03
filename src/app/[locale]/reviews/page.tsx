import type { Metadata } from "next";
import { Suspense } from "react";
import clsx from "clsx";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getListings, getReviewPage, getReviewSummary, type ReviewSource } from "@/lib/data";
import { alternates } from "@/lib/seo";
import { ReviewCard, SourceScores } from "@/components/ReviewsBlock";
import { SourceIcon } from "@/components/SourceIcon";

/**
 * Every guest review, filterable by platform (?source=) and read a page at a time (?n= is how many
 * are shown). Both are links, so each view has its own URL and works without JavaScript.
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations("reviews");
  return { title: { absolute: t("metaTitle") }, description: t("metaDescription"), alternates: alternates(locale, "/reviews") };
}

type SearchParams = PageProps<"/[locale]/reviews">["searchParams"];

const PAGE = 8;
const sources: ReviewSource[] = ["google", "airbnb", "booking"];

function parse(sp: Awaited<SearchParams>) {
  const source = sources.find((s) => s === sp.source);
  const n = Number(sp.n);
  return { source, n: Number.isInteger(n) && n > PAGE ? Math.ceil(n / PAGE) * PAGE : PAGE };
}

const query = (source: ReviewSource | undefined, n = PAGE) => ({
  ...(source ? { source } : {}),
  ...(n > PAGE ? { n: String(n) } : {}),
});

async function Results({ searchParams }: { searchParams: SearchParams }) {
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations("reviews");
  const { source, n } = parse(await searchParams);
  const [{ reviews, total }, listings] = await Promise.all([getReviewPage(locale, { source, limit: n }), getListings(locale)]);
  const home = (id?: string) => {
    const l = listings.find((x) => x.id === id);
    return l ? { title: l.title, slug: l.slug } : undefined;
  };

  const pill = (active: boolean) =>
    clsx(
      "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[0.9375rem] font-semibold whitespace-nowrap transition-colors",
      active ? "border-ink bg-ink text-paper" : "border-ink/20 hover:border-ink",
    );

  return (
    <>
      <nav aria-label={t("filterLabel")} className="mt-12 border-t-2 border-ink pt-6">
        <ul className="scrollbar-none -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] sm:mx-0 sm:px-0">
          {[undefined, ...sources].map((s) => (
            <li key={s ?? "all"}>
              <Link
                href={{ pathname: "/reviews", query: query(s) }}
                scroll={false}
                aria-current={source === s ? "page" : undefined}
                className={pill(source === s)}
              >
                {s ? <SourceIcon source={s} label="" size={14} /> : null}
                {s ? t(`source.${s}`) : t("all")}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {reviews.length ? (
        <ul className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {reviews.map((review) => (
            <li key={review.id} className="border-t-2 border-ink pt-6">
              <ReviewCard review={review} home={home(review.listingId)} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-lead mt-10 max-w-xl text-granite">{t("none")}</p>
      )}

      {/* How far along, then the next page: a link that keeps the scroll position. */}
      {reviews.length ? (
        <div className="mt-16 flex flex-col items-start gap-5">
          <p role="status" className="text-small text-granite">
            {t("showing", { shown: reviews.length, total })}
          </p>
          {reviews.length < total ? (
            <Link
              href={{ pathname: "/reviews", query: query(source, n + PAGE) }}
              scroll={false}
              className="inline-flex h-12 items-center rounded-full border border-ink px-6 font-semibold transition-colors hover:bg-ink hover:text-paper"
            >
              {t("showMore")}
            </Link>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

export default async function ReviewsPage({ searchParams }: PageProps<"/[locale]/reviews">) {
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations("reviews");
  const { bySource } = await getReviewSummary(locale);

  return (
    <section className="container-page section-y-tight">
      {/* Title and a line on the left, the score per platform on the right (stacked below lg). */}
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-h2">{t("pageTitle")}</h1>
          <p className="text-lead mt-5 max-w-2xl text-granite">{t("pageBody")}</p>
        </div>
        <SourceScores bySource={bySource} className="w-full max-w-md lg:shrink-0" />
      </div>
      {/* Filters + quotes read the URL, so they stream in under Suspense (Cache Components). */}
      <Suspense
        fallback={
          <div aria-hidden className="mt-12 flex items-center gap-2 border-t-2 border-ink pt-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-24 rounded-full bg-sand" />
            ))}
          </div>
        }
      >
        <Results searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
