import "server-only";
import { guestyClientId } from "./client";
import { isTokenStoreConfigured, storeDelete, storeGet, storeKeys, storeSet } from "./token-store";

/**
 * Guesty results shared by every server instance and deploy through the Upstash store (the same
 * one that holds the token). `use cache` alone is per instance on Vercel, so each new instance used
 * to redo the slow work (e.g. 40 searches for "from" prices) while a visitor waited.
 *
 * - Fresh entry: returned. Stale entry: one instance (holding a short lock) refreshes it, the others
 *   keep serving the stale copy. Nothing stored yet: computed now, or `whileBusy` if another
 *   instance is already computing it.
 * - Namespaced per Guesty key (prices can differ per Booking Engine instance) and by `VERSION`,
 *   bumped when a stored shape changes. Without the store (local dev): computed directly.
 */
const VERSION = "v1";
const KEEP_SECONDS = 3 * 24 * 3600;
const LOCK_SECONDS = 120;

interface Entry<T> {
  at: number;
  data: T;
}

function log(error: unknown): void {
  console.error(`[guesty] shared data store unavailable (${error instanceof Error ? error.message : "error"})`);
}

export async function sharedData<T>(
  name: string,
  freshSeconds: number,
  compute: () => Promise<T>,
  whileBusy?: () => T,
): Promise<T> {
  const clientId = guestyClientId();
  if (!isTokenStoreConfigured() || !clientId) return compute();
  const base = storeKeys(clientId).token.replace("be-token", `data-${VERSION}-${name}`);
  const lock = `${base}:lock`;

  let entry: Entry<T> | null = null;
  try {
    const raw = await storeGet(base);
    entry = raw ? (JSON.parse(raw) as Entry<T>) : null;
  } catch (error) {
    log(error);
    return compute();
  }
  if (entry && Date.now() - entry.at < freshSeconds * 1000) return entry.data;

  const gotLock = await storeSet(lock, "1", LOCK_SECONDS, true).catch((error: unknown) => {
    log(error);
    return true;
  });
  if (!gotLock) {
    if (entry) return entry.data;
    if (whileBusy) return whileBusy();
  }
  try {
    const data = await compute();
    await storeSet(base, JSON.stringify({ at: Date.now(), data } satisfies Entry<T>), KEEP_SECONDS).catch(log);
    return data;
  } catch (error) {
    // Guesty failed: an old copy beats nothing.
    if (entry) return entry.data;
    throw error;
  } finally {
    if (gotLock) await storeDelete(lock).catch(log);
  }
}
