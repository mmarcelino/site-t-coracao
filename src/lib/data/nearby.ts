import { landmarks } from "@/content/landmarks";
import type { Locale, NearbyPlace } from "./types";

/** Walking estimate: straight line × a detour factor for streets, at an unhurried pace over hills. */
const DETOUR = 1.35;
const METRES_PER_MINUTE = 75;
const MAX_MINUTES = 25;

function metresBetween(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6_371_000 * Math.asin(Math.sqrt(h));
}

/**
 * The landmarks closest to a building (from its address), with walking minutes, nearest first.
 * Flats in the same building share an address, so the times are per building.
 */
export function getNearby(locale: Locale, from: { lat: number; lng: number }, count = 4): NearbyPlace[] {
  if (!from.lat || !from.lng) return [];
  return landmarks
    .map((l) => ({ name: l.name[locale], minutes: Math.max(1, Math.round((metresBetween(from, l) * DETOUR) / METRES_PER_MINUTE)) }))
    .filter((p) => p.minutes <= MAX_MINUTES)
    .sort((a, b) => a.minutes - b.minutes)
    .slice(0, count);
}
