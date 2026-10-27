import { getTranslations } from "next-intl/server";
import { getReviewSummary } from "@/lib/data";
import { createFormatter } from "@/lib/format";
import type { Locale } from "@/i18n/routing";
import { Icon } from "@/components/ui/Icon";

/**
 * "Book direct" as one line under the hero's booking box: label, the three perks, then
 * the rating with review count. Perks are TO CONFIRM with the client (CLAUDE.md §15).
 */
export async function DirectLine({ locale, className }: { locale: Locale; className?: string }) {
  const t = await getTranslations();
  const { overall } = await getReviewSummary(locale);
  const format = createFormatter(locale);
  const perks = [t("home.directCardPerk1"), t("home.directCardPerk2"), t("home.directCardPerk3")];
  const score = format.number(overall.score, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return (
    <section
      aria-labelledby="direct-line-title"
      className={`flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.875rem] text-paper ${className ?? ""}`}
    >
      <h2 id="direct-line-title" className="label text-[0.6875rem] whitespace-nowrap">
        {t("home.directCardTitle")}:
      </h2>
      <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-paper/90">
        {perks.map((perk, i) => (
          <li key={perk} className="flex items-center gap-3 whitespace-nowrap">
            {i > 0 ? <span aria-hidden className="size-[3px] rounded-full bg-paper/60" /> : null}
            {perk}
          </li>
        ))}
      </ul>
      <span aria-hidden className="hidden h-3 w-px bg-paper/50 sm:block" />
      <span className="flex items-center gap-1 whitespace-nowrap">
        <Icon name="star" size={11} fill="currentColor" strokeWidth={0} />
        {t("home.directCardRating", { score, count: format.number(overall.count) })}
        {overall.mock ? <span className="sr-only">({t("common.demo")})</span> : null}
      </span>
    </section>
  );
}
