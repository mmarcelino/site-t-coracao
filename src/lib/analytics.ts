/**
 * The only analytics entry point (CLAUDE.md §11). Components call `track()`; nothing else talks
 * to Clarity directly, so adding GA4/Plausible later is a change to this file only.
 *
 * - Events are sent only when Clarity is loaded, which only happens after analytics consent
 *   and when NEXT_PUBLIC_CLARITY_PROJECT_ID is set (see components/consent/ClarityLoader).
 * - In development, events are logged to the console instead.
 */

export type AnalyticsEvents = {
  search_submitted: { checkIn?: string; checkOut?: string; guests: number };
  listing_viewed: { listingId: string; buildingId: string };
  booking_widget_opened: { listingId: string };
  dates_selected: { listingId: string; checkIn: string; checkOut: string; nights: number };
  quote_viewed: { listingId: string; nights: number; guests: number; total: number };
  checkout_started: { listingId: string; nights: number; guests: number; total: number };
  booking_completed: { listingId: string; total: number; mock: true };
  whatsapp_clicked: { page: string; listingId?: string };
  owner_lead_submitted: Record<string, never>;
  experience_request_submitted: { experiences: number };
  language_switched: { from: string; to: string };
};

export type AnalyticsEvent = keyof AnalyticsEvents;

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[] };

declare global {
  interface Window {
    clarity?: ClarityFn;
  }
}

export const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "";
export const analyticsEnabled = clarityProjectId.trim().length > 0;

export function track<E extends AnalyticsEvent>(event: E, props: AnalyticsEvents[E]): void {
  if (typeof window === "undefined") return;

  if (process.env.NODE_ENV === "development") {
    console.info(`[analytics] ${event}`, props);
  }

  const clarity = window.clarity;
  if (!clarity) return;
  try {
    // Tags first so the event's session carries the context; values must be strings.
    for (const [key, value] of Object.entries(props)) {
      if (value !== undefined) clarity("set", `${event}.${key}`, String(value));
    }
    clarity("event", event);
  } catch {
    // Analytics must never break the page.
  }
}

/** Pass the visitor's consent decision to Clarity (Consent API v2). */
export function setAnalyticsConsent(granted: boolean): void {
  if (typeof window === "undefined" || !window.clarity) return;
  try {
    window.clarity("consentv2", {
      ad_Storage: "denied",
      analytics_Storage: granted ? "granted" : "denied",
    });
    // Withdrawn consent: erase Clarity cookies and stop the session.
    if (!granted) window.clarity("consent", false);
  } catch {
    // ignore
  }
}
