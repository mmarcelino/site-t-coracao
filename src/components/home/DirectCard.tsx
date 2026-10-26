import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/Icon";

export interface HeroRating {
  score: string; // formatted, e.g. "9,4"
  count: string; // formatted, e.g. "2 234"
  mock: boolean;
}

/**
 * Why book here, as one quiet line under the booking box: three perks + the rating.
 * Perks are TO CONFIRM with the client (CLAUDE.md §15).
 */
export async function DirectLine({ rating, className }: { rating: HeroRating; className?: string }) {
  const t = await getTranslations();
  const perks = [t("home.directCardPerk1"), t("home.directCardPerk2"), t("home.directCardPerk3")];
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-paper ${className ?? ""}`}>
      <span className="sr-only">{t("home.directCardTitle")}: </span>
      {perks.map((perk, i) => (
        <span key={perk} className="flex items-center gap-3">
          {i > 0 ? <span aria-hidden className="size-[3px] rounded-full bg-paper/60" /> : null}
          {perk}
        </span>
      ))}
      <span aria-hidden className="h-3 w-px bg-paper/40" />
      <span className="flex items-center gap-1 text-paper/85">
        <Icon name="star" size={11} fill="currentColor" strokeWidth={0} className="text-paper" />
        {rating.score}
        {rating.mock ? <span className="sr-only">({t("common.demo")})</span> : null}
      </span>
    </p>
  );
}
