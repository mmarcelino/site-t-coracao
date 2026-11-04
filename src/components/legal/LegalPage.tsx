import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import type { LegalBlock, LegalDoc } from "@/content/legal";
import type { Locale } from "@/i18n/routing";
import { isoToLocalDate } from "@/lib/dates";
import { createFormatter } from "@/lib/format";
import { alternates } from "@/lib/seo";
import { buttonClasses } from "@/components/ui/Button";
import { CookiePreferencesButton } from "@/components/consent/ConsentBanner";

/** Terms, privacy and cookie policy: one quiet reading layout (content in `src/content/legal.ts`). */
export async function legalMetadata(doc: LegalDoc, pathname: "/terms" | "/privacy" | "/cookies"): Promise<Metadata> {
  const locale = (await rootLocale()) as Locale;
  return { title: doc.title[locale], description: doc.intro[locale], alternates: alternates(locale, pathname) };
}

/** Plain text with [label](url) links; external links open in a new tab. */
function withLinks(text: string): ReactNode[] {
  return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return part;
    const [, label, href] = match;
    const external = /^https?:/.test(href!);
    return (
      <a key={i} href={href} className="underline underline-offset-2" {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {label}
      </a>
    );
  });
}

function Block({ block, locale, cookieLabel }: { block: LegalBlock; locale: Locale; cookieLabel: string }) {
  if ("p" in block) return <p>{withLinks(block.p[locale])}</p>;
  if ("list" in block) {
    return (
      <ul className="list-disc space-y-2 pl-5 marker:text-granite">
        {block.list[locale].map((item) => (
          <li key={item}>{withLinks(item)}</li>
        ))}
      </ul>
    );
  }
  if ("table" in block) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-small">
          <thead>
            <tr className="border-b border-ink/20">
              {block.table.head[locale].map((h) => (
                <th key={h} scope="col" className="label py-2 pr-6 align-bottom font-medium text-granite">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.table.rows.map((row) => (
              <tr key={row[locale].join("|")} className="border-b border-ink/10 align-top">
                {row[locale].map((cell, i) => (
                  <td key={i} className={i === 0 ? "py-3 pr-6 font-medium" : "py-3 pr-6"}>
                    {withLinks(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return <CookiePreferencesButton label={cookieLabel} className={buttonClasses("secondary", "md")} />;
}

export async function LegalPage({ doc }: { doc: LegalDoc }) {
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations("legal");
  const format = createFormatter(locale);
  const updated = format.dateTime(isoToLocalDate(doc.updated), { day: "numeric", month: "long", year: "numeric" });

  return (
    <article className="container-page max-w-3xl pt-[clamp(3rem,7vw,6rem)] pb-[clamp(4rem,9vw,8rem)]">
      <h1 className="text-h1">{doc.title[locale]}</h1>
      <p className="text-small mt-5 text-granite">{t("updated", { date: updated })}</p>
      {doc.draft ? (
        <p className="text-small mt-4 inline-block rounded-[var(--radius-tile)] bg-azulejo-tint px-3 py-2">{t("draft")}</p>
      ) : null}
      <p className="text-lead mt-10">{withLinks(doc.intro[locale])}</p>
      {doc.sections.map((section) => (
        <section key={section.heading.en} className="mt-12 border-t-2 border-ink pt-5">
          <h2 className="card-title">{section.heading[locale]}</h2>
          <div className="mt-5 space-y-5">
            {section.blocks.map((block, i) => (
              <Block key={i} block={block} locale={locale} cookieLabel={t("cookieSettings")} />
            ))}
          </div>
        </section>
      ))}
    </article>
  );
}
