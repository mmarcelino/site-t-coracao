import { getTranslations } from "next-intl/server";
import { site } from "@/content/site";
import { Link } from "@/i18n/navigation";
import { CookiePreferencesButton } from "@/components/consent/ConsentBanner";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { Wordmark } from "./Wordmark";
import { primaryNav } from "./navItems";

/** Footer with every legally and commercially required item (CLAUDE.md §7). */
export async function Footer() {
  const t = await getTranslations();
  const year = 2026; // Static on purpose: avoids a time dependency in the prerendered shell.

  return (
    <footer className="on-dark bg-ink text-paper">
      <div className="container-page section-y-tight">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Wordmark />
            <p className="text-small mt-5 max-w-sm text-granite-light">{t("footer.tagline")}</p>
            <WhatsAppLink
              message={t("whatsapp.messageGeneric")}
              page="footer"
              className="inline-flex text-lead mt-8 border-b border-paper/30 pb-1 transition-colors hover:border-paper"
            >
              {t("whatsapp.cta")}
            </WhatsAppLink>
            <p className="text-small mt-3 text-granite-light">{t("whatsapp.hours")}</p>
          </div>

          <div className="md:col-span-3">
            <h2 className="label mb-5 text-granite-light">{t("footer.contact")}</h2>
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
            <h2 className="label mt-8 mb-4 text-granite-light">{t("footer.social")}</h2>
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
            <h2 className="label mb-5 text-granite-light">{t("footer.explore")}</h2>
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
            <h2 className="label mb-5 text-granite-light">{t("footer.legal")}</h2>
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

        <div className="mt-16 grid gap-4 border-t border-paper/15 pt-8 text-[0.8125rem] text-granite-light md:grid-cols-12">
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
