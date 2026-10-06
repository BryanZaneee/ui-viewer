import { chromium } from "playwright";
import { catalog, isReference } from "../src/lib/explorer/catalog.ts";
const base = process.env.UI_VIEWER_URL || "http://127.0.0.1:4173/ui-viewer/";
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [],
  failures = [];
page.on("pageerror", (error) => errors.push(error.message));
const entries = catalog.filter((entry) => !isReference(entry.library.id));
for (const [index, entry] of entries.entries()) {
  try {
    await page.goto(`${base}preview.html?entry=${entry.id}`, {
      waitUntil: "domcontentloaded",
      timeout: 12000,
    });
    await page.waitForFunction(
      () => {
        const el = document.querySelector(".preview-inner");
        return (
          el && el.children.length && !el.innerText.includes("Loading library")
        );
      },
      null,
      { timeout: 12000 },
    );
    const text = await page.locator(".preview-inner").innerText();
    if (
      text.includes("could not load") ||
      text.includes("Visit the original") ||
      errors.length
    )
      throw new Error(text + errors.join("; "));
  } catch (error) {
    failures.push({ id: entry.id, error: String(error) });
  }
  errors.length = 0;
  if ((index + 1) % 20 === 0)
    console.log(`Checked ${index + 1}/${entries.length}`);
}
await browser.close();
console.log(JSON.stringify({ checked: entries.length, failures }, null, 2));
process.exitCode = failures.length ? 1 : 0;
