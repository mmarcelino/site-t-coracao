"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { analyticsEnabled, clarityProjectId, setAnalyticsConsent } from "@/lib/analytics";

/**
 * Cookie consent (CLAUDE.md §11). The decision lives in a first-party cookie read on the client,
 * so pages stay static. Clarity is injected only after analytics consent AND when a project ID
 * is configured; withdrawing consent tells Clarity to erase its cookies.
 */
export type ConsentState = "unknown" | "granted" | "denied";

const COOKIE = "tc_consent";
const MAX_AGE = 60 * 60 * 24 * 180; // 6 months, then ask again

interface ConsentContextValue {
  consent: ConsentState;
  bannerOpen: boolean;
  accept: () => void;
  reject: () => void;
  openPreferences: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

function readCookie(): ConsentState {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=(granted|denied)`));
  return (match?.[1] as ConsentState | undefined) ?? "unknown";
}

function writeCookie(value: Exclude<ConsentState, "unknown">) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${value}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

function loadClarity(projectId: string) {
  if (window.clarity || document.getElementById("clarity-script")) return;
  const queue: ((...args: unknown[]) => void) & { q?: unknown[] } = (...args: unknown[]) => {
    (queue.q = queue.q ?? []).push(args);
  };
  window.clarity = queue;
  const script = document.createElement("script");
  script.id = "clarity-script";
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${encodeURIComponent(projectId)}`;
  document.head.appendChild(script);
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>("unknown");
  const [bannerOpen, setBannerOpen] = useState(false);

  useEffect(() => {
    const stored = readCookie();
    // Syncing from an external store (the cookie) on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(stored);
    setBannerOpen(stored === "unknown");
  }, []);

  useEffect(() => {
    if (consent === "granted" && analyticsEnabled) {
      loadClarity(clarityProjectId);
      setAnalyticsConsent(true);
    } else if (consent === "denied") {
      setAnalyticsConsent(false);
    }
  }, [consent]);

  const accept = useCallback(() => {
    writeCookie("granted");
    setConsent("granted");
    setBannerOpen(false);
  }, []);

  const reject = useCallback(() => {
    writeCookie("denied");
    setConsent("denied");
    setBannerOpen(false);
  }, []);

  const openPreferences = useCallback(() => setBannerOpen(true), []);

  const value = useMemo(
    () => ({ consent, bannerOpen, accept, reject, openPreferences }),
    [consent, bannerOpen, accept, reject, openPreferences],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used inside <ConsentProvider>");
  return ctx;
}
