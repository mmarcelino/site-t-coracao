import { getTranslations } from "next-intl/server";

/**
 * Who they are, in two sentences, before anything is for sale. Lines darken as they scroll
 * into place (CSS scroll-driven; static and fully dark with reduced motion).
 */
export async function Intro() {
  const t = await getTranslations("home");
  return (
    <section className="container-page section-y">
      <p className="text-statement max-w-[24ch] font-semibold">
        <span className="scroll-ink block">{t("intro1")}</span>
        <span className="scroll-ink mt-[0.4em] block">{t("intro2")}</span>
      </p>
    </section>
  );
}
