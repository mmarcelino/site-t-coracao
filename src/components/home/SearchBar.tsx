"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";
import { useRouter } from "@/i18n/navigation";
import { track } from "@/lib/analytics";
import { localDateToISO } from "@/lib/dates";
import { useFormat } from "@/lib/format";
import { DateRangeCalendar } from "@/components/booking/DateRangeCalendar";
import { GuestsStepper } from "@/components/booking/GuestsStepper";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/** Hero search: dates + guests → apartments list. The one primary action on the home page. */
export function SearchBar({
  maxGuests,
  calendarPlacement = "bottom",
}: {
  maxGuests: number;
  /** "top" when the bar sits at the bottom of a clipped area (the hero). */
  calendarPlacement?: "top" | "bottom";
}) {
  const t = useTranslations("search");
  const format = useFormat();
  const router = useRouter();
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);
  const [cot, setCot] = useState(false);
  const [open, setOpen] = useState(false);
  const [months, setMonths] = useState<1 | 2>(1);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setMonths(mq.matches ? 2 : 1);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (wrapper.current && !wrapper.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const dateLabel = (d?: Date) => (d ? format.dateTime(d, { weekday: "short", day: "numeric", month: "short" }) : t("choose"));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const checkIn = range?.from ? localDateToISO(range.from) : undefined;
    const checkOut = range?.to ? localDateToISO(range.to) : undefined;
    track("search_submitted", { checkIn, checkOut, guests, cot });
    router.push({
      pathname: "/apartments",
      query: {
        ...(checkIn && checkOut ? { checkIn, checkOut } : {}),
        guests: String(guests),
        ...(cot ? { cot: "1" } : {}),
      },
    });
  }

  // Fields are exactly the button's height on desktop, so the pill's 8px padding reads as an
  // even inset all the way round the button.
  const field = "flex min-h-14 w-full flex-col justify-center px-5 py-2.5 text-left md:h-14 md:py-0";
  const fieldLabel = "block text-[0.75rem] leading-tight text-paper/80";
  const fieldValue = "mt-1 block text-[0.9375rem] leading-tight font-medium text-paper";

  return (
    <form
      role="search"
      aria-label={t("label")}
      onSubmit={submit}
      className="relative w-full"
      data-testid="hero-search"
    >
      {/* Glass pill. The tint is dark enough that white text stays legible over the photo and,
          once the hero shrinks, over the light wash behind it. */}
      <div
        ref={wrapper}
        className="on-dark grid grid-cols-1 rounded-[1.75rem] border border-white/30 hero-glass p-2 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] backdrop-blur-xl md:grid-cols-[1fr_1fr_1.25fr_auto_auto] md:items-stretch md:rounded-full md:pl-2"
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="search-calendar"
          className={field}
        >
          <span className={fieldLabel}>{t("arrive")}</span>
          <span className={fieldValue}>{dateLabel(range?.from)}</span>
        </button>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="search-calendar"
          className={clsx(field, "border-t border-white/20 md:border-t-0 md:border-l")}
        >
          <span className={fieldLabel}>{t("depart")}</span>
          <span className={fieldValue}>{dateLabel(range?.to)}</span>
        </button>
        <div className={clsx(field, "border-t border-white/20 md:border-t-0 md:border-l")}>
          <span className={fieldLabel}>{t("guests")}</span>
          <div className="mt-0.5 text-[0.9375rem] font-medium text-paper">
            <GuestsStepper value={guests} onChange={setGuests} max={maxGuests} tone="light" compact />
          </div>
        </div>
        {/* Cot on request: a switch, so it's one tap and obviously on/off. */}
        <button
          type="button"
          role="switch"
          aria-checked={cot}
          onClick={() => setCot((v) => !v)}
          className={clsx(field, "border-t border-white/20 md:w-auto md:border-t-0 md:border-l")}
        >
          <span className={fieldLabel}>{t("cot")}</span>
          <span className={clsx(fieldValue, "flex items-center gap-2")}>
            <span
              aria-hidden
              className={clsx(
                "relative h-5 w-9 rounded-full border transition-colors duration-[var(--duration-fast)]",
                cot ? "border-paper bg-paper" : "border-white/50 bg-transparent",
              )}
            >
              <span
                className={clsx(
                  "absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full transition-[left,background-color] duration-[var(--duration-fast)]",
                  cot ? "left-[1.1rem] bg-ink" : "left-[0.15rem] bg-paper",
                )}
              />
            </span>
            {cot ? t("cotYes") : t("cotNo")}
          </span>
        </button>
        <button
          type="submit"
          className="mt-2 inline-flex h-14 items-center justify-center gap-3 rounded-full bg-paper px-7 text-[0.9375rem] font-semibold whitespace-nowrap text-ink transition-colors hover:bg-wash md:mt-0 md:ml-2"
        >
          {t("submit")}
          <Icon name="arrowRight" size={18} />
        </button>

        {open ? (
          <div
            id="search-calendar"
            role="group"
            aria-label={t("calendarLabel")}
            className={clsx(
              "animate-fade-in-fast absolute left-0 z-30 rounded-[var(--radius-card)] bg-white p-4 text-ink shadow-2xl md:p-6",
              calendarPlacement === "top" ? "bottom-full mb-3" : "top-full mt-3",
            )}
          >
            <DateRangeCalendar selected={range} onSelect={setRange} months={months} />
            <div className="mt-2 flex items-center justify-between border-t border-ink/10 pt-4">
              <button type="button" onClick={() => setRange(undefined)} className="link-quiet text-small">
                {t("clearDates")}
              </button>
              <button type="button" onClick={() => setOpen(false)} className={buttonClasses("secondary", "sm")}>
                {t("done")}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </form>
  );
}
