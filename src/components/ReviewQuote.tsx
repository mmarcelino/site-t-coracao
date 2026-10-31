"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

/**
 * A review quote that never breaks the grid: long ones are cut at five lines with a "Read more"
 * that opens the rest in place. Short ones show whole, with no button.
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

  return (
    <>
      <blockquote
        ref={ref}
        lang={lang}
        className={clsx("text-[1.1875rem] leading-[1.5] font-medium", !open && "line-clamp-5")}
      >
        “{text}”
      </blockquote>
      {clamped || open ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-2 text-small underline underline-offset-4 hover:no-underline"
        >
          {open ? lessLabel : moreLabel}
        </button>
      ) : null}
    </>
  );
}
