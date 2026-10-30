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
 * Branch hero-lines: one compact block on the stone ground: name and contact on the left, short
 * link columns on the right, a slim bottom row. AL licence numbers live on each apartment page.
 */
export async function Footer() {
  const t = await getTranslations();
  const year = 2026; // Static on purpose: avoids a time dependency in the prerendered shell.
  const heading = "label mb-4 text-ink-soft-text";
  // Underline only on hover, so the columns read calm.
  const link = "underline-offset-4 decoration-1 hover:underline";

  return (
    <footer className="bg-wash text-ink">
      <div className="container-page py-12 md:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href="/" aria-label={t("nav.home")} className="inline-block">
              <Wordmark />
            </Link>
            <address className="text-small mt-5 space-y-1 not-italic">
              <p>
                {site.address.street}, {site.address.postalCode} {site.address.city}
              </p>
              <p>
                <a href={site.phoneHref} className={link}>
                  {site.phone}
                </a>
                {" · "}
                <a href={`mailto:${site.email}`} className={link}>
                  {site.email}
                </a>
              </p>
            </address>
            <div className="mt-5 flex items-center gap-2">
              <WhatsAppLink
                message={t("whatsapp.messageGeneric")}
                page="footer"
                icon={false}
                className="grid size-9 place-items-center rounded-full border border-ink/30 transition-colors hover:bg-ink hover:text-paper"
              >
                <Icon name="whatsapp" size={16} strokeWidth={1.5} />
                <span className="sr-only">{t("whatsapp.short")}</span>
              </WhatsAppLink>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="grid size-9 place-items-center rounded-full border border-ink/30 transition-colors hover:bg-ink hover:text-paper"
              >
                <Icon name="instagram" size={16} title="Instagram" />
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="grid size-9 place-items-center rounded-full border border-ink/30 transition-colors hover:bg-ink hover:text-paper"
              >
                <Icon name="facebook" size={16} title="Facebook" />
              </a>
            </div>
          </div>

          <nav aria-label={t("footer.explore")} className="lg:col-span-4 lg:col-start-6">
            <h2 className={heading}>{t("footer.explore")}</h2>
            <ul className="text-small grid grid-cols-2 gap-x-6 gap-y-2">
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
            <ul className="text-small space-y-2">
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

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-ink/20 pt-5 text-[0.8125rem]">
          <p>{t("footer.rights", { year })}</p>
          <LanguageSwitcher className="text-ink" />
        </div>
      </div>
    </footer>
  );
}
