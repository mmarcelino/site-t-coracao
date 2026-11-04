import "server-only";
import { chmod, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { isTokenStoreConfigured, storeDelete, storeGet, storeKeys, storeSet } from "./token-store";

/**
 * Guesty Booking Engine API client (CLAUDE.md §2, §16 2026-11-04). Server-only: the credentials
 * and the access token must never reach the browser, logs or error messages.
 *
 * Tokens: Guesty issues only 3 per key per 24 hours (each valid 24h), so a token is reused until
 * shortly before it expires. It's kept in memory, plus a shared copy every instance can read:
 * - on Vercel: Upstash Redis (`token-store.ts`), which survives deploys; a short lock makes sure
 *   only one instance asks Guesty when the token runs out, while the others wait for it;
 * - in development: a git-ignored, owner-only file (`.next/cache/guesty/token.json`).
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

/** The configured client ID (server-only; used to namespace shared-store entries per key). */
export function guestyClientId(): string | null {
  return credentials()?.clientId ?? null;
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

function logStoreFailure(error: unknown): void {
  console.error(`[guesty] token store unavailable (${error instanceof Error ? error.message : "error"})`);
}

/** The shared copy: Redis when configured, else the dev file. Store failures read as "none". */
async function readShared(clientId: string): Promise<CachedToken | null> {
  if (!isTokenStoreConfigured()) return readDevToken();
  try {
    const raw = await storeGet(storeKeys(clientId).token);
    return raw ? (JSON.parse(raw) as CachedToken) : null;
  } catch (error) {
    logStoreFailure(error);
    return null;
  }
}

async function writeShared(clientId: string, t: CachedToken): Promise<void> {
  if (!isTokenStoreConfigured()) return writeDevToken(t);
  try {
    await storeSet(storeKeys(clientId).token, JSON.stringify(t), (t.expiresAt - Date.now() - EXPIRY_MARGIN_MS) / 1000);
  } catch (error) {
    logStoreFailure(error);
  }
}

async function forgetShared(clientId: string): Promise<void> {
  if (!isTokenStoreConfigured()) {
    if (process.env.NODE_ENV === "development") await rm(DEV_TOKEN_FILE, { force: true });
    return;
  }
  await storeDelete(storeKeys(clientId).token).catch(logStoreFailure);
}

const LOCK_SECONDS = 30;
const WAIT_MS = 15_000;

async function obtainToken(clientId: string): Promise<CachedToken> {
  const stored = await readShared(clientId);
  if (isFresh(stored)) return stored;
  let locked = false;
  if (isTokenStoreConfigured()) {
    try {
      locked = await storeSet(storeKeys(clientId).lock, "1", LOCK_SECONDS, true);
    } catch (error) {
      logStoreFailure(error);
      locked = true; // Store down: ask Guesty directly rather than fail.
    }
    if (!locked) {
      // Another instance is asking Guesty right now: wait for its token instead of spending one.
      for (let waited = 0; waited < WAIT_MS; waited += 500) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const shared = await readShared(clientId);
        if (isFresh(shared)) return shared;
      }
      throw new GuestyError("Timed out waiting for the shared Guesty token", 0);
    }
  } else if (process.env.NODE_ENV === "production") {
    console.warn("[guesty] no shared token store configured: each server instance requests its own token");
  }
  try {
    const fresh = await requestToken();
    await writeShared(clientId, fresh);
    return fresh;
  } finally {
    if (isTokenStoreConfigured()) await storeDelete(storeKeys(clientId).lock).catch(logStoreFailure);
  }
}

async function getToken(): Promise<string> {
  if (isFresh(memoryToken)) return memoryToken.token;
  const creds = credentials();
  if (!creds) throw new GuestyError("Guesty credentials are not configured", 0);
  // One request at a time per instance: parallel renders share the same pending token.
  pendingToken ??= obtainToken(creds.clientId).finally(() => {
    pendingToken = null;
  });
  memoryToken = await pendingToken;
  return memoryToken.token;
}

/**
 * Guesty allows 5 requests per second per key: requests start at most every 250 ms (≈4/s), so a
 * burst (e.g. sampling prices) queues instead of failing with 429.
 */
const MIN_GAP_MS = 250;
const MAX_RETRIES = 4;
let nextSlot = 0;

async function throttle(): Promise<void> {
  const now = Date.now();
  const wait = Math.max(0, nextSlot - now);
  nextSlot = Math.max(now, nextSlot) + MIN_GAP_MS;
  if (wait) await new Promise((resolve) => setTimeout(resolve, wait));
}

export interface GuestyApiError {
  code?: string;
  message?: string;
  data?: { moreDetails?: unknown };
}

export type GuestyResponse<T> = { ok: true; data: T } | { ok: false; status: number; error: GuestyApiError | null };

/** A Booking Engine API request. Non-2xx answers come back as values (with Guesty's error body), not throws. */
export async function guestyRequest<T>(method: "GET" | "POST", pathAndQuery: string, body?: unknown): Promise<GuestyResponse<T>> {
  const token = await getToken();
  let res: Response;
  // 429 = over Guesty's rate limit (e.g. parallel build workers): wait and retry, a few times.
  for (let attempt = 0; ; attempt++) {
    await throttle();
    res = await fetch(`${API_BASE}${pathAndQuery}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
    if (res.status !== 429 || attempt >= MAX_RETRIES) break;
    const retryAfter = Number(res.headers.get("retry-after"));
    await new Promise((resolve) => setTimeout(resolve, (retryAfter > 0 ? retryAfter : attempt + 1) * 1000));
  }
  if (res.status === 401) {
    // A revoked or expired token: drop it everywhere (no automatic retry, which would spend the daily quota).
    memoryToken = null;
    const creds = credentials();
    if (creds) await forgetShared(creds.clientId);
  }
  if (!res.ok) {
    const parsed = (await res.json().catch(() => null)) as { error?: GuestyApiError } | null;
    return { ok: false, status: res.status, error: parsed?.error ?? null };
  }
  return { ok: true, data: (await res.json()) as T };
}

/** GET a Booking Engine API path (e.g. `/listings?limit=100`), parsed as JSON; throws on errors. */
export async function guestyGet<T>(pathAndQuery: string): Promise<T> {
  const res = await guestyRequest<T>("GET", pathAndQuery);
  if (!res.ok) throw new GuestyError(`Guesty GET ${pathAndQuery.split("?")[0]} failed (${res.status})`, res.status);
  return res.data;
}
