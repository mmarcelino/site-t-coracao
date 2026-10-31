import { getTranslations } from "next-intl/server";

/**
 * Who they are, before anything is for sale: "Since 2015" set large as the trust point, with one
 * sentence beside it. The sentence darkens as it scrolls into place (CSS scroll-driven; static and
 * fully dark with reduced motion).
 */
export async function Intro() {
  const t = await getTranslations("home");
  return (
    <section className="container-page section-y">
      <div className="grid items-end gap-6 md:grid-cols-12 md:gap-10">
        <p className="md:col-span-5">
          <span className="label block">{t("introSince")}</span>
          <span className="mt-2 block text-[clamp(5rem,3rem+9vw,11rem)] leading-[0.8] font-semibold tracking-[-0.05em] tabular-nums">
            2015
          </span>
        </p>
        <p className="max-w-[28ch] text-[clamp(1.5rem,1.15rem+1.2vw,2.25rem)] leading-[1.15] font-semibold tracking-[-0.025em] md:col-span-7">
          <span className="scroll-ink">{t("intro1")}</span>
        </p>
      </div>
    </section>
  );
}
