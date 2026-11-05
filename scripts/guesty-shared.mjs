/**
 * Shared by the Guesty refresh scripts (reviews.mjs, listing-texts.mjs): small file helpers and the
 * Booking Engine token. The token is reused from the dev token file the app keeps (never printed);
 * a new one is requested only when it has run out, as Guesty allows 3 per key per day.
 */
import { chmod, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const ROOT = process.cwd();
export const API = "https://booking.guesty.com/api";
const TOKEN_FILE = path.join(ROOT, ".next/cache/guesty/token.json");

export const readJson = async (file, fallback) => {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return fallback;
  }
};
export const writePrivate = async (file, data) => {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  await writeFile(file, JSON.stringify(data, null, 1) + "\n", { mode: 0o600 });
  await chmod(file, 0o600);
};
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const decode = (t) =>
  t.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

export async function token() {
  const cached = await readJson(TOKEN_FILE, null);
  if (cached?.token && cached.expiresAt - 10 * 60 * 1000 > Date.now()) return cached.token;
  // Guesty allows 3 tokens per key per day: only ask when the app's cached one has run out.
  process.loadEnvFile(path.join(ROOT, ".env.local"));
  const res = await fetch("https://booking.guesty.com/oauth2/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "booking_engine:api",
      client_id: process.env.GUESTY_BOOKING_ENGINE_CLIENT_ID ?? "",
      client_secret: process.env.GUESTY_BOOKING_ENGINE_CLIENT_SECRET ?? "",
    }),
  });
  if (!res.ok) throw new Error(`Guesty token request failed (${res.status})`);
  const { access_token, expires_in } = await res.json();
  await writePrivate(TOKEN_FILE, { token: access_token, expiresAt: Date.now() + expires_in * 1000 });
  return access_token;
}

