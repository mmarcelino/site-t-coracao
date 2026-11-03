"use client";

import clsx from "clsx";
import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Link } from "@/i18n/navigation";

export interface BuildingOption {
  /** null = all buildings. */
  id: string | null;
  label: string;
  /** Street + neighbourhood: guests know where, not what the building is called. */
  detail?: string;
  count: number;
  query: Record<string, string>;
}

/**
 * Building filter on the apartments page: a pill that opens a short list of links (one per
 * building), so each filtered view keeps its own URL. Closes on choice, Escape or outside click.
 */
export function BuildingFilter({
  options,
  activeId,
  label,
  buttonLabel,
}: {
  options: BuildingOption[];
  activeId: string | null;
  /** Accessible name of the menu, e.g. "Building". */
  label: string;
  /** Visible text on the pill: "Building" or the chosen building's name. */
  buttonLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = activeId !== null;

  // Below sm the menu spans the filter row (its parent is relative), so it never leaves the screen.
  return (
    <div ref={root} className="shrink-0 sm:relative">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={active ? `${label}: ${buttonLabel}` : undefined}
        onClick={() => setOpen((o) => !o)}
        data-testid="building-filter"
        className={clsx(
          "inline-flex h-10 max-w-[11rem] items-center gap-2 rounded-full border px-4 text-[0.9375rem] font-semibold whitespace-nowrap transition-colors sm:max-w-none",
          active ? "border-ink bg-ink text-paper" : "border-ink/20 hover:border-ink",
        )}
      >
        <span className="truncate">{buttonLabel}</span>
        <svg aria-hidden viewBox="0 0 24 24" className={clsx("size-4 shrink-0 transition-transform", open && "rotate-180")} fill="none" stroke="currentColor" strokeWidth={1.75}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <ul
          id={listId}
          aria-label={label}
          className="animate-fade-in-fast absolute inset-x-0 top-full z-20 mt-2 sm:left-auto sm:w-80 rounded-[var(--radius-tile)] border border-ink/10 bg-paper p-2 shadow-[0_12px_40px_-12px_rgb(27_26_24/0.25)]"
        >
          {options.map((o) => {
            const current = o.id === activeId;
            return (
              <li key={o.id ?? "all"}>
                <Link
                  href={{ pathname: "/apartments", query: o.query }}
                  aria-current={current ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  scroll={false}
                  className={clsx(
                    "flex items-start gap-3 rounded-[calc(var(--radius-tile)-0.25rem)] px-3 py-2.5 transition-colors hover:bg-sand",
                    o.count === 0 && !current && "opacity-50",
                  )}
                >
                  <span className="mt-0.5 size-4 shrink-0">{current ? <Icon name="check" size={16} strokeWidth={2} /> : null}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{o.label}</span>
                    {o.detail ? <span className="block text-small text-granite">{o.detail}</span> : null}
                  </span>
                  <span className="text-small text-granite">{o.count}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
