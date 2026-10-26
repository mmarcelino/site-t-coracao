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

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Keep the dev badge out of Playwright screenshots.
  devIndicators: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
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
  },
  async redirects() {
    return redirects;
  },
};

export default nextConfig;
