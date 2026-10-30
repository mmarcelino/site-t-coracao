import { getTranslations } from "next-intl/server";

/**
 * Who they are, in one sentence (the proof behind the hero's promise), before anything is for
 * sale. The line darkens as it scrolls into place (CSS scroll-driven; static and fully dark with reduced motion).
 */
export async function Intro() {
  const t = await getTranslations("home");
  return (
    <section className="container-page section-y">
      <p className="text-statement max-w-[24ch] font-semibold">
        <span className="scroll-ink block">{t("intro1")}</span>
      </p>
    </section>
  );
}
