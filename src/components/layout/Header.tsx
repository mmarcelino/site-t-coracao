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
import { primaryNav } from "./navItems";

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
      {/* Minimal bar: wordmark, hamburger, and a hairline rule below (elvara-style). Transparent
          over the home hero, white once the page scrolls. Everything else lives in the menu. */}
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
            <button
              ref={menuButton}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              className="group -mr-2 flex h-11 items-center gap-3 px-2"
            >
              <span className="label hidden sm:inline">{t("nav.menu")}</span>
              <Hamburger />
              <span className="sr-only">{t("nav.openMenu")}</span>
            </button>
          </div>
          <div aria-hidden className={clsx("h-px", light ? "bg-paper/70" : "bg-ink/15")} />
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
            <div aria-hidden className="h-px bg-paper/30" />
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

/** Two long hairlines (elvara-style) instead of the usual three-bar icon. */
function Hamburger() {
  return (
    <svg width="40" height="14" viewBox="0 0 40 14" aria-hidden focusable="false" className="overflow-visible">
      <line x1="0" y1="1" x2="40" y2="1" stroke="currentColor" strokeWidth="1.5" />
      <line
        x1="0"
        y1="13"
        x2="40"
        y2="13"
        stroke="currentColor"
        strokeWidth="1.5"
        className="origin-right transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)] group-hover:scale-x-75"
      />
    </svg>
  );
}
