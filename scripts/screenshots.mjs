import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
const base = process.env.UI_VIEWER_URL || "http://127.0.0.1:5173/ui-viewer/";
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1500, height: 1100 },
  reducedMotion: "reduce",
});
try {
  await mkdir("docs/screenshots", { recursive: true });
  await page.goto(base);
  await page
    .frameLocator("iframe")
    .first()
    .getByRole("button", { name: "Continue", exact: true })
    .waitFor();
  await page.screenshot({ path: "docs/screenshots/explore.webp" });
  const search = page.getByRole("textbox", { name: "Describe a component" });
  await search.fill('rounded blue buttons "Launch"');
  await page
    .frameLocator("iframe")
    .first()
    .getByRole("button", { name: "Launch", exact: true })
    .waitFor();
  await page.locator(".preview-open").first().click();
  await page.locator(".source-code").filter({ hasText: "Launch" }).waitFor();
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".component-controls, .card-code")].every(
      (el) => getComputedStyle(el).opacity === "1",
    ),
  );
  await page.screenshot({ path: "docs/screenshots/customize.webp" });
  await page.getByRole("checkbox", { name: "Dark", exact: true }).check();
  await page
    .frameLocator("iframe")
    .first()
    .locator('[data-dark="true"]')
    .waitFor();
  await page.screenshot({ path: "docs/screenshots/customize-dark.webp" });
  await page.getByRole("checkbox", { name: "Use Jev" }).check();
  await search.fill(
    "I need a checklist for my PC to get my RTX 3060, CPU, and motherboard",
  );
  await page
    .frameLocator("iframe")
    .first()
    .getByText("RTX 3060", { exact: true })
    .waitFor({ timeout: 15000 });
  await page.locator(".preview-open").first().click();
  await page.locator(".source-code").filter({ hasText: "RTX 3060" }).waitFor();
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".component-controls, .card-code")].every(
      (el) => getComputedStyle(el).opacity === "1",
    ),
  );
  await page.screenshot({ path: "docs/screenshots/smart-search.webp" });
  await page.setViewportSize({ width: 390, height: 844 });
  if (await page.getByRole("button", { name: "Hide filters" }).count())
    await page.getByRole("button", { name: "Hide filters" }).click();
  await page.locator(".component-tile.is-expanded").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "docs/screenshots/mobile.webp" });
} finally {
  await browser.close();
}
