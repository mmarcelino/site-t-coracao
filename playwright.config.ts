import { defineConfig, devices } from "@playwright/test";

/**
 * Visual self-checks, smoke tests and accessibility checks (CLAUDE.md §12).
 *   pnpm test         → smoke + a11y
 *   pnpm screenshots  → full-page captures of key pages, PT + EN, 375/768/1280/1600 → screenshots/
 * Starts the dev server, or reuses one already running on :3000.
 */
const PORT = 3000;
// Playwright's bundled Chromium no longer supports macOS 13, so on macOS use the installed
// Google Chrome. CI/Linux uses the bundled browser.
const chrome = process.platform === "darwin" ? { channel: "chrome" as const } : {};

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  timeout: 60_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm dev",
    url: `http://localhost:${PORT}/pt`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    { name: "smoke", testMatch: /smoke\.spec\.ts/, use: { ...devices["Desktop Chrome"], ...chrome } },
    { name: "a11y", testMatch: /a11y\.spec\.ts/, use: { ...devices["Desktop Chrome"], ...chrome } },
    { name: "screenshots", testMatch: /screenshots\.spec\.ts/, workers: 2, use: { ...devices["Desktop Chrome"], ...chrome } },
  ],
});
