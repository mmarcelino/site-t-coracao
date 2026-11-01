"use client";

import clsx from "clsx";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { mapBounds, river, sea } from "@/content/portoMap";

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  count: number;
  /** e.g. "Ribeira, 3 homes" (button name). */
  label: string;
}

// 1 unit of longitude is shorter than 1 of latitude here (cos 41°), so x is scaled to keep shapes true.
const W = 1400;
const kx = Math.cos((41.145 * Math.PI) / 180);
const H = Math.round((W * (mapBounds.north - mapBounds.south)) / ((mapBounds.east - mapBounds.west) * kx));
const x = (lng: number) => ((lng - mapBounds.west) / (mapBounds.east - mapBounds.west)) * W;
const y = (lat: number) => ((mapBounds.north - lat) / (mapBounds.north - mapBounds.south)) * H;
const path = (pts: Array<[number, number]>) => `M${pts.map(([lng, lat]) => `${x(lng).toFixed(1)},${y(lat).toFixed(1)}`).join("L")}Z`;

/**
 * The illustrated Porto map with one numbered pin per building; choosing a pin shows that
 * building's homes below. Phones scroll the map sideways (opened on the city centre).
 */
export function MapView({
  pins,
  labels,
  panels,
  ariaLabel,
  hint,
  scale,
}: {
  pins: MapPin[];
  labels: Array<{ text: string; lng: number; lat: number; kind: "area" | "water" | "city" }>;
  panels: Record<string, ReactNode>;
  ariaLabel: string;
  hint: string;
  scale: string;
}) {
  const [selected, setSelected] = useState(pins[0]?.id);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Open on the city centre (where most homes are) when the map is wider than the screen.
    const el = scroller.current;
    if (!el) return;
    const centre = x(-8.6145) / W;
    const fit = () => {
      if (el.scrollWidth > el.clientWidth) el.scrollLeft = el.scrollWidth * centre - el.clientWidth / 2;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const kmPx = (1 / (111.32 * kx * (mapBounds.east - mapBounds.west))) * W;

  return (
    <div>
      <div ref={scroller} className="scrollbar-none overflow-x-auto rounded-[var(--radius-card)] bg-[#f4f1ec]">
        <div className="relative min-w-[56rem]" style={{ aspectRatio: `${W} / ${H}` }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" role="img" aria-label={ariaLabel}>
            <path d={path(sea)} fill="var(--color-azulejo-tint)" />
            <path d={path(river)} fill="var(--color-azulejo-tint)" />
            {labels.map((l) => (
              <text
                key={l.text}
                x={x(l.lng)}
                y={y(l.lat)}
                textAnchor="middle"
                className={clsx(
                  "fill-current uppercase",
                  l.kind === "water" ? "text-azulejo/60 italic" : l.kind === "city" ? "text-granite/60" : "text-granite",
                )}
                style={{ fontSize: l.kind === "area" ? 13 : 14, letterSpacing: "0.12em" }}
              >
                {l.text}
              </text>
            ))}
            {/* Scale bar */}
            <g transform={`translate(${W - kmPx - 40} ${H - 34})`} className="text-granite">
              <line x1="0" x2={kmPx} y1="0" y2="0" stroke="currentColor" strokeWidth="2" />
              <line x1="0" x2="0" y1="-5" y2="5" stroke="currentColor" strokeWidth="2" />
              <line x1={kmPx} x2={kmPx} y1="-5" y2="5" stroke="currentColor" strokeWidth="2" />
              <text x={kmPx / 2} y="-10" textAnchor="middle" className="fill-current" style={{ fontSize: 12 }}>
                {scale}
              </text>
            </g>
          </svg>
          {pins.map((pin) => {
            const active = pin.id === selected;
            return (
              <button
                key={pin.id}
                type="button"
                onClick={() => setSelected(pin.id)}
                aria-pressed={active}
                aria-label={pin.label}
                className={clsx(
                  "absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-ink text-[0.9375rem] font-semibold tabular-nums shadow-[0_6px_16px_-8px_rgba(27,26,24,0.5)] transition-[transform,background-color,color] duration-[var(--duration-base)] ease-[var(--ease-soft)] hover:scale-110",
                  active ? "z-10 scale-110 bg-ink text-paper" : "bg-paper text-ink",
                )}
                style={{ left: `${(x(pin.lng) / W) * 100}%`, top: `${(y(pin.lat) / H) * 100}%` }}
              >
                {pin.count}
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-3 text-small text-granite">{hint}</p>
      <div aria-live="polite" className="mt-8">
        {selected ? panels[selected] : null}
      </div>
    </div>
  );
}
