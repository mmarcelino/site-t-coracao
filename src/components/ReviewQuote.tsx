"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

/**
 * A review quote that never breaks the grid: long ones are cut at five lines with a "Read more"
 * that opens the rest in place. Short ones show whole, with no button. The toggle never takes a
 * line of its own: small and grey at the right end of the last line (over the cut line's end
 * while closed, floated after the closing quote once open).
 */
export function ReviewQuote({
  text,
  lang,
  moreLabel,
  lessLabel,
  size = "lg",
}: {
  text: string;
  lang: string;
  moreLabel: string;
  lessLabel: string;
  /** lg: the home page's big quotes; md: body size (apartment pages). */
  size?: "lg" | "md";
}) {
  const ref = useRef<HTMLQuoteElement>(null);
  const [open, setOpen] = useState(false);
  const [clamped, setClamped] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setClamped(el.scrollHeight > el.clientHeight + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const type = size === "lg" ? "text-[1.25rem] leading-[1.5]" : "text-body";
  const toggle = (label: string, className?: string) => (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      className={clsx(
        // Lighter than granite, still AA for small text on white (ink at 60% ≈ #767574, 4.6:1).
        "text-small text-ink/60 underline underline-offset-4 transition-colors hover:text-ink",
        className,
      )}
    >
      {label}
    </button>
  );

  return (
    <div className={clsx("relative", type)}>
      <blockquote ref={ref} lang={lang} className={clsx(!open && "line-clamp-5")}>
        “{text}”
        {/* Floats to the right end of the last line, or onto its own line only if there's no room;
            the wrapper keeps the quote's line height so the small text shares its baseline. */}
        {open ? <span className="float-right ml-4">{toggle(lessLabel)}</span> : null}
      </blockquote>
      {!open && clamped ? (
        // Sits on the last visible line, its gradient fading out the cut words underneath.
        <span className="absolute right-0 bottom-0 bg-[linear-gradient(to_right,transparent,var(--color-paper)_2.5rem)] pl-12">
          {toggle(moreLabel)}
        </span>
      ) : null}
    </div>
  );
}
