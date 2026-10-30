import { getTranslations } from "next-intl/server";
import { site } from "@/content/site";
import { Link } from "@/i18n/navigation";
import { CookiePreferencesButton } from "@/components/consent/ConsentBanner";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { footerNav } from "./navItems";

/**
 * Footer with every legally and commercially required item (CLAUDE.md §7).
 * Branch hero-lines: editorial, on the stone ground. A light statement line, contact on the left
 * and the link columns grouped right, then a large cropped wordmark as a quiet signature.
 * AL licence numbers live on each apartment page.
 */
export async function Footer() {
  const t = await getTranslations();
  const year = 2026; // Static on purpose: avoids a time dependency in the prerendered shell.
  const heading = "label mb-5 text-ink-soft-text";
  // Underline only on hover, so the columns read calm.
  const link = "underline-offset-4 decoration-1 hover:underline";

  return (
    <footer className="overflow-hidden bg-wash text-ink">
      <div className="container-page pt-[clamp(3.5rem,7vw,6rem)]">
        <p className="text-h2 max-w-[18ch] font-light">{t("footer.statement")}</p>

        <div className="mt-[clamp(3rem,6vw,5rem)] grid gap-10 border-t border-ink/20 pt-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className={heading}>{t("footer.contact")}</h2>
            <address className="text-lead space-y-1 not-italic">
              <p>
                {site.address.street}, {site.address.postalCode} {site.address.city}
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
            <WhatsAppLink
              message={t("whatsapp.messageGeneric")}
              page="footer"
              icon={false}
              className="text-small mt-6 inline-flex items-center gap-2.5 transition-opacity hover:opacity-70"
            >
              <span className="grid size-8 place-items-center rounded-full bg-paper">
                <Icon name="whatsapp" size={16} strokeWidth={1.5} />
              </span>
              {t("whatsapp.short")}
            </WhatsAppLink>
          </div>

          <nav aria-label={t("footer.explore")} className="lg:col-span-2 lg:col-start-6">
            <h2 className={heading}>{t("footer.explore")}</h2>
            <ul className="text-small space-y-2.5">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={link}>
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("footer.legal")} className="lg:col-span-3">
            <h2 className={heading}>{t("footer.legal")}</h2>
            <ul className="text-small space-y-2.5">
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

          <div className="lg:col-span-2">
            <h2 className={heading}>{t("footer.social")}</h2>
            <ul className="flex gap-3">
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-10 place-items-center rounded-full border border-ink/25 transition-colors hover:bg-ink hover:text-paper"
                >
                  <Icon name="instagram" size={18} title="Instagram" />
                </a>
              </li>
              <li>
                <a
                  href={site.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-10 place-items-center rounded-full border border-ink/25 transition-colors hover:bg-ink hover:text-paper"
                >
                  <Icon name="facebook" size={18} title="Facebook" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 text-[0.8125rem]">
          <p>{t("footer.rights", { year })}</p>
          <LanguageSwitcher className="text-ink" />
        </div>
      </div>

      {/* Signature: the name across the full width, cropped by the page's bottom edge. */}
      <p
        aria-hidden
        translate="no"
        className="mt-8 -mb-[0.22em] text-center text-[clamp(2.5rem,13.5vw,15rem)] leading-[0.85] font-light tracking-[-0.05em] whitespace-nowrap text-ink/90"
      >
        Tripas-Coração
      </p>
    </footer>
  );
}
