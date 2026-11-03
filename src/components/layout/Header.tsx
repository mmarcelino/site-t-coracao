"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { ContactDetails, SocialLinks } from "./ContactDetails";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Wordmark } from "./Wordmark";
import { headerNav, menuNav, ownersNav } from "./navItems";
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

  // The wordmark always lands at the top of the home page: on the home page itself the link is a
  // no-op, and arriving from another page Next may only scroll the page segment (below the header) into view.
  const toTop = useRef(false);
  useEffect(() => {
    if (pathname === "/" && toTop.current) window.scrollTo({ top: 0, behavior: "instant" });
    toTop.current = false;
  }, [pathname]);
  const goHome = () => {
    setMenuOpen(false);
    if (pathname === "/") window.scrollTo({ top: 0 });
    else toTop.current = true;
  };

  const light = overlay;

  return (
    <>
      {/* Bar: wordmark, key links, WhatsApp and language
          on desktop; WhatsApp + hamburger on smaller screens. Transparent over the home hero,
          solid elsewhere, one surface with the page until it scrolls (then a hairline, see
          `header-rule`). No colour transitions: the header persists across navigations, so a
          fade would show the previous page's colours for a moment. */}
      <header
        className={clsx(
          "top-0 z-40 h-[var(--header-h)]",
          overlay ? "relative" : "sticky",
          light ? "on-dark text-paper" : "header-rule bg-paper text-ink",
        )}
      >
        <div className="container-page flex h-full flex-col">
          {/* Three columns from lg: logo | guest links centred on the page | owners and utilities. */}
          <div className="flex flex-1 items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]">
            <Link href="/" onClick={goHome} aria-label={t("nav.home")} className="shrink-0 justify-self-start">
              <Wordmark />
            </Link>
            {/* Desktop: the guest links, always visible. */}
            <nav aria-label={t("nav.label")} className="hidden lg:block">
              <ul className="flex items-center gap-10">
                {headerNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className={clsx(
                        "label transition-opacity aria-[current=page]:underline aria-[current=page]:underline-offset-[6px]",
                        "block py-2 hover:opacity-70",
                      )}
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-3 justify-self-end sm:gap-5">
              {/* Owners: a separate audience, so it sits with the utilities on the right (same style as the links). */}
              <Link
                href={ownersNav.href}
                aria-current={pathname === ownersNav.href ? "page" : undefined}
                className="label hidden py-2 transition-opacity hover:opacity-70 aria-[current=page]:underline aria-[current=page]:underline-offset-[6px] lg:block"
              >
                {t(`nav.${ownersNav.key}`)}
              </Link>
              <span aria-hidden className="hidden h-5 w-px bg-current opacity-30 lg:block" />
              {/* WhatsApp concierge: icon only (named for screen readers). */}
              <WhatsAppLink
                message={t("whatsapp.messageGeneric")}
                page={pathname}
                icon={false}
                className="flex h-11 items-center gap-2 px-1 transition-opacity hover:opacity-70"
              >
                <Icon name="whatsapp" size={24} strokeWidth={1.4} />
                <span className="sr-only">{t("whatsapp.cta")}</span>
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
              <Link href="/" onClick={goHome} aria-label={t("nav.home")}>
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
              on the right, laid out like the footer's. Sized to sit calmly on a desktop screen. */}
          <div className="container-page grid flex-1 content-start gap-14 py-10 lg:grid-cols-12 lg:gap-10 lg:py-16">
            <nav aria-label={t("nav.label")} className="lg:col-span-7">
              <ul className="border-b border-paper/25">
                {menuNav.map((item) => (
                  <li key={item.href} className="border-t border-paper/25">
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className="group flex items-center justify-between gap-6 py-4 text-[clamp(1.75rem,1.2rem+1.8vw,2.75rem)] leading-tight font-semibold tracking-[-0.02em] lg:py-5"
                    >
                      <span className="transition-colors group-hover:text-pop group-aria-[current=page]:opacity-60">
                        {t(`nav.${item.key}`)}
                      </span>
                      <Icon name="arrowRight" size={32} strokeWidth={1.75} className="shrink-0 transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)] group-hover:translate-x-2" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact as in the footer: the same column, line grid and bottom row (social + language). */}
            <div className="lg:col-span-4 lg:col-start-9">
              <h2 className="label mb-4 text-paper/60">{t("footer.contact")}</h2>
              <ContactDetails page={pathname} />
              <div className="mt-10 flex items-center gap-x-6 border-t border-paper/25 pt-6 text-[0.8125rem]">
                <SocialLinks />
                <LanguageSwitcher tone="light" className="text-paper" />
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
        strokeWidth="2"
        className="origin-right scale-x-[0.55] transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)] group-hover:scale-x-100"
      />
      <line x1="0" y1="13" x2="36" y2="13" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
