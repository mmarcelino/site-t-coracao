import { getLocale, getTranslations } from "next-intl/server";
import { site } from "@/content/site";
import { createFormatter } from "@/lib/format";

/**
 * Who we are, before anything is for sale (CLAUDE.md §7.1, item 2). Not a headline (the
 * collections heading follows): one large, plain paragraph saying what Tripas-Coração is and does,
 * ending on the selection criterion; then the buildings and the team in body text below it.
 */
export async function Intro() {
  const t = await getTranslations("home");
  const format = createFormatter(await getLocale());

  return (
    <section aria-labelledby="intro-lead" className="container-page pt-[var(--section)] pb-[var(--section-tight)]">
      <p id="intro-lead" className="reveal max-w-[62rem] text-[clamp(1.625rem,1.2rem+1.6vw,2.75rem)] leading-[1.2] font-light tracking-[-0.02em]">
        {t("introLead", { name: site.name, count: format.number(site.apartmentsMin) })}
      </p>
      <div className="reveal mt-10 grid gap-5 md:grid-cols-2 md:gap-10 lg:mt-14 lg:ml-[calc(100%/3)]">
        <p>{t("introBody")}</p>
        <p>{t("introTeam", { year: String(site.foundedYear), guests: format.number(site.guestsPerYear) })}</p>
      </div>
    </section>
  );
}
