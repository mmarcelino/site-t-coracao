import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";

/**
 * Search engines and AI assistants are welcome (client decision 2026-11-05, CLAUDE.md §10): AI
 * crawlers are named explicitly so it's clear they're allowed, not merely not blocked. Checkout is
 * kept out (it's per-guest and noindex anyway). /llms.txt summarises the site for AI tools.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Meta-ExternalAgent",
  "Amazonbot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/pt/reservar", "/en/checkout"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: AI_CRAWLERS, allow: "/", disallow },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
