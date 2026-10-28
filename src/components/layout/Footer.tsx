import { getTranslations } from "next-intl/server";
import { site } from "@/content/site";
import { Link } from "@/i18n/navigation";
import { CookiePreferencesButton } from "@/components/consent/ConsentBanner";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Wordmark } from "./Wordmark";
import { primaryNav } from "./navItems";

/**
 * Footer with every legally and commercially required item (CLAUDE.md §7).
 * numa-like: signature colour block with a giant wordmark across the bottom.
 */
export async function Footer() {
  const t = await getTranslations();
  const year = 2026; // Static on purpose: avoids a time dependency in the prerendered shell.

  return (
    <footer className="border-t border-ink bg-cork text-ink">
      <div className="container-page section-y-tight">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-h3 max-w-sm">{t("footer.tagline")}</p>
            <WhatsAppLink
              message={t("whatsapp.messageGeneric")}
              page="footer"
              className="inline-flex text-lead mt-8 font-semibold transition-colors hover:text-azulejo"
            >
              {t("whatsapp.cta")}
            </WhatsAppLink>
            <p className="text-small mt-2 text-ink">{t("whatsapp.hours")}</p>
            <div className="mt-8 flex items-center gap-4">
              <span className="label text-ink">{t("language.label")}</span>
              <LanguageSwitcher />
            </div>
          </div>

          <div className="md:col-span-3">
            <h2 className="label mb-5 text-ink">{t("footer.contact")}</h2>
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
            <h2 className="label mt-8 mb-4 text-ink">{t("footer.social")}</h2>
            <ul className="flex gap-4">
              <li>
                <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="block p-1 -m-1 opacity-80 hover:opacity-100">
                  <Icon name="instagram" size={22} title="Instagram" />
                </a>
              </li>
              <li>
                <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="block p-1 -m-1 opacity-80 hover:opacity-100">
                  <Icon name="facebook" size={22} title="Facebook" />
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label={t("footer.explore")} className="md:col-span-2">
            <h2 className="label mb-5 text-ink">{t("footer.explore")}</h2>
            <ul className="text-small space-y-3">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-quiet">
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/faq" className="link-quiet">
                  {t("nav.faq")}
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label={t("footer.legal")} className="md:col-span-2">
            <h2 className="label mb-5 text-ink">{t("footer.legal")}</h2>
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
                <Link href="/cookies" className="link-quiet">
                  {t("footer.cookies")}
                </Link>
              </li>
              <li>
                <CookiePreferencesButton
                  label={t("footer.cookiePreferences")}
                  className="link-quiet cursor-pointer text-left"
                />
              </li>
              <li>
                <a href={site.complaintsBookUrl} target="_blank" rel="noopener noreferrer" className="link-quiet" lang="pt">
                  {t("footer.complaintsBook")}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <p aria-hidden className="mt-20 overflow-hidden">
          <Wordmark className="block text-[clamp(3.25rem,0.5rem+12.2vw,13rem)] leading-[0.9] [&>span]:text-[1em]" />
        </p>
        <div className="mt-8 grid gap-4 border-t border-ink/20 pt-8 text-[0.8125rem] text-ink md:grid-cols-12">
          <p className="md:col-span-8">
            <span className="label mr-3 text-[0.6875rem]">{t("footer.licences")}</span>
            {site.licencesNote}
          </p>
          <p className="md:col-span-4 md:text-right">{t("footer.rights", { year })}</p>
        </div>
      </div>
    </footer>
  );
}
