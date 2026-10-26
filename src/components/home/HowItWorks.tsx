import { getTranslations } from "next-intl/server";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * Three steps that answer "is this a hotel or an Airbnb?". Compact on purpose.
 * Self check-in: TO CONFIRM (Guesty copy says some arrivals are met in person).
 */
export async function HowItWorks() {
  const t = await getTranslations("home");
  const steps: Array<{ icon: IconName; title: string; body: string }> = [
    { icon: "calendar", title: t("how1Title"), body: t("how1Body") },
    { icon: "key", title: t("how2Title"), body: t("how2Body") },
    { icon: "whatsapp", title: t("how3Title"), body: t("how3Body") },
  ];
  return (
    <section aria-labelledby="how-title" className="container-page section-y-tight">
      <div className="grid gap-10 lg:grid-cols-12">
        <h2 id="how-title" className="text-h2 reveal lg:col-span-4">
          {t("howTitle")}
        </h2>
        <ol className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
          {steps.map((step, i) => (
            <li key={step.title} className="reveal">
              <p className="flex items-center gap-3 text-[0.8125rem] font-semibold text-azulejo">
                <span className="grid size-9 place-items-center rounded-full bg-wash text-ink">
                  <Icon name={step.icon} size={18} />
                </span>
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="text-h3 mt-5">{step.title}</h3>
              <p className="mt-3 text-granite">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
