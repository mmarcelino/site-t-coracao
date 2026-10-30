"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Wordmark } from "./Wordmark";
import { headerNav, primaryNav } from "./navItems";

/**
 * Sticky header. Over the home hero it starts transparent with light text and turns solid
 * once the page scrolls; everywhere else it is solid. Mobile gets a full-screen menu.
 */
export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const overlay = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

  const light = overlay && !scrolled;

  return (
    <>
      {/* Bar: wordmark, key links, WhatsApp and language
          on desktop; WhatsApp + hamburger on smaller screens. Transparent over the home hero,
          white once the page scrolls. */}
      <header
        className={clsx(
          "sticky top-0 z-40 h-[var(--header-h)] transition-[background-color,color] duration-[var(--duration-base)] ease-[var(--ease-soft)]",
          light ? "on-dark text-paper" : "bg-paper/95 text-ink backdrop-blur-md",
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
          <div aria-hidden className={clsx("h-[2px]", light ? "bg-paper" : "bg-ink/15")} />
        </div>
      </header>

      {menuOpen ? (
        <div
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.label")}
          className="on-dark animate-fade-in-fast fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink text-paper lg:hidden"
        >
          <div className="container-page flex h-[var(--header-h)] shrink-0 flex-col">
            <div className="flex flex-1 items-center justify-between">
              <Wordmark />
              <button
                ref={closeButton}
                type="button"
                onClick={() => setMenuOpen(false)}
                className="-mr-2 flex h-11 items-center gap-3 px-2"
              >
                <span className="label hidden sm:inline">{t("common.close")}</span>
                <Icon name="close" size={28} strokeWidth={1} />
                <span className="sr-only">{t("nav.closeMenu")}</span>
              </button>
            </div>
          </div>

          <div className="container-page grid flex-1 gap-12 py-10 lg:grid-cols-12 lg:py-16">
            <nav aria-label={t("nav.label")} className="lg:col-span-8">
              <ul>
                {[{ href: "/" as const, key: "homeShort" as const }, ...primaryNav].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className="text-display block py-1 font-light uppercase transition-opacity hover:opacity-60 aria-[current=page]:opacity-50"
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-col justify-end gap-8 lg:col-span-4">
              <div>
                <WhatsAppLink message={t("whatsapp.messageGeneric")} page={pathname} className="inline-flex text-lead">
                  {t("whatsapp.cta")}
                </WhatsAppLink>
                <p className="text-small mt-2 text-granite-light">{t("whatsapp.hours")}</p>
              </div>
              <div className="flex items-center justify-between gap-6 border-t border-paper/20 pt-6">
                <LanguageSwitcher tone="light" />
                <Link href="/apartments" className={buttonClasses("light")}>
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
