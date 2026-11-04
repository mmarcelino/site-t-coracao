import "server-only";
import { createHash } from "node:crypto";

/**
 * Shared token store on Vercel: Upstash Redis (Vercel → Storage → Marketplace), reached over its
 * REST API with plain `fetch` (no client library). Every server instance and every deploy reads
 * the same Guesty token, so a key spends about one of its 3 daily tokens a day.
 *
 * Vercel's Upstash integration sets `KV_REST_API_URL` / `KV_REST_API_TOKEN` (or the `UPSTASH_REDIS_*`
 * names). Without them, `isTokenStoreConfigured()` is false and the client keeps tokens in memory.
 * Entries are namespaced by a hash of the client ID, so the preview and production keys never
 * share a token; values are never logged.
 */
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

export function isTokenStoreConfigured(): boolean {
  return Boolean(URL_ && TOKEN);
}

/** Redis keys for one Guesty client ID (hashed: the ID itself never leaves the server). */
export function storeKeys(clientId: string): { token: string; lock: string } {
  const id = createHash("sha256").update(clientId).digest("hex").slice(0, 16);
  return { token: `guesty:be-token:${id}`, lock: `guesty:be-token-lock:${id}` };
}

async function command<T>(args: Array<string | number>): Promise<T | null> {
  const res = await fetch(URL_, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`token store ${String(args[0])} failed (${res.status})`);
  return ((await res.json()) as { result: T | null }).result;
}

export async function storeGet(key: string): Promise<string | null> {
  return command<string>(["GET", key]);
}

/** SET with an expiry in seconds; `onlyIfAbsent` makes it a lock (true when this caller got it). */
export async function storeSet(key: string, value: string, ttlSeconds: number, onlyIfAbsent = false): Promise<boolean> {
  const result = await command<string>(["SET", key, value, "EX", Math.max(1, Math.floor(ttlSeconds)), ...(onlyIfAbsent ? ["NX"] : [])]);
  return result === "OK";
}

export async function storeDelete(key: string): Promise<void> {
  await command<number>(["DEL", key]);
}
