/**
 * The only entry point pages and components use for data (CLAUDE.md §6).
 * Never import from ./mock or raw content files in UI code.
 */
export { getListings, getListing, getListingBySlug, getListingSlugs } from "./listings";
export { getBuildings, getBuilding, getNeighbourhoods, getNeighbourhood } from "./places";
export { getQuote } from "./quote";
export { getAvailability, getBlockedNights } from "./availability";
export { getReviews, getReviewSummary } from "./reviews";
export type * from "./types";
