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
      <header
        className={clsx(
          "sticky top-0 z-40 h-[var(--header-h)] transition-[background-color,color,border-color] duration-[var(--duration-base)] ease-[var(--ease-soft)]",
          light
            ? "on-dark border-b border-transparent text-paper"
            : "border-b border-ink/10 bg-paper/95 text-ink backdrop-blur-md",
        )}
      >
        <div className="container-page flex h-full items-center justify-between gap-6">
          <Link href="/" aria-label={t("nav.home")} className="shrink-0">
            <Wordmark />
          </Link>

          <nav aria-label={t("nav.label")} className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="text-small py-2 opacity-90 transition-opacity hover:opacity-100 aria-[current=page]:underline aria-[current=page]:underline-offset-8"
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-5">
            <div className="hidden md:block">
              <WhatsAppLink
                message={t("whatsapp.messageGeneric")}
                page={pathname}
                className="text-small inline-flex py-2 opacity-90 transition-opacity hover:opacity-100"
              >
                <span className="hidden xl:inline">{t("whatsapp.cta")}</span>
                <span className="xl:hidden">{t("whatsapp.short")}</span>
              </WhatsAppLink>
            </div>
            <div className="hidden sm:block">
              <LanguageSwitcher tone={light ? "light" : "dark"} />
            </div>
            <div className="hidden sm:block">
              <Link href="/apartments" className={buttonClasses(light ? "outline-light" : "primary", "sm")}>
                {t("common.bookNow")}
              </Link>
            </div>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="-mr-2 p-2 lg:hidden"
            >
              <Icon name="menu" size={26} />
              <span className="sr-only">{t("nav.openMenu")}</span>
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.label")}
          className="on-dark animate-fade-in-fast fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink text-paper lg:hidden"
        >
          <div className="container-page flex h-[var(--header-h)] shrink-0 items-center justify-between">
            <Wordmark />
            <button ref={closeButton} type="button" onClick={() => setMenuOpen(false)} className="-mr-2 p-2">
              <Icon name="close" size={26} />
              <span className="sr-only">{t("nav.closeMenu")}</span>
            </button>
          </div>
          <nav aria-label={t("nav.label")} className="container-page flex-1 pt-10">
            <ul className="space-y-1">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-h2 block py-2">
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="container-page space-y-6 pt-10 pb-10">
            <WhatsAppLink message={t("whatsapp.messageGeneric")} page={pathname} className="inline-flex text-lead">
              {t("whatsapp.cta")}
            </WhatsAppLink>
            <p className="text-small text-granite-light">{t("whatsapp.hours")}</p>
            <div className="flex items-center justify-between border-t border-paper/15 pt-6">
              <LanguageSwitcher tone="light" />
              <Link href="/apartments" className={buttonClasses("light")}>
                {t("common.bookNow")}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
