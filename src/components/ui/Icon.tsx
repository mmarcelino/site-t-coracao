import type { SVGProps } from "react";

/**
 * Minimal line icons (1.25px stroke) drawn for this site, so no icon library is needed.
 * Decorative by default (aria-hidden); pass `title` for a meaningful standalone icon.
 */
const paths = {
  arrowRight: <path d="M4 12h15m-5-6 6 6-6 6" />,
  arrowLeft: <path d="M20 12H5m5-6-6 6 6 6" />,
  arrowUpRight: <path d="M7 17 17 7M8 7h9v9" />,
  chevronLeft: <path d="m15 5-7 7 7 7" />,
  chevronRight: <path d="m9 5 7 7-7 7" />,
  chevronDown: <path d="m5 9 7 7 7-7" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 8h16M4 16h16" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  pause: <path d="M9 6v12M15 6v12" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </>
  ),
  play: <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  guests: (
    <>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M3 19.5c.6-3.4 3-5.5 6-5.5s5.4 2.1 6 5.5" />
      <path d="M15.5 4.9a3.25 3.25 0 0 1 0 6.2M18 14.4c1.6.8 2.7 2.6 3 5.1" />
    </>
  ),
  bed: (
    <>
      <path d="M3 18.5V6.5M3 14h18v4.5M21 14v-2.5a3 3 0 0 0-3-3h-7.5V14" />
      <circle cx="7" cy="11" r="1.75" />
    </>
  ),
  bath: (
    <>
      <path d="M3.5 12h17v2.5a5 5 0 0 1-5 5h-7a5 5 0 0 1-5-5V12Z" />
      <path d="M6 12V6a2 2 0 0 1 3.7-1.1M7 19.5l-1 1.5M17 19.5l1 1.5" />
    </>
  ),
  area: <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />,
  stairs: <path d="M3.5 20.5h5v-5h4.5v-5h4.5v-5h3" />,
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.25" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="1.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </>
  ),
  shield: <path d="M12 3.5 19.5 6v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6L12 3.5Z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  phone: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2" />
      <path d="M10.5 18.5h3" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 8.5-8.5M16.5 6.5l2 2M14 9l1.5 1.5" />
    </>
  ),
  star: <path d="m12 3.8 2.5 5.2 5.7.8-4.1 4 1 5.6L12 16.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8L12 3.8Z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.3 2.4 3.5 5.2 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.2-3.5-8.5s1.2-6.1 3.5-8.5Z" />
    </>
  ),
  gift: (
    <>
      <rect x="4" y="9" width="16" height="11.5" rx="1" />
      <path d="M3 9h18M12 9v11.5M12 9c-1.5-3.5-5.5-4-5.5-1.5S10 9 12 9Zm0 0c1.5-3.5 5.5-4 5.5-1.5S14 9 12 9Z" />
    </>
  ),
  tag: (
    <>
      <path d="M3.5 12.3V4.5a1 1 0 0 1 1-1h7.8l8.2 8.2-8.8 8.8-8.2-8.2Z" />
      <circle cx="8" cy="8" r="1.5" />
    </>
  ),
  refresh: <path d="M19.5 8A8 8 0 0 0 5 7.5M4.5 4v3.5H8M4.5 16a8 8 0 0 0 14.5.5M19.5 20v-3.5H16" />,
  grid: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="0.5" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="0.5" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="0.5" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="0.5" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.75" />
      <circle cx="17.25" cy="6.75" r="0.6" fill="currentColor" />
    </>
  ),
  facebook: <path d="M14.5 8.5H16V5h-2a4 4 0 0 0-4 4v2H8v3.5h2V21h3.5v-6.5h2.25L16 11h-2.5V9.5a1 1 0 0 1 1-1Z" />,
  /** WhatsApp glyph drawn as an outline so it sits with the rest of the set (no green bubble). */
  whatsapp: (
    <>
      <path d="M4.2 19.8 5.3 16A8.5 8.5 0 1 1 8.4 19l-4.2.8Z" />
      <path d="M9 8.6c.2-.4.6-.5 1-.4l.6 1.5c.1.3 0 .5-.2.7l-.4.4c.5 1.1 1.4 2 2.5 2.5l.4-.4c.2-.2.4-.3.7-.2l1.5.6c.2.4 0 .9-.4 1.1-.8.5-1.8.5-2.9-.1a7.6 7.6 0 0 1-3.3-3.3c-.6-1-.6-2-.1-2.9Z" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;

export function Icon({
  name,
  size = 20,
  title,
  ...props
}: { name: IconName; size?: number; title?: string } & Omit<SVGProps<SVGSVGElement>, "name">) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
}
