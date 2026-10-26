import { getTranslations } from "next-intl/server";
import { getReviewSummary } from "@/lib/data";
import { createFormatter } from "@/lib/format";
import type { Locale } from "@/i18n/routing";
import { Icon } from "@/components/ui/Icon";

/**
 * "Book direct" strip above the header, on every page: label, three perks and the rating.
 * Perks are TO CONFIRM with the client (CLAUDE.md §15). Scrolls away with the page.
 */
export async function DirectStrip({ locale }: { locale: Locale }) {
  const t = await getTranslations();
  const { overall } = await getReviewSummary(locale);
  const format = createFormatter(locale);
  const perks = [t("home.directCardPerk1"), t("home.directCardPerk2"), t("home.directCardPerk3")];
  return (
    <aside
      aria-labelledby="direct-strip-title"
      className="on-dark relative z-50 flex h-[var(--strip-h)] items-center bg-ink text-paper"
    >
      <div className="container-page flex items-center justify-center gap-x-3 overflow-hidden text-[0.8125rem] whitespace-nowrap">
        <h2 id="direct-strip-title" className="label text-[0.6875rem]">
          {t("home.directCardTitle")}
        </h2>
        <span aria-hidden className="h-3 w-px bg-paper/40" />
        <ul className="flex items-center gap-x-3">
          {perks.map((perk, i) => (
            <li key={perk} className={`items-center gap-3 ${i === 0 ? "flex" : "hidden sm:flex"}`}>
              {i > 0 ? <span aria-hidden className="size-[3px] rounded-full bg-paper/60" /> : null}
              {perk}
            </li>
          ))}
        </ul>
        <span aria-hidden className="hidden h-3 w-px bg-paper/40 md:block" />
        <span className="hidden items-center gap-1 text-paper/85 md:flex">
          <Icon name="star" size={11} fill="currentColor" strokeWidth={0} className="text-paper" />
          {format.number(overall.score, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          {overall.mock ? <span className="sr-only">({t("common.demo")})</span> : null}
        </span>
      </div>
    </aside>
  );
}
