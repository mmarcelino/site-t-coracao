import { getTranslations } from "next-intl/server";
import { site } from "@/content/site";
import { Link } from "@/i18n/navigation";
import { CookiePreferencesButton } from "@/components/consent/ConsentBanner";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { footerNav } from "./navItems";

/**
 * Footer with every legally and commercially required item (CLAUDE.md §7). An ink panel inside
 * the page margins, built like the home sections: a large headline (the WhatsApp concierge),
 * columns under rules like the book-direct perks, and the wordmark set big as the sign-off.
 * AL licence numbers live on each apartment page.
 */
export async function Footer() {
  const t = await getTranslations();
  const year = 2026; // Static on purpose: avoids a time dependency in the prerendered shell.
  const column = "border-t-2 border-paper pt-5";
  const heading = "label mb-6 text-paper/60";
  const link = "transition-colors hover:text-pop";
  const social = "grid size-11 place-items-center rounded-full border border-paper/30 transition-colors hover:border-pop hover:bg-pop hover:text-ink";

  return (
    <footer className="container-page pb-[var(--gutter)]">
      <div className="on-dark rounded-[var(--radius-card)] bg-ink px-[var(--gutter)] pt-[clamp(3rem,6vw,6rem)] pb-6 text-paper">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 className="text-h2 lg:col-span-7">{t("footer.title")}</h2>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-paper/80">{t("footer.intro")}</p>
            <WhatsAppLink
              message={t("whatsapp.messageGeneric")}
              page="footer"
              icon={false}
              className="mt-6 inline-flex h-12 items-center gap-2.5 rounded-full bg-pop px-6 font-semibold text-ink transition-colors hover:bg-paper"
            >
              <Icon name="whatsapp" size={18} strokeWidth={1.75} />
              {t("whatsapp.cta")}
            </WhatsAppLink>
            <p className="text-small mt-3 text-paper/60">{t("whatsapp.hours")}</p>
          </div>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          <div className={column}>
            <h2 className={heading}>{t("footer.visit")}</h2>
            <address className="space-y-3 not-italic">
              <p>
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}, {site.address.country}
              </p>
              <p>
                <a href={site.phoneHref} className={link}>
                  {site.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${site.email}`} className={link}>
                  {site.email}
                </a>
              </p>
            </address>
          </div>

          <nav aria-label={t("footer.explore")} className={column}>
            <h2 className={heading}>{t("footer.explore")}</h2>
            <ul className="space-y-3">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={link}>
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("footer.legal")} className={column}>
            <h2 className={heading}>{t("footer.legal")}</h2>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className={link}>
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className={link}>
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                {/* One cookie entry: reopens the consent choices, which link to the cookie policy. */}
                <CookiePreferencesButton label={t("footer.cookies")} className={`cursor-pointer text-left ${link}`} />
              </li>
              <li>
                <a href={site.complaintsBookUrl} target="_blank" rel="noopener noreferrer" className={link} lang="pt">
                  {t("footer.complaintsBook")}
                </a>
              </li>
            </ul>
          </nav>

          <div className={column}>
            <h2 className={heading}>{t("footer.social")}</h2>
            <ul className="flex gap-3">
              <li>
                <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className={social}>
                  <Icon name="instagram" size={20} title="Instagram" />
                </a>
              </li>
              <li>
                <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className={social}>
                  <Icon name="facebook" size={20} title="Facebook" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* The sign-off: the name set across the panel, sized to fill its width (the word is ~6.3em wide). */}
        <p
          aria-hidden="true"
          translate="no"
          className="mt-20 text-[calc((min(100vw,var(--page-max))-4*var(--gutter))/6.5)] leading-[0.85] font-semibold tracking-[-0.05em] whitespace-nowrap lg:mt-28"
        >
          Tripas-Coração
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-paper/15 pt-5 text-[0.8125rem] text-paper/60">
          <p>{t("footer.rights", { year })}</p>
          <div className="flex items-center gap-6">
            {/* Own colour, so the current language reads brightest (not the row's muted grey). */}
            <LanguageSwitcher tone="light" className="text-paper" />
            <a
              href="https://mariana-marcelino.com"
              target="_blank"
              rel="noopener"
              className="text-[0.75rem] transition-colors hover:text-paper"
            >
              {t("footer.madeBy")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
