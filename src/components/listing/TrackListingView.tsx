"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function TrackListingView({ listingId, buildingId }: { listingId: string; buildingId: string }) {
  useEffect(() => {
    track("listing_viewed", { listingId, buildingId });
  }, [listingId, buildingId]);
  return null;
}
