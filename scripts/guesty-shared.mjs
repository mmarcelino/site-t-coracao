/**
 * Shared by the Guesty refresh scripts (reviews, listing texts, the automatic monthly run): small
 * file helpers, the Booking Engine token and the listing descriptions. Credentials come from the
 * environment (GitHub Actions secrets) or, locally, .env.local. Locally the token is reused from the
 * dev token file the app keeps (never printed); a new one is requested only when it has run out, as
 * Guesty allows 3 per key per day.
 */
import { existsSync } from "node:fs";
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
  const envFile = path.join(ROOT, ".env.local");
  if (!process.env.GUESTY_BOOKING_ENGINE_CLIENT_ID && existsSync(envFile)) process.loadEnvFile(envFile);
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


/** Every listing's English summary and "space" text, as Guesty has them now. */
export async function fetchListingTexts(auth) {
  const res = await fetch(`${API}/listings?limit=100&fields=_id%20title%20publicDescription`, { headers: { authorization: `Bearer ${auth}` } });
  if (!res.ok) throw new Error(`Guesty GET /listings failed (${res.status})`);
  const { results } = await res.json();
  return results.map((l) => ({
    id: l._id,
    title: l.title,
    en: { summary: (l.publicDescription?.summary ?? "").trim(), space: (l.publicDescription?.space ?? "").trim() },
  }));
}
