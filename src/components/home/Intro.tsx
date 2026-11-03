import { getLocale, getTranslations } from "next-intl/server";
import { site } from "@/content/site";
import { createFormatter } from "@/lib/format";

/**
 * Who we are, before anything is for sale (CLAUDE.md §7.1, item 2): the selection criterion as one
 * large statement, then what it leads to (historic buildings, careful restoration, comfortable
 * design-led interiors) and who looks after it, in a narrower column at the statement's foot.
 */
export async function Intro() {
  const t = await getTranslations("home");
  const format = createFormatter(await getLocale());

  return (
    <section aria-labelledby="intro-title" className="container-page section-y">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="reveal lg:col-span-7">
          <p className="label text-granite">{t("introLabel")}</p>
          <h2 id="intro-title" className="mt-5 text-statement">
            {t("introStatement")}
          </h2>
        </div>
        <div className="reveal space-y-5 lg:col-span-4 lg:col-start-9">
          <p>{t("introBody")}</p>
          <p>
            {t("introTeam", { year: String(site.foundedYear), guests: format.number(site.guestsPerYear) })}
          </p>
        </div>
      </div>
    </section>
  );
}
