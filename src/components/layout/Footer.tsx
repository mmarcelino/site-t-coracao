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
 * Branch ahotels: an ink panel inside the page margins (same curve as the yellow book-direct
 * panel), led by one big WhatsApp invitation. AL licence numbers live on each apartment page.
 */
export async function Footer() {
  const t = await getTranslations();
  const year = 2026; // Static on purpose: avoids a time dependency in the prerendered shell.
  const heading = "label mb-5 text-paper/60";

  return (
    <footer className="container-page pb-[var(--gutter)]">
      <div className="on-dark rounded-[var(--radius-card)] bg-ink px-[var(--gutter)] pt-[clamp(3rem,6vw,5rem)] pb-8 text-paper">
        <WhatsAppLink
          message={t("whatsapp.messageGeneric")}
          page="footer"
          icon={false}
          className="group inline-flex items-center gap-5 text-h1 font-semibold"
        >
          {t("whatsapp.short")}
          <span className="grid size-[0.9em] place-items-center rounded-full bg-pop text-ink transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)] group-hover:translate-x-2">
            <Icon name="whatsapp" size={28} strokeWidth={1.5} />
          </span>
        </WhatsAppLink>

        <div className="mt-[clamp(3rem,6vw,5rem)] grid gap-10 border-t border-paper/20 pt-10 sm:grid-cols-2 lg:grid-cols-4">
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
            <ul className="flex gap-3">
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-11 place-items-center rounded-full border border-paper/30 transition-colors hover:border-pop hover:bg-pop hover:text-ink"
                >
                  <Icon name="instagram" size={20} title="Instagram" />
                </a>
              </li>
              <li>
                <a
                  href={site.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-11 place-items-center rounded-full border border-paper/30 transition-colors hover:border-pop hover:bg-pop hover:text-ink"
                >
                  <Icon name="facebook" size={20} title="Facebook" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 text-[0.8125rem] text-paper/60">
          <p>{t("footer.rights", { year })}</p>
          <div className="flex items-center gap-3">
            <span className="label">{t("language.label")}</span>
            <LanguageSwitcher tone="light" />
          </div>
        </div>
      </div>
    </footer>
  );
}
