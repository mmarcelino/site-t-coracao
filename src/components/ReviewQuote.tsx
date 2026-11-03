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
  size = "lg",
  marks = true,
}: {
  text: string;
  lang: string;
  moreLabel: string;
  lessLabel: string;
  /** lg: the home page's big quotes; md: body size (apartment pages). */
  size?: "lg" | "md";
  /** Inline “ ” around the text; off when the layout sets its own big opening mark. */
  marks?: boolean;
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
        className={clsx(size === "lg" ? "text-[1.25rem] leading-[1.5]" : "text-body", !open && "line-clamp-5")}
      >
        {marks ? `“${text}”` : text}
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
