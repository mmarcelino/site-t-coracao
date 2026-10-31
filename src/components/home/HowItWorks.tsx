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
      {/* A timeline: one continuous line with the step numbers on it (across on desktop, down the
          left edge on phones), so it reads as a sequence rather than another grid. */}
      <ol className="relative mt-[clamp(2.5rem,5vw,4rem)] grid gap-10 border-l border-ink pl-8 md:grid-cols-4 md:gap-8 md:border-t md:border-l-0 md:pt-0 md:pl-0">
        {steps.map((step, i) => (
          <li key={step.title} className="reveal relative md:pt-10">
            <span
              aria-hidden
              className="absolute top-0 -left-8 grid size-14 -translate-x-1/2 place-items-center rounded-full bg-paper text-[1.75rem] leading-none font-semibold tabular-nums md:left-0 md:-translate-x-0 md:-translate-y-1/2 md:justify-items-start"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="pt-14 text-[1.375rem] leading-[1.1] md:pt-0">{step.title}</h3>
            <p className="mt-3 max-w-xs text-granite">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
