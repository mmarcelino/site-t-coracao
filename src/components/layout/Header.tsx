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
      {/* Floating pill: frosted over the hero, white with a soft shadow once the page scrolls.
          The strip around the pill is click-through. */}
      <header className="pointer-events-none sticky top-0 z-40 h-[var(--header-h)]">
        <div className="container-page pt-3">
          <div
            className={clsx(
              "pointer-events-auto flex h-14 items-center justify-between gap-4 rounded-full pr-2 pl-5 ring-1 backdrop-blur-xl transition-[background-color,color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-soft)] lg:pl-6",
              light
                ? "on-dark bg-ink/25 text-paper ring-white/20"
                : "bg-white/85 text-ink shadow-[0_12px_32px_-14px_rgba(27,26,24,0.28)] ring-ink/[0.06]",
            )}
          >
            <Link href="/" aria-label={t("nav.home")} className="shrink-0">
              <Wordmark />
            </Link>

            <nav aria-label={t("nav.label")} className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className={clsx(
                        "block rounded-full px-4 py-2 text-[0.9375rem] font-semibold tracking-[-0.01em] transition-colors",
                        light
                          ? "hover:bg-white/15 aria-[current=page]:bg-white aria-[current=page]:text-ink"
                          : "hover:bg-ink/[0.06] aria-[current=page]:bg-ink aria-[current=page]:text-paper",
                      )}
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <LanguageSwitcher tone={light ? "light" : "dark"} />
              </div>
              <WhatsAppLink
                message={t("whatsapp.messageGeneric")}
                page={pathname}
                icon={false}
                className={clsx(
                  "hidden size-10 place-items-center rounded-full transition-colors md:grid",
                  light ? "bg-white/15 hover:bg-white/25" : "bg-ink/[0.06] hover:bg-ink/10",
                )}
              >
                <Icon name="whatsapp" size={20} />
                <span className="sr-only">{t("whatsapp.cta")}</span>
              </WhatsAppLink>
              <div className="hidden sm:block">
                <Link href="/apartments" className={buttonClasses(light ? "light" : "primary", "sm")}>
                  {t("common.bookNow")}
                </Link>
              </div>
              <button
                ref={menuButton}
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className={clsx(
                  "grid size-10 place-items-center rounded-full lg:hidden",
                  light ? "bg-white/15" : "bg-ink/[0.06]",
                )}
              >
                <Icon name="menu" size={22} />
                <span className="sr-only">{t("nav.openMenu")}</span>
              </button>
            </div>
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
                  <Link href={item.href} className="text-h1 block py-1.5 font-semibold">
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
