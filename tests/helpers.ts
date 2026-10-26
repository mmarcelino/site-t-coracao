import type { BrowserContext, Locator, Page } from "@playwright/test";

/** Key pages per locale. Extend as milestones add pages. */
export const pages = [
  { name: "home", pt: "/pt", en: "/en" },
  { name: "apartment", pt: "/pt/apartamentos/mouzinho-32-rooftop-e", en: "/en/apartments/mouzinho-32-rooftop-e" },
  { name: "apartment-studio", pt: "/pt/apartamentos/cordoaria-river-view-studio", en: "/en/apartments/cordoaria-river-view-studio" },
  { name: "apartments", pt: "/pt/apartamentos", en: "/en/apartments" },
] as const;

export const locales = ["pt", "en"] as const;

/** Pre-answer the consent banner so it doesn't cover screenshots (tested on its own). */
export async function dismissConsent(context: BrowserContext, value: "granted" | "denied" = "denied") {
  await context.addCookies([{ name: "tc_consent", value, url: "http://localhost:3000" }]);
}

/** Scroll through the page so lazy images load and scroll-driven reveals finish. */
export async function settle(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle");
  // Wait for images that are actually in the layout; off-screen lazy ones (e.g. a swipe strip) never load.
  await page.evaluate(() =>
    Promise.race([
      Promise.all(
        Array.from(document.images)
          .filter((img) => img.loading !== "lazy" || img.complete)
          .map((img) => img.decode().catch(() => undefined)),
      ),
      new Promise((r) => setTimeout(r, 5000)),
    ]),
  );
}

/**
 * Pick the first run of `nights` consecutive available nights in the open calendar, a few months
 * ahead (mock availability is deterministic but we don't hard-code dates that might be booked).
 */
export async function pickAvailableRange(scope: Locator, nights = 3, monthsAhead = 2) {
  const calendar = scope.locator(".tc-calendar");
  await calendar.waitFor();
  for (let i = 0; i < monthsAhead; i++) await calendar.locator(".rdp-button_next").click();
  for (let attempt = 0; attempt < 4; attempt++) {
    const days = calendar.locator("button.rdp-day_button:not([disabled])");
    const count = await days.count();
    const numbers = await days.allTextContents();
    for (let i = 0; i + nights < count; i++) {
      if (Number(numbers[i + nights]) - Number(numbers[i]) !== nights) continue;
      await days.nth(i).click();
      await days.nth(i + nights).click();
      return;
    }
    await calendar.locator(".rdp-button_next").click();
  }
  throw new Error("No available range found");
}
