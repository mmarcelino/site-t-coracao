/**
 * DeepL translation for the automatic content refresh (DEEPL_API_KEY; the free plan's 500 000
 * characters a month cover it many times over). Free-plan keys end in ":fx" and use the free host.
 */
const LIMIT = 50; // texts per request

export function hasDeepL() {
  return Boolean(process.env.DEEPL_API_KEY);
}

/** Translates `texts` into `target` ("PT-PT", "EN-GB"); returns the text and DeepL's detected source language. */
export async function translate(texts, target, source) {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new Error("DEEPL_API_KEY is not set");
  const host = key.endsWith(":fx") ? "https://api-free.deepl.com" : "https://api.deepl.com";
  const out = [];
  for (let i = 0; i < texts.length; i += LIMIT) {
    const res = await fetch(`${host}/v2/translate`, {
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
