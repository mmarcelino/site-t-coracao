import { getLocale, getTranslations } from "next-intl/server";
import { perks, type Perk } from "@/content/perks";
import type { Locale } from "@/i18n/routing";
import { Icon, type IconName } from "@/components/ui/Icon";
import { WhatsAppLink } from "@/components/WhatsAppLink";

const perkIcons: Record<Perk["id"], IconName> = {
  "best-rate": "tag",
  flexible: "refresh",
  welcome: "gift",
  concierge: "whatsapp",
  "early-late": "key",
};

/** Why book direct, as hospitality (not discounts). Dark section for rhythm. */
export async function BookDirect() {
  const t = await getTranslations();
  const locale = (await getLocale()) as Locale;

  return (
    <section aria-labelledby="direct-title" className="on-dark bg-ink text-paper">
      <div className="container-page section-y grid gap-14 lg:grid-cols-12">
        <div className="reveal lg:col-span-5">
          <p className="label mb-5 text-granite-light">{t("home.directEyebrow")}</p>
          <h2 id="direct-title" className="text-h2">
            {t("home.directTitle")}
          </h2>
          <p className="text-lead mt-6 max-w-md text-paper/75">{t("home.directBody")}</p>
          <WhatsAppLink
            message={t("whatsapp.messageGeneric")}
            page="home"
            className="inline-flex text-lead mt-10 border-b border-paper/30 pb-1 transition-colors hover:border-paper"
          >
            {t("whatsapp.cta")}
          </WhatsAppLink>
        </div>
        <ol className="lg:col-span-6 lg:col-start-7">
          {perks.map((perk, i) => (
            <li key={perk.id} className="reveal grid grid-cols-[2.5rem_1fr] gap-x-5 border-t border-paper/15 py-7 last:border-b">
              <Icon name={perkIcons[perk.id]} size={24} className="mt-1 text-paper/70" />
              <div>
                <h3 className="text-lead font-normal">
                  <span className="sr-only">{i + 1}. </span>
                  {perk.title[locale]}
                </h3>
                <p className="mt-2 text-paper/70">{perk.body[locale]}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
