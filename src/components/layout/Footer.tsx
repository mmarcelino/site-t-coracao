import { getTranslations } from "next-intl/server";
import { site } from "@/content/site";
import { Link } from "@/i18n/navigation";
import { CookiePreferencesButton } from "@/components/consent/ConsentBanner";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Wordmark } from "./Wordmark";
import { footerNav } from "./navItems";

/**
 * Footer with every legally and commercially required item (CLAUDE.md §7).
 * An ink panel inside the page margins: the wordmark, then three text columns whose rows share one
 * line grid (fixed row height, no extra gaps), so lines align across columns. Social links sit in
 * the bottom row. AL licence numbers live on each apartment page.
 * On phones, pages with a fixed bottom bar (home search, booking bar) mark it `data-bottom-bar`;
 * the footer then leaves room so its last line isn't hidden.
 */
export async function Footer() {
  const t = await getTranslations();
  const year = 2026; // Static on purpose: avoids a time dependency in the prerendered shell.
  const heading = "label mb-4 text-paper/60";
  const list = "text-small leading-9";
  const link = "transition-colors hover:text-pop";

  return (
    <footer className="container-page pb-[var(--gutter)] max-lg:[body:has([data-bottom-bar])_&]:pb-28">
      <div className="on-dark rounded-[var(--radius-card)] bg-ink px-[var(--gutter)] pt-[clamp(2.5rem,5vw,4rem)] pb-8 text-paper">
        <div className="grid gap-10 sm:grid-cols-3 lg:grid-cols-4">
          <Link href="/" aria-label={t("nav.home")} className="self-start sm:col-span-3 lg:col-span-1">
            <Wordmark />
          </Link>

          <div>
            <h2 className={heading}>{t("footer.contact")}</h2>
            <address className="not-italic">
              <ul className={list}>
                <li>{site.address.street}</li>
                <li>
                  {site.address.postalCode} {site.address.city}, {site.address.country}
                </li>
                <li>
                  <a href={site.phoneHref} className={link}>
                    {site.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} className={link}>
                    {site.email}
                  </a>
                </li>
                <li>
                  <WhatsAppLink
                    message={t("whatsapp.messageGeneric")}
                    page="footer"
                    icon={false}
                    className={`inline-flex items-center gap-2.5 ${link}`}
                  >
                    <Icon name="whatsapp" size={18} strokeWidth={1.25} />
                    {t("whatsapp.short")}
                  </WhatsAppLink>
                </li>
              </ul>
            </address>
          </div>

          <nav aria-label={t("footer.explore")}>
            <h2 className={heading}>{t("footer.explore")}</h2>
            <ul className={list}>
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={link}>
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("footer.legal")}>
            <h2 className={heading}>{t("footer.legal")}</h2>
            <ul className={list}>
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
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-paper/25 pt-6 text-[0.8125rem] text-paper/60">
          <p>{t("footer.rights", { year })}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <ul aria-label={t("footer.social")} className="flex gap-5">
              <li>
                <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-paper">
                  Instagram
                </a>
              </li>
              <li>
                <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-paper">
                  Facebook
                </a>
              </li>
            </ul>
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
