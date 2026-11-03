#!/usr/bin/env node
/**
 * Checks that a deployment serves the same CSS as a fresh build of the same commit.
 * Production once served a stale globals.css from Vercel's build cache (CLAUDE.md §16).
 *
 *   node scripts/check-deploy.mjs <deployed-url> <reference-url>
 *
 * The reference is a fresh `pnpm build && pnpm start` of the same commit (the GitHub workflow
 * runs one; locally: http://localhost:3000). Each page's stylesheets are fetched from both and
 * compared rule by rule; asset URLs inside the CSS (hashed font files) are ignored.
 * Exit code 0 = match, 1 = mismatch, 2 = could not check.
 */

const PAGES = ["/en", "/pt", "/en/apartments"];

const [deployed, reference] = process.argv.slice(2).map((u) => u?.replace(/\/$/, ""));
if (!deployed || !reference) {
  console.error("Usage: node scripts/check-deploy.mjs <deployed-url> <reference-url>");
  process.exit(2);
}

async function get(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw Object.assign(new Error(`${res.status} ${url}`), { status: res.status });
  return { text: await res.text(), url: res.url };
}

async function pageCss(base, path) {
  const page = await get(base + path);
  const hrefs = [...new Set([...page.text.matchAll(/href="([^"]+\.css[^"]*)"/g)].map((m) => m[1]))];
  // Relative to the final URL, after any redirect.
  const sheets = await Promise.all(hrefs.map((h) => get(new URL(h, page.url).href)));
  return sheets.map((s) => s.text).join("\n");
}

// Flatten to "context selector { declarations }" lines, url(...) emptied, so chunk names,
// file order and font hashes don't matter; only the rules do.
function rules(css) {
  const out = new Set();
  const stack = [];
  let buf = "";
  for (const ch of css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/url\([^)]*\)/g, "url()")) {
    if (ch === "{") {
      stack.push(buf.trim());
      buf = "";
    } else if (ch === "}") {
      const body = buf.trim();
      const sel = stack.pop();
      if (body) {
        const decls = body.split(";").map((d) => d.trim()).filter(Boolean).sort().join(";");
        out.add(`${[...stack, sel].join(" ")} { ${decls} }`);
      }
      buf = "";
    } else {
      buf += ch;
    }
  }
  return out;
}

let failed = false;
for (const path of PAGES) {
  let live, ref;
  try {
    [live, ref] = await Promise.all([pageCss(deployed, path), pageCss(reference, path)]);
  } catch (err) {
    if (err.status === 401 || err.status === 403) {
      console.log(`⚠ ${path}: deployment is password-protected (${err.status}), not checked.`);
      process.exit(2);
    }
    console.error(`✗ ${path}: ${err.message}`);
    process.exit(2);
  }
  const a = rules(live);
  const b = rules(ref);
  const missing = [...b].filter((r) => !a.has(r));
  const extra = [...a].filter((r) => !b.has(r));
  if (!missing.length && !extra.length) {
    console.log(`✓ ${path}: CSS matches (${b.size} rules)`);
    continue;
  }
  failed = true;
  console.log(`✗ ${path}: CSS differs from a fresh build`);
  for (const r of missing.slice(0, 15)) console.log(`   missing on the deployment: ${r.slice(0, 160)}`);
  for (const r of extra.slice(0, 15)) console.log(`   only on the deployment:    ${r.slice(0, 160)}`);
  if (missing.length + extra.length > 30) console.log(`   (${missing.length} missing, ${extra.length} extra in total)`);
}

if (failed) {
  console.log("\nThe deployment's CSS is not what this commit builds. Redeploy without the build cache.");
  process.exit(1);
}
