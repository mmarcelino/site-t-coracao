import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/Icon";

export interface HeroRating {
  score: string; // formatted, e.g. "9,4"
  count: string; // formatted, e.g. "2 234"
  mock: boolean;
}

/**
 * Why book here, labelled so it's clear what the perks are for: "Book direct" + three perks +
 * the rating. Perks are TO CONFIRM with the client (CLAUDE.md §15).
 */
export async function DirectBlock({ rating, className }: { rating: HeroRating; className?: string }) {
  const t = await getTranslations();
  const perks = [t("home.directCardPerk1"), t("home.directCardPerk2"), t("home.directCardPerk3")];
  return (
    <section aria-labelledby="direct-title" className={`text-paper ${className ?? ""}`}>
      <div className="flex items-center gap-3 text-[0.75rem] leading-none">
        <h2 id="direct-title" className="label whitespace-nowrap">
          {t("home.directCardTitle")}
        </h2>
        <span aria-hidden className="h-3 w-px bg-paper/40" />
        <span className="flex items-center gap-1 whitespace-nowrap text-paper/85">
          <Icon name="star" size={11} fill="currentColor" strokeWidth={0} className="text-paper" />
          <span className="sm:hidden">{rating.score}</span>
          <span className="hidden sm:inline">{t("home.directCardRating", { score: rating.score, count: rating.count })}</span>
          {rating.mock ? <span className="sr-only">({t("common.demo")})</span> : null}
        </span>
      </div>
      <ul className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.9375rem] sm:text-[1rem]">
        {perks.map((perk, i) => (
          <li key={perk} className={`flex items-center gap-3 ${i === 0 ? "font-medium" : ""}`}>
            {i > 0 ? <span aria-hidden className="size-[3px] rounded-full bg-paper/60" /> : null}
            {perk}
          </li>
        ))}
      </ul>
    </section>
  );
}
