import type { FaqItem } from "@/content/faq";
import type { Locale } from "@/i18n/routing";
import { JsonLd } from "./JsonLd";
import { Icon } from "./ui/Icon";

/**
 * FAQ as real HTML (`<details>`), readable without JS and by crawlers, plus FAQPage JSON-LD
 * (CLAUDE.md §10). Answers' first sentence stands alone.
 */
export function FaqList({ items, locale, withJsonLd = true }: { items: FaqItem[]; locale: Locale; withJsonLd?: boolean }) {
  return (
    <>
      <div className="border-t border-ink/20">
        {items.map((item) => (
          <details key={item.id} className="group border-b border-ink/15" id={`faq-${item.id}`}>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
              <h3 className="text-lead leading-snug">{item.question[locale]}</h3>
              <Icon
                name="plus"
                size={20}
                className="shrink-0 transition-transform duration-[var(--duration-base)] group-open:rotate-45"
              />
            </summary>
            <p className="max-w-3xl pb-7 text-granite">{item.answer[locale]}</p>
          </details>
        ))}
      </div>
      {withJsonLd ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((item) => ({
              "@type": "Question",
              name: item.question[locale],
              acceptedAnswer: { "@type": "Answer", text: item.answer[locale] },
            })),
          }}
        />
      ) : null}
    </>
  );
}
