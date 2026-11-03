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
 * An ink panel inside the page margins; text links only (social included), the one icon being
 * WhatsApp's, bare. AL licence numbers live on each apartment page.
 */
export async function Footer() {
  const t = await getTranslations();
  const year = 2026; // Static on purpose: avoids a time dependency in the prerendered shell.
  const heading = "label mb-5 text-paper/60";

  return (
    <footer className="container-page pb-[var(--gutter)]">
      <div className="on-dark rounded-[var(--radius-card)] bg-ink px-[var(--gutter)] pt-[clamp(2.5rem,5vw,4rem)] pb-8 text-paper">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className={heading}>{t("footer.contact")}</h2>
            <address className="text-small space-y-3 not-italic">
              <p>
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}, {site.address.country}
              </p>
              <p>
                <a href={site.phoneHref} className="transition-colors hover:text-pop">
                  {site.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-pop">
                  {site.email}
                </a>
              </p>
            </address>
            <WhatsAppLink
              message={t("whatsapp.messageGeneric")}
              page="footer"
              icon={false}
              className="group text-small mt-5 inline-flex items-center gap-2.5 font-semibold transition-colors hover:text-pop"
            >
              <Icon name="whatsapp" size={18} strokeWidth={1.5} />
              {t("whatsapp.short")}
            </WhatsAppLink>
          </div>

          <nav aria-label={t("footer.explore")}>
            <h2 className={heading}>{t("footer.explore")}</h2>
            <ul className="text-small space-y-3">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-pop">
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("footer.legal")}>
            <h2 className={heading}>{t("footer.legal")}</h2>
            <ul className="text-small space-y-3">
              <li>
                <Link href="/terms" className="transition-colors hover:text-pop">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:text-pop">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                {/* One cookie entry: reopens the consent choices, which link to the cookie policy. */}
                <CookiePreferencesButton
                  label={t("footer.cookies")}
                  className="cursor-pointer text-left transition-colors hover:text-pop"
                />
              </li>
              <li>
                <a
                  href={site.complaintsBookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-pop"
                  lang="pt"
                >
                  {t("footer.complaintsBook")}
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className={heading}>{t("footer.social")}</h2>
            <ul className="text-small space-y-3">
              <li>
                <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-pop">
                  Instagram
                </a>
              </li>
              <li>
                <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-pop">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-paper/25 pt-6 text-[0.8125rem] text-paper/60">
          <p>{t("footer.rights", { year })}</p>
          <div className="flex items-center gap-6">
            {/* Own colour, so the current language reads brightest (not the row's muted grey). */}
            <LanguageSwitcher tone="light" className="text-paper" />
            <a href="https://mariana-marcelino.com" target="_blank" rel="noopener" className="link-quiet text-[0.75rem] transition-colors hover:text-paper">
              {t("footer.madeBy")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
