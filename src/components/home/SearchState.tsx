"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { DateRange } from "react-day-picker";
import { isoToLocalDate } from "@/lib/dates";

interface SearchState {
  range: DateRange | undefined;
  setRange: (range: DateRange | undefined) => void;
  guests: number;
  setGuests: (guests: number) => void;
}

const SearchContext = createContext<SearchState | null>(null);

/**
 * Shares dates and guests between the hero's booking bar and its docked copy. On the apartments
 * page it starts from the search in the URL (ISO dates).
 */
export function SearchStateProvider({
  children,
  initial,
}: {
  children: ReactNode;
  initial?: { checkIn?: string; checkOut?: string; guests?: number };
}) {
  const [range, setRange] = useState<DateRange | undefined>(() =>
    initial?.checkIn && initial.checkOut ? { from: isoToLocalDate(initial.checkIn), to: isoToLocalDate(initial.checkOut) } : undefined,
  );
  const [guests, setGuests] = useState(initial?.guests ?? 2);
  return <SearchContext.Provider value={{ range, setRange, guests, setGuests }}>{children}</SearchContext.Provider>;
}

/** The shared state inside a provider; a bar on its own keeps local state. */
export function useSearchState(): SearchState {
  const shared = useContext(SearchContext);
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);
  return shared ?? { range, setRange, guests, setGuests };
}
