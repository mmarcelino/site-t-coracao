import { expect, test, type ConsoleMessage } from "@playwright/test";
import { dismissConsent, locales, pages, pickAvailableRange } from "./helpers";

// Errors we don't control in dev (e.g. HMR websocket noise) would go here; keep it empty if possible.
const ignored: RegExp[] = [];

for (const p of pages) {
  for (const locale of locales) {
    test(`${p.name} renders in ${locale} without console errors`, async ({ page, context }) => {
      await dismissConsent(context);
      const errors: string[] = [];
      page.on("console", (msg: ConsoleMessage) => {
        if (msg.type() === "error" && !ignored.some((re) => re.test(msg.text()))) errors.push(msg.text());
      });
      page.on("pageerror", (err) => errors.push(err.message));
      const response = await page.goto(p[locale]);
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", locale === "pt" ? "pt-PT" : "en");
      await expect(page.locator("h1").first()).toBeVisible();
      await page.waitForLoadState("networkidle");
      expect(errors).toEqual([]);
    });
  }
}

for (const p of pages) {
  test(`${p.name} has no horizontal overflow at 375px`, async ({ page, context }) => {
    await dismissConsent(context);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(p.pt);
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("language switch keeps the equivalent page", async ({ page, context }) => {
  await dismissConsent(context);
  await page.goto("/pt/apartamentos/sao-bento-duplex");
  await page.getByTestId("lang-en").first().click();
  await expect(page).toHaveURL(/\/en\/apartments\/sao-bento-duplex$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByTestId("lang-pt").first().click();
  await expect(page).toHaveURL(/\/pt\/apartamentos\/sao-bento-duplex$/);
});

test("booking widget opens and shows a mock quote", async ({ page, context }) => {
  await dismissConsent(context);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/en/apartments/breiner-heritage-apartment");
  const widget = page.getByTestId("booking-widget");
  await widget.getByTestId("booking-dates").click();
  await pickAvailableRange(widget, 3);
  await expect(widget.getByTestId("price-breakdown")).toBeVisible();
  await expect(widget.getByTestId("quote-total")).toContainText("€");
  await widget.getByTestId("booking-reserve").click();
  await expect(widget.getByText(/No booking is created/)).toBeVisible();
});

test("mobile booking bar opens the sheet", async ({ page, context }) => {
  await dismissConsent(context);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/pt/apartamentos/cordoaria-garden-view-studio");
  await page.getByTestId("booking-bar").getByRole("button").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".tc-calendar")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("consent banner: decline hides it and stays declined", async ({ page }) => {
  await page.goto("/pt");
  const banner = page.getByTestId("consent-banner");
  await expect(banner).toBeVisible();
  await banner.getByRole("button", { name: "Recusar" }).click();
  await expect(banner).toBeHidden();
  const cookies = await page.context().cookies();
  expect(cookies.find((c) => c.name === "tc_consent")?.value).toBe("denied");
  await page.reload();
  await expect(page.getByTestId("consent-banner")).toBeHidden();
  // No Clarity without consent (and none at all while the project ID is unset).
  await expect(page.locator("#clarity-script")).toHaveCount(0);
});

test("consent banner: accept hides it and can be reopened from the footer", async ({ page }) => {
  await page.goto("/en");
  const banner = page.getByTestId("consent-banner");
  await banner.getByRole("button", { name: "Allow analytics" }).click();
  await expect(banner).toBeHidden();
  const cookies = await page.context().cookies();
  expect(cookies.find((c) => c.name === "tc_consent")?.value).toBe("granted");
  await page.getByRole("button", { name: "Cookie preferences" }).click();
  await expect(page.getByTestId("consent-banner")).toBeVisible();
});

test("gallery lightbox opens, navigates with the keyboard and closes", async ({ page, context }) => {
  await dismissConsent(context);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/pt/apartamentos/sao-bento-station-view-studio");
  await page.getByTestId("gallery-all").click();
  const lightbox = page.getByTestId("lightbox");
  await expect(lightbox).toContainText("1 de 8");
  await page.keyboard.press("ArrowRight");
  await expect(lightbox).toContainText("2 de 8");
  await page.keyboard.press("Escape");
  await expect(lightbox).toHaveCount(0);
  await expect(page.getByTestId("gallery-all")).toBeFocused();
});

test("whatsapp link carries a page-aware message", async ({ page, context }) => {
  await dismissConsent(context);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/en/apartments/mouzinho-32-rooftop-e");
  const href = await page.getByTestId("booking-widget").getByTestId("whatsapp-link").getAttribute("href");
  expect(href).toContain("wa.me/351962708740");
  expect(decodeURIComponent(href ?? "")).toContain("Rooftop E (Mouzinho 32)");
});
