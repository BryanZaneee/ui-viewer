import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
const base = process.env.UI_VIEWER_URL || "http://127.0.0.1:5173/ui-viewer/";
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1500, height: 1200 },
  reducedMotion: "reduce",
});
await mkdir("docs/screenshots", { recursive: true });
await page.goto(base);
await page.locator("iframe").first().waitFor();
await page
  .frameLocator("iframe")
  .first()
  .getByRole("button", { name: "Continue", exact: true })
  .waitFor();
await page.screenshot({ path: "docs/screenshots/explore.webp" });
await page
  .getByRole("textbox", { name: "Describe a component" })
  .fill('rounded blue buttons "Launch"');
await page
  .frameLocator("iframe")
  .first()
  .getByRole("button", { name: "Launch", exact: true })
  .waitFor();
await page.screenshot({ path: "docs/screenshots/customize.webp" });
await page
  .getByRole("textbox", { name: "Describe a component" })
  .fill('dark rounded blue buttons "Launch"');
await page
  .frameLocator("iframe")
  .first()
  .locator('[data-dark="true"]')
  .waitFor();
await page.screenshot({ path: "docs/screenshots/customize-dark.webp" });
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: "docs/screenshots/mobile.webp" });
await browser.close();
