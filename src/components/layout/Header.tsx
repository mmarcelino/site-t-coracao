"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Wordmark } from "./Wordmark";
import { site } from "@/content/site";
import { headerNav, menuNav } from "./navItems";
import { OPEN_MENU_EVENT } from "@/components/home/DockedSearch";

/**
 * Header. On the home page it sits transparent over the hero and scrolls away with it (the booking
 * bar docks instead, see DockedSearch); everywhere else it is solid and sticky. The full-screen
 * menu opens from the hamburger (phones) or from the docked bar (any width).
 */
export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const overlay = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const open = () => setMenuOpen(true);
    window.addEventListener(OPEN_MENU_EVENT, open);
    return () => window.removeEventListener(OPEN_MENU_EVENT, open);
  }, []);

  // Close the menu on navigation (render-time sync with the current path).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const button = menuButton.current;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [menuOpen]);

  const light = overlay;

  return (
    <>
      {/* Bar: wordmark, key links, WhatsApp and language
          on desktop; WhatsApp + hamburger on smaller screens. Transparent over the home hero,
          white once the page scrolls. */}
      <header
        className={clsx(
          "top-0 z-40 h-[var(--header-h)] transition-[background-color,color] duration-[var(--duration-base)] ease-[var(--ease-soft)]",
          overlay ? "relative" : "sticky",
          light ? "on-dark text-paper" : "bg-paper text-ink",
        )}
      >
        <div className="container-page flex h-full flex-col">
          <div className="flex flex-1 items-center justify-between">
            <Link href="/" aria-label={t("nav.home")} className="shrink-0">
              <Wordmark />
            </Link>
            {/* Desktop: the key links, always visible. */}
            <nav aria-label={t("nav.label")} className="hidden lg:block">
              <ul className="flex items-center gap-8">
                {headerNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className={clsx(
                        "text-[1.0625rem] font-semibold transition-[opacity,background-color,color] aria-[current=page]:underline aria-[current=page]:underline-offset-8",
                        "py-2 hover:opacity-70",
                      )}
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-3 sm:gap-5">
              {/* WhatsApp concierge: icon + label on desktop, icon only on smaller screens. */}
              <WhatsAppLink
                message={t("whatsapp.messageGeneric")}
                page={pathname}
                icon={false}
                className="flex h-11 items-center gap-2 px-1 transition-opacity hover:opacity-70"
              >
                <Icon name="whatsapp" size={24} strokeWidth={1.4} />
                <span className="hidden text-[1.0625rem] font-semibold whitespace-nowrap lg:inline">{t("whatsapp.short")}</span>
                <span className="sr-only lg:hidden">{t("whatsapp.cta")}</span>
              </WhatsAppLink>
              <LanguageSwitcher className="hidden lg:flex" tone={light ? "light" : "dark"} />
              <button
                ref={menuButton}
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-controls="site-menu"
                className="group -mr-2 flex h-11 items-center gap-3 px-2 lg:hidden"
              >
                <Hamburger />
                <span className="sr-only">{t("nav.openMenu")}</span>
              </button>
            </div>
          </div>
          {/* 2px rule along the bar's bottom, within the page margins: the same weight as the rule
              above "Book direct" at the bottom of the hero. */}
          {light ? <div aria-hidden className="h-[2px] bg-paper" /> : null}
        </div>
        {/* On the solid bar the black rule runs edge to edge, like the docked booking bar's. */}
        {light ? null : <div aria-hidden className="h-[2px] bg-ink" />}
      </header>

      {menuOpen ? (
        <div
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.label")}
          className="on-dark animate-fade-in-fast fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink text-paper"
        >
          <div className="container-page flex h-[var(--header-h)] shrink-0 flex-col">
            <div className="flex flex-1 items-center justify-between">
              <Link href="/" aria-label={t("nav.home")}>
                <Wordmark />
              </Link>
              <button
                ref={closeButton}
                type="button"
                onClick={() => setMenuOpen(false)}
                className="-mr-2 flex h-11 items-center gap-3 px-2 transition-opacity hover:opacity-70"
              >
                <span className="label hidden sm:inline">{t("common.close")}</span>
                <Icon name="close" size={24} strokeWidth={1.4} />
                <span className="sr-only">{t("nav.closeMenu")}</span>
              </button>
            </div>
            {/* Same 2px rule as under the nav over the hero. */}
            <div aria-hidden className="h-[2px] bg-paper" />
          </div>

          {/* The same links as the header and footer, in sentence case at section-title weight; contact
              and booking on the right. Sized to sit calmly on a desktop screen. */}
          <div className="container-page grid flex-1 content-start gap-14 py-10 lg:grid-cols-12 lg:gap-10 lg:py-16">
            <nav aria-label={t("nav.label")} className="lg:col-span-7">
              <ul className="border-b border-paper/20">
                {menuNav.map((item) => (
                  <li key={item.href} className="border-t border-paper/20">
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className="group flex items-center justify-between gap-6 py-4 text-[clamp(1.75rem,1.2rem+1.8vw,2.75rem)] leading-tight font-semibold tracking-[-0.02em] lg:py-5"
                    >
                      <span className="transition-opacity group-hover:opacity-70 group-aria-[current=page]:opacity-60">
                        {t(`nav.${item.key}`)}
                      </span>
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-pop text-ink transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)] group-hover:translate-x-2">
                        <Icon name="arrowRight" size={18} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-col gap-10 lg:col-span-4 lg:col-start-9">
              <div>
                <p className="label mb-5 text-paper/60">{t("footer.contact")}</p>
                <WhatsAppLink
                  message={t("whatsapp.messageGeneric")}
                  page={pathname}
                  icon={false}
                  className="inline-flex items-center gap-3 text-lead font-semibold transition-opacity hover:opacity-70"
                >
                  <span className="grid size-10 place-items-center rounded-full bg-pop text-ink">
                    <Icon name="whatsapp" size={18} strokeWidth={1.5} />
                  </span>
                  {t("whatsapp.short")}
                </WhatsAppLink>
                <p className="text-small mt-2 text-paper/60">{t("whatsapp.hoursShort")}</p>
                <address className="text-small mt-6 space-y-1 text-paper/80 not-italic">
                  <p>
                    <a href={site.phoneHref} className="hover:underline">
                      {site.phone}
                    </a>
                  </p>
                  <p>
                    <a href={`mailto:${site.email}`} className="hover:underline">
                      {site.email}
                    </a>
                  </p>
                  <p>
                    {site.address.street}, {site.address.postalCode} {site.address.city}
                  </p>
                </address>
              </div>
              <div className="flex items-center justify-between gap-6 border-t border-paper/20 pt-6">
                <LanguageSwitcher tone="light" className="text-paper" />
                <Link
                  href="/apartments"
                  className="inline-flex h-11 items-center rounded-full bg-paper px-6 text-[0.9375rem] font-semibold text-ink transition-colors hover:bg-pop"
                >
                  {t("common.bookNow")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

/** Two hairlines, the top one shorter; it extends to full width on hover. */
function Hamburger() {
  return (
    <svg width="36" height="14" viewBox="0 0 36 14" aria-hidden focusable="false" className="overflow-visible">
      <line
        x1="0"
        y1="1"
        x2="36"
        y2="1"
        stroke="currentColor"
        strokeWidth="1.5"
        className="origin-right scale-x-[0.55] transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)] group-hover:scale-x-100"
      />
      <line x1="0" y1="13" x2="36" y2="13" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
