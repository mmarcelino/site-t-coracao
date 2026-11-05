"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * A review quote that never breaks the grid: long ones are cut at four lines and open in place.
 * Short ones show whole, with no control. The control is a small grey arrow that never takes a line
 * of its own: ↓ over the end of the cut line, ↑ at the right end of the last line once open (the same
 * arrows as "Show more reviews"); its label ("Read more" / "Show less") is for screen readers.
 */
export function ReviewQuote({
  text,
  lang,
  moreLabel,
  lessLabel,
}: {
  text: string;
  lang: string;
  moreLabel: string;
  lessLabel: string;
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

  const arrow = (label: string) => (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      aria-label={label}
      title={label}
      // Lighter than granite, still AA on white (ink at 60% ≈ #767574, 4.6:1).
      className="align-[-0.15em] text-ink/60 transition-colors hover:text-ink"
    >
      <Icon name={open ? "arrowUp" : "arrowDown"} size={18} strokeWidth={1.75} />
    </button>
  );

  return (
    <div className="relative text-body">
      <blockquote ref={ref} lang={lang} className={clsx(!open && "line-clamp-4")}>
        “{text}”
        {/* Floats to the right end of the last line, or onto its own line only if there's no room. */}
        {open ? <span className="float-right ml-4">{arrow(lessLabel)}</span> : null}
      </blockquote>
      {!open && clamped ? (
        // Sits on the last visible line, its gradient fading out the cut words underneath.
        <span className="absolute right-0 bottom-0 bg-[linear-gradient(to_right,transparent,var(--color-paper)_2.5rem)] pl-12">
          {arrow(moreLabel)}
        </span>
      ) : null}
    </div>
  );
}
