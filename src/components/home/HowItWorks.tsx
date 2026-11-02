import { getTranslations } from "next-intl/server";

/**
 * Four steps that answer "is this a hotel or an Airbnb?": book, check in,
 * the digital guide (guest portal), and the WhatsApp concierge for what a guide can't cover. Compact on purpose.
 * Self check-in: TO CONFIRM (Guesty copy says some arrivals are met in person).
 */
export async function HowItWorks() {
  const t = await getTranslations("home");
  const steps: Array<{ title: string; body: string }> = [
    { title: t("how1Title"), body: t("how1Body") },
    { title: t("how3Title"), body: t("how3Body") },
    { title: t("how2Title"), body: t("how2Body") },
    { title: t("how4Title"), body: t("how4Body") },
  ];
  return (
    <section aria-labelledby="how-title" className="container-page section-y-tight">
      <h2 id="how-title" className="text-h2 reveal">
        {t("howTitle")}
      </h2>
      {/* A timeline: each step's line runs only across its own column, with the step number cutting in
          at the start (four across on desktop, stacked on phones). */}
      <ol className="mt-[clamp(2.5rem,5vw,4rem)] grid gap-12 md:grid-cols-4 md:gap-8">
        {steps.map((step, i) => (
          <li key={step.title} className="reveal relative border-t-2 border-ink pt-10">
            <span
              aria-hidden
              className="absolute top-0 left-0 grid h-12 -translate-y-1/2 items-center bg-paper pr-5 text-[1.75rem] leading-none font-semibold tabular-nums"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="card-title">{step.title}</h3>
            <p className="mt-3 max-w-xs text-granite">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
