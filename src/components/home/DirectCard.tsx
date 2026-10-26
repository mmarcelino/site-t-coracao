import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/Icon";

export interface HeroRating {
  score: string; // formatted, e.g. "9,4"
  count: string; // formatted, e.g. "2 234"
  mock: boolean;
}

/**
 * Why book here, in the hero: set as an editorial caption on the photo (no box), so the booking
 * box stays the only solid, interactive object. Perks are TO CONFIRM with the client (CLAUDE.md §15).
 */
export async function DirectCard({ rating }: { rating: HeroRating }) {
  const t = await getTranslations();
  const perks = [t("home.directCardPerk1"), t("home.directCardPerk2"), t("home.directCardPerk3")];
  return (
    <section aria-labelledby="direct-card-title" className="w-max shrink-0 text-paper">
      {/* As wide as the perk line, so the rating's right edge meets the last perk's. */}
      <div className="flex items-center justify-between gap-8 text-[0.75rem] leading-none">
        <h2 id="direct-card-title" className="label">
          {t("home.directCardTitle")}
        </h2>
        <p className="flex items-center gap-1.5 text-paper/90">
          <Icon name="star" size={11} fill="currentColor" strokeWidth={0} className="text-paper" />
          {t("home.directCardRating", { score: rating.score, count: rating.count })}
          {rating.mock ? <span className="sr-only">({t("common.demo")})</span> : null}
        </p>
      </div>
      <ul className="mt-3 flex items-center text-[1.0625rem] leading-none whitespace-nowrap">
        {perks.map((perk, i) => (
          <li key={perk} className="flex items-center">
            {i > 0 ? <span aria-hidden className="mx-3 size-[3px] rounded-full bg-paper/60" /> : null}
            {perk}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The same promise as one small line, for screens where the caption doesn't fit. */
export async function DirectPerksLine({ className }: { className?: string }) {
  const t = await getTranslations("home");
  const perks = [t("directCardPerk1"), t("directCardPerk2"), t("directCardPerk3")];
  return (
    <p className={`text-center text-[0.8125rem] text-paper md:text-right ${className ?? ""}`}>
      <span className="sr-only">{t("directCardTitle")}: </span>
      {perks.join(" · ")}
    </p>
  );
}
