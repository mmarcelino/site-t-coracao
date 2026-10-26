import { test } from "@playwright/test";
import { dismissConsent, locales, pages, pickAvailableRange, settle } from "./helpers";

const widths = [375, 768, 1280, 1600];

for (const p of pages) {
  for (const locale of locales) {
    test(`${p.name} ${locale}`, async ({ page, context }) => {
      await dismissConsent(context);
      for (const width of widths) {
        await page.setViewportSize({ width, height: width < 768 ? 812 : 900 });
        await page.goto(p[locale]);
        // Freeze scroll-driven reveals in their final state for a faithful full-page capture.
        await page.emulateMedia({ reducedMotion: "reduce" });
        await settle(page);
        await page.screenshot({ path: `screenshots/${p.name}-${locale}-${width}.png`, fullPage: true });
      }
    });
  }
}

test("consent banner pt 375", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/pt");
  await page.getByTestId("consent-banner").waitFor();
  await page.screenshot({ path: "screenshots/consent-pt-375.png" });
});

test("booking widget open en 1280", async ({ page, context }) => {
  await dismissConsent(context);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/en/apartments/breiner-heritage-apartment");
  const widget = page.getByTestId("booking-widget");
  await widget.getByTestId("booking-dates").click();
  await pickAvailableRange(widget, 4);
  await widget.getByTestId("price-breakdown").waitFor();
  await widget.getByRole("button", { name: "Done" }).click();
  await page.evaluate(() => window.scrollTo(0, 640));
  await page.waitForTimeout(500);
  await page.screenshot({ path: "screenshots/booking-quote-en-1280.png" });
});

test("booking sheet pt 375", async ({ page, context }) => {
  await dismissConsent(context);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/pt/apartamentos/breiner-heritage-apartment");
  await page.getByTestId("booking-bar").getByRole("button").click();
  await page.locator(".tc-calendar").waitFor();
  await page.waitForTimeout(400);
  await page.screenshot({ path: "screenshots/booking-sheet-pt-375.png" });
});
