import clsx from "clsx";
import { getLocale, getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/Icon";
import { bookDirectComparison } from "@/content/perks";
import type { Locale } from "@/i18n/routing";

/**
 * Why book direct, as a side-by-side: booking with us vs. on a platform, row by row. Framed as
 * hospitality, never as discounts. Branch hero-lines: on the stone band, "with us" in a white
 * column, the platform column muted.
 */
export async function BookDirect() {
  const t = await getTranslations("home");
  const locale = (await getLocale()) as Locale;
  const rows = bookDirectComparison;
  const last = rows.length - 1;

  return (
    <section aria-labelledby="direct-title" className="bg-wash">
      <div className="container-page section-y-tight">
        <h2 id="direct-title" className="text-h1 reveal">
          {t("directTitle")}
        </h2>

        <table className="reveal mt-12 w-full border-separate border-spacing-0 text-left lg:mt-16">
          <thead>
            <tr>
              <td className="hidden md:table-cell md:w-[22%]" />
              <th scope="col" className="rounded-t-[var(--radius-card)] bg-paper px-5 pt-6 pb-4 md:px-8">
                <span className="label">{t("directUs")}</span>
              </th>
              <th scope="col" className="px-5 pt-6 pb-4 md:px-8">
                <span className="label text-ink-soft-text">{t("directPlatform")}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id}>
                <th
                  scope="row"
                  className="hidden border-t border-ink/15 py-5 align-top font-normal text-ink-soft-text md:table-cell"
                >
                  {row.label[locale]}
                </th>
                <td
                  className={clsx(
                    "bg-paper px-5 py-5 align-top md:px-8",
                    i === last && "rounded-b-[var(--radius-card)] pb-7",
                  )}
                >
                  <span className="flex items-start gap-3 border-t border-ink/10 pt-5 -mt-5 md:text-lead">
                    <Icon name="check" size={18} className="mt-1 shrink-0" />
                    <span>
                      {/* Phones: the row label sits above (the label column is hidden). */}
                      <span className="label mb-1.5 block text-ink-soft-text md:hidden">{row.label[locale]}</span>
                      {row.direct[locale]}
                    </span>
                  </span>
                </td>
                <td className="border-t border-ink/15 px-5 py-5 align-top text-ink-soft-text md:px-8">
                  {row.platform[locale]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
