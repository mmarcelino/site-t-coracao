/**
 * Seasonal direct-booking code, announced in the strip above the header (PromoStrip).
 * Set to `null` to hide the strip. Copy lives in messages (`promo.*`).
 * TO CONFIRM: code, rate and end date with the client before launch.
 */
export interface Promo {
  code: string;
  /** Last day the code is valid (ISO date). Not checked at render (pages are static): set `promo` to null when it ends. */
  endsOn: string;
}

export const promo: Promo | null = { code: "TRIPASAUTUMN", endsOn: "2026-12-31" };
