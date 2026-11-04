import "server-only";
import { chmod, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Guesty Booking Engine API client (CLAUDE.md §2, §16 2026-11-04). Server-only: the credentials
 * and the access token must never reach the browser, logs or error messages.
 *
 * Tokens: Guesty issues only 3 per key per 24 hours (each valid 24h), so a token is reused until
 * shortly before it expires: kept in memory, and in development also in a git-ignored file
 * (`.next/cache/guesty/token.json`, owner-only) so dev-server restarts don't spend new ones.
 * TODO before production: a durable shared store (each serverless instance starts empty).
 */
const API_BASE = process.env.GUESTY_BOOKING_ENGINE_BASE_URL || "https://booking.guesty.com/api";
const TOKEN_URL = "https://booking.guesty.com/oauth2/token";
const DEV_TOKEN_FILE = path.join(process.cwd(), ".next/cache/guesty/token.json");
const EXPIRY_MARGIN_MS = 10 * 60 * 1000;

interface CachedToken {
  token: string;
  expiresAt: number;
}

let memoryToken: CachedToken | null = null;
let pendingToken: Promise<CachedToken> | null = null;

export class GuestyError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "GuestyError";
  }
}

function credentials(): { clientId: string; clientSecret: string } | null {
  const clientId = process.env.GUESTY_BOOKING_ENGINE_CLIENT_ID ?? "";
  const clientSecret = process.env.GUESTY_BOOKING_ENGINE_CLIENT_SECRET ?? "";
  if (!clientId || !clientSecret || clientId.startsWith("dummy") || clientSecret.startsWith("dummy")) return null;
  return { clientId, clientSecret };
}

/** True when real credentials are set; otherwise the data layer stays on mock data. */
export function isGuestyConfigured(): boolean {
  return credentials() !== null;
}

function isFresh(t: CachedToken | null): t is CachedToken {
  return t !== null && t.expiresAt - EXPIRY_MARGIN_MS > Date.now();
}

async function readDevToken(): Promise<CachedToken | null> {
  if (process.env.NODE_ENV !== "development") return null;
  try {
    return JSON.parse(await readFile(DEV_TOKEN_FILE, "utf8")) as CachedToken;
  } catch {
    return null;
  }
}

async function writeDevToken(t: CachedToken): Promise<void> {
  if (process.env.NODE_ENV !== "development") return;
  try {
    await mkdir(path.dirname(DEV_TOKEN_FILE), { recursive: true, mode: 0o700 });
    await writeFile(DEV_TOKEN_FILE, JSON.stringify(t), { mode: 0o600 });
    await chmod(DEV_TOKEN_FILE, 0o600);
  } catch {
    // Memory still holds it; worst case the next restart spends one more token.
  }
}

async function requestToken(): Promise<CachedToken> {
  const creds = credentials();
  if (!creds) throw new GuestyError("Guesty credentials are not configured", 0);
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "booking_engine:api",
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
    }),
    cache: "no-store",
  });
  // Only the status goes into the error: the response body is never echoed.
  if (!res.ok) throw new GuestyError(`Guesty token request failed (${res.status})`, res.status);
  const body = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!body.access_token || !body.expires_in) throw new GuestyError("Guesty token response was incomplete", res.status);
  return { token: body.access_token, expiresAt: Date.now() + body.expires_in * 1000 };
}

async function getToken(): Promise<string> {
  if (isFresh(memoryToken)) return memoryToken.token;
  // One request at a time: parallel renders share the same pending token.
  pendingToken ??= (async () => {
    const stored = await readDevToken();
    if (isFresh(stored)) return stored;
    const fresh = await requestToken();
    await writeDevToken(fresh);
    return fresh;
  })().finally(() => {
    pendingToken = null;
  });
  memoryToken = await pendingToken;
  return memoryToken.token;
}

/** GET a Booking Engine API path (e.g. `/listings?limit=100`), parsed as JSON. */
export async function guestyGet<T>(pathAndQuery: string): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}${pathAndQuery}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });
  if (res.status === 401) {
    // A revoked or expired token: drop it (no automatic retry, which would spend the daily quota).
    memoryToken = null;
    if (process.env.NODE_ENV === "development") await rm(DEV_TOKEN_FILE, { force: true });
  }
  if (!res.ok) throw new GuestyError(`Guesty GET ${pathAndQuery.split("?")[0]} failed (${res.status})`, res.status);
  return (await res.json()) as T;
}
