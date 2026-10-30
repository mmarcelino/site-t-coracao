import { getTranslations } from "next-intl/server";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * Four steps that answer "is this a hotel or an Airbnb?": book, the digital guide (guest portal),
 * check in, and the WhatsApp concierge for what a guide can't cover. Compact on purpose.
 * Self check-in: TO CONFIRM (Guesty copy says some arrivals are met in person).
 */
export async function HowItWorks() {
  const t = await getTranslations("home");
  const steps: Array<{ icon: IconName; title: string; body: string }> = [
    { icon: "calendar", title: t("how1Title"), body: t("how1Body") },
    { icon: "phone", title: t("how2Title"), body: t("how2Body") },
    { icon: "key", title: t("how3Title"), body: t("how3Body") },
    { icon: "whatsapp", title: t("how4Title"), body: t("how4Body") },
  ];
  return (
    <section aria-labelledby="how-title" className="container-page section-y-tight">
      <div className="grid gap-10 lg:grid-cols-12">
        <h2 id="how-title" className="text-h2 reveal lg:col-span-4">
          {t("howTitle")}
        </h2>
        <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-8">
          {steps.map((step, i) => (
            <li key={step.title} className="reveal border-t border-ink/20 pt-5">
              <p className="flex items-center justify-between text-[0.8125rem] text-ink-soft-text tabular-nums">
                {String(i + 1).padStart(2, "0")}
                <span className="grid size-12 place-items-center rounded-full bg-wash text-ink">
                  <Icon name={step.icon} size={22} />
                </span>
              </p>
              <h3 className="mt-8 text-[1.375rem] leading-[1.1]">{step.title}</h3>
              <p className="mt-3 text-granite">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
