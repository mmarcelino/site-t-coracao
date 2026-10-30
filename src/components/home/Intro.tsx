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
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
        <p className="label lg:col-span-3 lg:pt-4">{t("heroEyebrow")}</p>
        <p className="text-statement max-w-[26ch] font-semibold lg:col-span-9">
          <span className="scroll-ink block">{t("intro1")}</span>
        </p>
      </div>
    </section>
  );
}
