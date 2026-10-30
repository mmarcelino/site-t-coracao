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
 * Branch hero-lines: light and editorial like the hero (hairline rules, no panel).
 * AL licence numbers live on each apartment page.
 */
export async function Footer() {
  const t = await getTranslations();
  const year = 2026; // Static on purpose: avoids a time dependency in the prerendered shell.
  const heading = "label mb-5 text-granite";

  return (
    <footer className="container-page pb-[var(--gutter)]">
      <div className="border-t border-ink/20 pt-[clamp(2.5rem,5vw,4rem)] pb-4 text-ink">
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
                <a href={site.phoneHref} className="link-quiet">
                  {site.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${site.email}`} className="link-quiet">
                  {site.email}
                </a>
              </p>
            </address>
            <WhatsAppLink
              message={t("whatsapp.messageGeneric")}
              page="footer"
              icon={false}
              className="group text-small mt-5 inline-flex items-center gap-2.5 transition-colors hover:text-granite"
            >
              <span className="grid size-8 place-items-center rounded-full border border-ink/25">
                <Icon name="whatsapp" size={16} strokeWidth={1.5} />
              </span>
              {t("whatsapp.short")}
            </WhatsAppLink>
          </div>

          <nav aria-label={t("footer.explore")}>
            <h2 className={heading}>{t("footer.explore")}</h2>
            <ul className="text-small space-y-3">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-quiet">
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
                <Link href="/terms" className="link-quiet">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="link-quiet">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                {/* One cookie entry: reopens the consent choices, which link to the cookie policy. */}
                <CookiePreferencesButton
                  label={t("footer.cookies")}
                  className="cursor-pointer text-left link-quiet"
                />
              </li>
              <li>
                <a
                  href={site.complaintsBookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-quiet"
                  lang="pt"
                >
                  {t("footer.complaintsBook")}
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className={heading}>{t("footer.social")}</h2>
            <ul className="flex gap-3">
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-11 place-items-center rounded-full border border-ink/25 transition-colors hover:bg-ink hover:text-paper"
                >
                  <Icon name="instagram" size={20} title="Instagram" />
                </a>
              </li>
              <li>
                <a
                  href={site.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-11 place-items-center rounded-full border border-ink/25 transition-colors hover:bg-ink hover:text-paper"
                >
                  <Icon name="facebook" size={20} title="Facebook" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-ink/15 pt-6 text-[0.8125rem] text-granite">
          <p>{t("footer.rights", { year })}</p>
          {/* Own colour, so the current language reads darkest (not the row's muted grey). */}
          <LanguageSwitcher className="text-ink" />
        </div>
      </div>
    </footer>
  );
}
