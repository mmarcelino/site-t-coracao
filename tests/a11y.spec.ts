import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { dismissConsent, locales, pages } from "./helpers";

/** Automated WCAG 2.2 AA checks (catches roughly a third of issues; manual review still needed). */
for (const p of pages) {
  for (const locale of locales) {
    for (const width of [375, 1280]) {
      test(`${p.name} ${locale} @${width}px has no detectable a11y violations`, async ({ page, context }) => {
        await dismissConsent(context);
        await page.setViewportSize({ width, height: 900 });
        await page.goto(p[locale]);
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.waitForLoadState("networkidle");
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();
        const summary = results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          targets: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
        }));
        expect(summary).toEqual([]);
      });
    }
  }
}

test("consent banner has no a11y violations", async ({ page }) => {
  await page.goto("/en");
  await page.getByTestId("consent-banner").waitFor();
  const results = await new AxeBuilder({ page }).include('[data-testid="consent-banner"]').analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});
