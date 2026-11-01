"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useFormat } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";
import { Wordmark } from "@/components/layout/Wordmark";
import { SearchBar } from "./SearchBar";
import { useSearchState } from "./SearchState";

/** Asks the header to open its menu (the docked bar has no nav of its own). */
export const OPEN_MENU_EVENT = "tc:open-menu";

/**
 * Keeps booking in reach once the hero's bar has scrolled away (the header itself isn't sticky).
 * Desktop: a slim bar docked at the top with the wordmark, the booking bar and the menu.
 * Phones: a compact button at the bottom that opens the booking form as a sheet.
 */
export function DockedSearch({ maxGuests }: { maxGuests: number }) {
  const t = useTranslations();
  const format = useFormat();
  const { range, guests } = useSearchState();
  const [shown, setShown] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);

  // Shown once the hero's bar is fully above the viewport.
  useEffect(() => {
    const target = document.querySelector('[data-testid="hero-search"]');
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry) setShown(!entry.isIntersecting && entry.boundingClientRect.bottom < 0);
    });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!sheetOpen) return;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheetOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen]);

  const dates =
    range?.from && range.to ? `${format.dayMonth(range.from)} – ${format.dayMonth(range.to)}` : t("search.addDates");

  return (
    <>
      {/* Desktop: docked at the top. */}
      <div
        inert={!shown}
        className={clsx(
          "fixed inset-x-0 top-0 z-40 hidden bg-paper transition-transform duration-[var(--duration-base)] ease-[var(--ease-soft)] md:block",
          shown ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <div className="container-page flex h-20 items-center justify-between gap-6">
          <Link href="/" aria-label={t("nav.home")} className="shrink-0">
            <Wordmark />
          </Link>
          <div className="w-max">
            <SearchBar maxGuests={maxGuests} docked testId="docked-search" />
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_MENU_EVENT))}
            className="-mr-2 grid size-11 place-items-center"
          >
            <Icon name="menu" size={24} />
            <span className="sr-only">{t("nav.openMenu")}</span>
          </button>
        </div>
      </div>

      {/* Phones: a compact button at the bottom. */}
      <div
        inert={!shown}
        className={clsx(
          "fixed inset-x-3 bottom-3 z-40 transition-[transform,opacity] duration-[var(--duration-base)] ease-[var(--ease-soft)] md:hidden",
          shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <div className="flex items-center gap-2 rounded-full bg-ink p-1.5 pl-5 text-paper shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)]">
          <button type="button" onClick={() => setSheetOpen(true)} className="flex min-h-11 flex-1 items-center gap-3 text-left">
            <Icon name="search" size={18} strokeWidth={1.75} />
            <span className="text-[0.9375rem] font-semibold">
              {dates} · {t("common.guests", { count: guests })}
            </span>
          </button>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_MENU_EVENT))}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-paper/10"
          >
            <Icon name="menu" size={20} />
            <span className="sr-only">{t("nav.openMenu")}</span>
          </button>
        </div>
      </div>

      {sheetOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("search.label")}
          className="animate-fade-in-fast fixed inset-0 z-50 flex items-end bg-ink/40 md:hidden"
          onClick={(e) => e.target === e.currentTarget && setSheetOpen(false)}
        >
          <div className="max-h-[92svh] w-full overflow-y-auto rounded-t-[var(--radius-card)] bg-paper p-4 pb-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="label">{t("search.label")}</p>
              <button ref={closeButton} type="button" onClick={() => setSheetOpen(false)} className="-mr-2 grid size-11 place-items-center">
                <Icon name="close" size={22} />
                <span className="sr-only">{t("common.close")}</span>
              </button>
            </div>
            <div className="rounded-[1.75rem] border border-ink/15">
              <SearchBar maxGuests={maxGuests} testId="sheet-search" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
