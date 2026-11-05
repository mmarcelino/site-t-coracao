/**
 * DeepL translation for the automatic content refresh (DEEPL_API_KEY). The account is DeepL's free
 * Developer plan: a one-time credit of 1 million characters, roughly 6–7 years at this site's volume
 * (about 11 000 characters a month), so `usage()` lets the job warn long before it runs out.
 * Keys ending in ":fx" use DeepL's free host.
 */
const LIMIT = 50; // texts per request

const host = (key) => (key.endsWith(":fx") ? "https://api-free.deepl.com" : "https://api.deepl.com");

export function hasDeepL() {
  return Boolean(process.env.DEEPL_API_KEY);
}

/** Translates `texts` into `target` ("PT-PT", "EN-GB"); returns the text and DeepL's detected source language. */
export async function translate(texts, target, source) {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new Error("DEEPL_API_KEY is not set");
  const out = [];
  for (let i = 0; i < texts.length; i += LIMIT) {
    const res = await fetch(`${host(key)}/v2/translate`, {
      method: "POST",
      headers: { authorization: `DeepL-Auth-Key ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ text: texts.slice(i, i + LIMIT), target_lang: target, ...(source ? { source_lang: source } : {}), preserve_formatting: true }),
    });
    if (!res.ok) throw new Error(`DeepL translate failed (${res.status})`);
    const { translations } = await res.json();
    out.push(...translations.map((t) => ({ text: t.text, source: t.detected_source_language.toLowerCase() })));
  }
  return out;
}

/** Characters used and the account's limit. */
export async function usage() {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new Error("DEEPL_API_KEY is not set");
  const res = await fetch(`${host(key)}/v2/usage`, { headers: { authorization: `DeepL-Auth-Key ${key}` } });
  if (!res.ok) throw new Error(`DeepL usage check failed (${res.status})`);
  const { character_count, character_limit } = await res.json();
  return { used: character_count, limit: character_limit };
}
