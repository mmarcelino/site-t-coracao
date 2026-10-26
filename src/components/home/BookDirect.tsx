import Image from "next/image";
import type { CSSProperties } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { perks, type Perk } from "@/content/perks";
import type { Locale } from "@/i18n/routing";
import { WhatsAppLink } from "@/components/WhatsAppLink";

/** Photo per perk (placeholders; decorative, the text carries the meaning). */
const perkImages: Record<Perk["id"], string> = {
  "best-rate": "/images/placeholder/breiner-skylight-01.jpg",
  flexible: "/images/placeholder/cordoaria-river-balcony-03.jpg",
  welcome: "/images/placeholder/sao-bento-duplex-01.jpg",
  concierge: "/images/placeholder/site-experiences.jpg",
  "early-late": "/images/placeholder/mouzinho-rooftop-e-03.jpg",
};

/**
 * Why book direct, as Numa's "How it works": a title on the signature colour, then cards that
 * stack as you scroll (sticky). Framed as hospitality, never as discounts.
 */
export async function BookDirect() {
  const t = await getTranslations();
  const locale = (await getLocale()) as Locale;

  return (
    <section aria-labelledby="direct-title" className="bg-wash">
      <div className="container-page pt-[var(--section)] pb-[var(--section-tight)]">
        <div className="reveal grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 id="direct-title" className="text-h1 lg:col-span-7">
            {t("home.directTitle")}
          </h2>
          <div className="lg:col-span-5">
            <p className="text-lead text-ink-soft-text">{t("home.directBody")}</p>
            <WhatsAppLink
              message={t("whatsapp.messageGeneric")}
              page="home"
              className="text-lead mt-6 inline-flex font-semibold hover:text-azulejo"
            >
              {t("whatsapp.cta")}
            </WhatsAppLink>
          </div>
        </div>

        <ol className="mt-[clamp(3rem,6vw,5rem)] space-y-6">
          {perks.map((perk, i) => (
            <li
              key={perk.id}
              className="stack-card"
              style={{ "--stack-i": i } as CSSProperties}
            >
              <article className="grid min-h-[clamp(22rem,50vh,30rem)] gap-6 overflow-hidden rounded-[var(--radius-card)] bg-white p-4 shadow-[0_-12px_40px_-24px_rgba(27,26,24,0.35)] md:grid-cols-2 md:gap-10 md:p-6">
                <div className="relative min-h-56 overflow-hidden rounded-[var(--radius-tile)] bg-limestone">
                  <Image src={perkImages[perk.id]} alt="" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
                </div>
                <div className="flex flex-col justify-end p-2 md:p-4">
                  <p className="label mb-4 text-granite">
                    {String(i + 1).padStart(2, "0")} / {String(perks.length).padStart(2, "0")}
                  </p>
                  <h3 className="text-h2">{perk.title[locale]}</h3>
                  <p className="text-lead mt-5 max-w-md text-granite">{perk.body[locale]}</p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
