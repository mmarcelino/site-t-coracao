import { getLocale, getTranslations } from "next-intl/server";
import { perks, type Perk } from "@/content/perks";
import type { Locale } from "@/i18n/routing";

const homePerks: Perk["id"][] = ["best-rate", "flexible", "welcome", "concierge"];

/**
 * Loose hand-drawn outlines (ahotels-style), one per perk, drawn as they scroll into view.
 * Paths use pathLength="1" so the draw animation works whatever their real length.
 */
const outlines = [
  "M14 52 C10 22 40 8 92 10 C150 12 192 20 190 54 C188 92 150 104 96 102 C40 100 18 86 14 52 Z",
  "M8 30 C8 14 20 8 46 8 L158 10 C184 10 194 18 192 40 L190 82 C190 98 176 104 150 102 L36 100 C16 100 8 90 8 72 Z",
  "M100 8 C150 6 196 34 192 62 C188 92 150 106 98 102 C42 98 6 84 10 52 C14 22 52 10 100 8 Z",
  "M18 20 C60 4 150 6 186 22 C200 40 196 78 176 94 C140 108 54 106 22 92 C4 76 4 38 18 20 Z",
];

/** Why book direct: four perks framed as hospitality, never as discounts. */
export async function BookDirect() {
  const t = await getTranslations("home");
  const locale = (await getLocale()) as Locale;
  const items = homePerks.map((id) => perks.find((p) => p.id === id)).filter((p): p is Perk => Boolean(p));

  return (
    <section aria-labelledby="direct-title" className="border-y border-ink bg-cork text-ink">
      <div className="container-page section-y-tight">
        <h2 id="direct-title" className="text-h1 reveal">
          {t("directTitle")}
        </h2>
        <ul className="mt-14 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((perk, i) => (
            <li key={perk.id} className="reveal">
              <div className="relative grid aspect-[2/1] max-w-[15rem] place-items-center px-6">
                <svg
                  aria-hidden
                  viewBox="0 0 200 110"
                  preserveAspectRatio="none"
                  className="absolute inset-0 size-full overflow-visible"
                >
                  <path
                    d={outlines[i % outlines.length]}
                    pathLength={1}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    vectorEffect="non-scaling-stroke"
                    className="draw-on-view"
                  />
                </svg>
                <h3 className="relative text-center text-[1.5rem] leading-[1.05]">{perk.title[locale]}</h3>
              </div>
              <p className="mt-5 max-w-xs">{perk.body[locale]}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
