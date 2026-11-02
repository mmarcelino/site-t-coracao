"use client";

import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap, Marker } from "leaflet";
import { useEffect, useRef, useState, type ReactNode } from "react";

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  count: number;
  /** e.g. "Ribeira, 3 homes" (marker name for screen readers and keyboard users). */
  label: string;
}

// Development basemap: OpenStreetMap's standard tiles (no key; their tile policy is for light use),
// muted to greys in CSS (.tc-map). At launch, set a styled provider with a key (MapTiler/Mapbox)
// via NEXT_PUBLIC_MAP_TILES_URL and drop the filter.
const TILES = process.env.NEXT_PUBLIC_MAP_TILES_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION =
  process.env.NEXT_PUBLIC_MAP_TILES_ATTRIBUTION ||
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Pins in the branch's own palette on a pale map: white with an ink ring and number; the chosen one
// fills ink (with a white ring) and grows, the usual "selected" convention.
const pinHtml = (count: number, active: boolean) =>
  `<span class="grid size-11 place-items-center rounded-full border-2 text-[0.9375rem] font-semibold tabular-nums transition-transform ${
    active
      ? "scale-115 border-paper bg-ink text-paper shadow-[0_8px_20px_-6px_rgba(27,26,24,0.6)]"
      : "border-ink bg-paper text-ink shadow-[0_6px_18px_-6px_rgba(27,26,24,0.45)]"
  }">${count}</span>`;

/** Scroll the window to `to` with an ease-in-out curve; duration grows gently with distance. */
function glide(to: number) {
  const from = window.scrollY;
  const distance = to - from;
  if (Math.abs(distance) < 2) return;
  const duration = Math.min(1400, 700 + Math.abs(distance) * 0.4);
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    // "instant": the page sets scroll-behavior: smooth, which would fight each frame.
    window.scrollTo({ top: from + distance * ease(t), behavior: "instant" });
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/**
 * Street map (Leaflet) with one numbered pin per building; choosing a pin shows that building's
 * homes below. Leaflet is loaded in the browser only. Zoom with the buttons, a pinch or a double
 * click; the mouse wheel zooms only after clicking into the map (so the page scrolls normally).
 */
export function MapView({
  pins,
  panels,
  ariaLabel,
  hint,
}: {
  pins: MapPin[];
  panels: Record<string, ReactNode>;
  ariaLabel: string;
  hint: string;
}) {
  const [selected, setSelected] = useState(pins[0]?.id);
  const el = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Choosing a pin shows its homes and glides down to them: a slow ease-in-out (the browser's own
  // smooth scroll is quick and abrupt). Instant with reduced motion.
  const choose = (id: string) => {
    setSelected(id);
    requestAnimationFrame(() => {
      const target = panel.current;
      if (!target) return;
      const to = target.getBoundingClientRect().top + window.scrollY - 112;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return window.scrollTo({ top: to, behavior: "instant" });
      glide(to);
    });
  };
  const markers = useRef<Map<string, Marker>>(new Map());
  const pinsKey = pins.map((p) => `${p.id}:${p.count}`).join("|");

  useEffect(() => {
    let map: LeafletMap | undefined;
    let ro: ResizeObserver | undefined;
    let cancelled = false;
    void import("leaflet").then((L) => {
      if (cancelled || !el.current) return;
      map = L.map(el.current, { scrollWheelZoom: false, zoomControl: false, attributionControl: true, zoomSnap: 0.25 });
      L.control.zoom({ position: "bottomright" }).addTo(map);
      // Wheel zoom only once the visitor has clicked into the map, so page scrolling never gets stuck.
      const m = map;
      m.on("click focus", () => m.scrollWheelZoom.enable());
      el.current.addEventListener("mouseleave", () => m.scrollWheelZoom.disable());
      L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map);
      for (const pin of pins) {
        const marker = L.marker([pin.lat, pin.lng], {
          icon: L.divIcon({ html: pinHtml(pin.count, false), className: "", iconSize: [44, 44], iconAnchor: [22, 22] }),
          title: pin.label,
          alt: pin.label,
          keyboard: true,
          riseOnHover: true,
        })
          .on("click", () => choose(pin.id))
          .addTo(map);
        markers.current.set(pin.id, marker);
      }
      const fit = () => {
        if (!map || !pins.length || !el.current) return;
        map.invalidateSize();
        // Narrow screens: frame the main group (pins within 2 km of the middle) so city-centre pins
        // don't overlap; outliers such as Foz are a zoom-out away.
        let focus = pins;
        if (el.current.clientWidth < 640 && pins.length > 2) {
          const mid = (v: number[]) => [...v].sort((a, b) => a - b)[Math.floor(v.length / 2)] ?? 0;
          const c = { lat: mid(pins.map((p) => p.lat)), lng: mid(pins.map((p) => p.lng)) };
          const near = pins.filter((p) => map!.distance([p.lat, p.lng], [c.lat, c.lng]) < 2000);
          if (near.length) focus = near;
        }
        map.fitBounds(L.latLngBounds(focus.map((p) => [p.lat, p.lng])), { padding: [36, 36], maxZoom: 16 });
      };
      fit();
      // Keep every pin in view when the map changes size (rotation, window resize).
      ro = new ResizeObserver(fit);
      ro.observe(el.current);
    });
    const current = markers.current;
    return () => {
      cancelled = true;
      ro?.disconnect();
      current.clear();
      map?.remove();
    };
    // Rebuild only when the set of pins changes (pins is a fresh array on every render).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinsKey]);

  // Reflect the selection on the markers.
  useEffect(() => {
    void import("leaflet").then((L) => {
      for (const pin of pins) {
        const marker = markers.current.get(pin.id);
        if (!marker) continue;
        const active = pin.id === selected;
        marker.setIcon(L.divIcon({ html: pinHtml(pin.count, active), className: "", iconSize: [44, 44], iconAnchor: [22, 22] }));
        marker.setZIndexOffset(active ? 1000 : 0);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, pinsKey]);

  return (
    <div>
      <div
        ref={el}
        role="region"
        aria-label={ariaLabel}
        className="tc-map isolate h-[26rem] overflow-hidden rounded-[var(--radius-card)] bg-[#f4f1ec] md:h-[34rem]"
      />
      <p className="mt-3 text-small text-granite">{hint}</p>
      <div ref={panel} aria-live="polite" className="mt-8">
        {selected ? panels[selected] : null}
      </div>
    </div>
  );
}
