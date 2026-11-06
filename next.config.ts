import path from "node:path";
import type { NextConfig } from "next";
import { redirects } from "./redirects";

/**
 * next-intl: we wire `next-intl/config` → our request config by hand instead of using
 * `next-intl/plugin`. The plugin eagerly loads `@swc/core` (for its optional message extractor),
 * whose native binary needs a newer macOS than our dev machines run. The alias below is all the
 * plugin does for our setup. Revisit when upgrading next-intl.
 */
const intlRequestConfig = "./src/i18n/request.ts";

/**
 * Checkout pages: no third-party scripts (payments decision 2026-11-04, CLAUDE.md §11). Same paths
 * as `src/lib/checkout.ts`. When the payment provider is chosen, add only its own domains (e.g.
 * GuestyPay's tokenization SDK or js.stripe.com) to script-src, frame-src and connect-src.
 * 'unsafe-inline' is for Next's inline bootstrap scripts (nonces would make every page dynamic).
 */
const checkoutPaths = ["/pt/reservar", "/en/checkout"];
const checkoutCsp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://assets.guesty.com https://guesty-listing-images.s3.amazonaws.com",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Keep the dev badge out of Playwright screenshots.
  devIndicators: false,
  turbopack: {
    resolveAlias: {
      "next-intl/config": intlRequestConfig,
    },
  },
  webpack(config: { resolve: { alias: Record<string, string> } }) {
    config.resolve.alias["next-intl/config"] = path.resolve(intlRequestConfig);
    return config;
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75],
    // Listing photos from Guesty (Booking Engine API); older uploads live on its S3 bucket.
    // Keep in sync with `imageHosts` in src/lib/data/listings.ts.
    remotePatterns: [
      { protocol: "https", hostname: "assets.guesty.com", pathname: "/image/upload/**" },
      { protocol: "https", hostname: "guesty-listing-images.s3.amazonaws.com", pathname: "/production/**" },
    ],
  },
  async redirects() {
    return redirects;
  },
  async headers() {
    return checkoutPaths.flatMap((path) => [path, `${path}/:rest*`]).map((source) => ({
      source,
      headers: [{ key: "Content-Security-Policy", value: checkoutCsp }],
    }));
  },
};

export default nextConfig;
