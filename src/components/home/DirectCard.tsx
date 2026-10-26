import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/Icon";

export interface HeroRating {
  score: string; // formatted, e.g. "9,4"
  count: string; // formatted, e.g. "2 234"
  mock: boolean;
}

/**
 * Why book here, in the hero (same glass as the booking box): three perks framed as hospitality,
 * plus one quiet line of proof. Perks are TO CONFIRM with the client (CLAUDE.md §15).
 */
export async function DirectCard({ rating }: { rating: HeroRating }) {
  const t = await getTranslations();
  const perks = [t("home.directCardPerk1"), t("home.directCardPerk2"), t("home.directCardPerk3")];
  return (
    <section
      aria-labelledby="direct-card-title"
      className="on-dark hero-glass w-[30rem] shrink-0 rounded-[1.75rem] border border-white/30 px-6 py-3.5 text-paper shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] backdrop-blur-xl"
    >
      <div className="flex items-baseline justify-between gap-4 text-[0.75rem] text-paper/80">
        <h2 id="direct-card-title">{t("home.directCardTitle")}</h2>
        <p className="flex items-center gap-1.5">
          <Icon name="star" size={11} fill="currentColor" strokeWidth={0} className="text-paper" />
          {t("home.directCardRating", { score: rating.score, count: rating.count })}
          {rating.mock ? <span className="sr-only">({t("common.demo")})</span> : null}
        </p>
      </div>
      <ul className="mt-1.5 flex items-center gap-x-2.5 text-[0.9375rem] leading-snug font-medium whitespace-nowrap">
        {perks.map((perk, i) => (
          <li key={perk} className="flex items-center gap-2.5">
            {i > 0 ? (
              <span aria-hidden className="text-paper/50">
                ·
              </span>
            ) : null}
            {perk}
          </li>
        ))}
      </ul>
    </section>
  );
}
