import { getTranslations } from "next-intl/server";

/**
 * Who they are, in one sentence (the proof behind the hero's promise), before anything is for
 * sale. Set as an editorial aside (label left, statement right) so it reads as
 * a different thing from the section titles that follow. The line darkens as it scrolls into
 * place (CSS scroll-driven; static and fully dark with reduced motion).
 */
export async function Intro() {
  const t = await getTranslations("home");
  return (
    <section className="container-page section-y">
      {/* A centred pause between the hero and the homes: everything else on the page is left-aligned. */}
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="label">{t("heroEyebrow")}</p>
        <span aria-hidden className="mt-6 h-10 w-[2px] bg-ink" />
        <p className="mt-6 text-[clamp(1.5rem,1.15rem+1.2vw,2.25rem)] leading-[1.2] font-semibold tracking-[-0.025em] text-balance">
          <span className="scroll-ink">{t("intro1")}</span>
        </p>
      </div>
    </section>
  );
}
