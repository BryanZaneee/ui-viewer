import { chromium } from "playwright";
import assert from "node:assert/strict";
const base = process.env.UI_VIEWER_URL || "http://127.0.0.1:3091/ui-viewer/";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const query =
  "I need a checklist for my PC to get my RTX 3060, CPU, and motherboard";
try {
  await page.goto(base);
  assert.equal(
    await page.getByText("Smart search", { exact: true }).count(),
    0,
  );
  assert.equal(
    await page.getByText("A little inspiration", { exact: true }).count(),
    0,
  );
  const search = page.getByRole("textbox", { name: "Describe a component" });
  const searchBox = await page.locator(".explorer-search").boundingBox();
  const filters = await page.locator(".library-filters").boundingBox();
  assert(
    filters.y >= searchBox.y + searchBox.height &&
      filters.y - searchBox.y - searchBox.height < 20,
  );
  await page.getByRole("button", { name: "Hide filters" }).click();
  assert.equal(await page.locator("#component-sidebar").isVisible(), false);
  await page.getByRole("button", { name: "Show filters" }).click();
  await page.getByRole("checkbox", { name: "Use Jev" }).check();
  await search.fill(query);
  await page.waitForResponse(
    (r) => r.url().endsWith("/api/interpret") && r.status() === 200,
  );
  // The native content must be present before and after opening the card.
  const first = page.locator(".component-tile").first();
  const frame = first.frameLocator("iframe");
  await frame.getByText("RTX 3060", { exact: true }).waitFor();
  await frame.getByText("CPU", { exact: true }).waitFor();
  await frame.getByText("motherboard", { exact: true }).waitFor();
  await first.locator(".preview-open").click();
  await first.getByRole("region", { name: "Customize component" }).waitFor();
  await first.locator(".source-code").filter({ hasText: "RTX 3060" }).waitFor();
  await first
    .getByRole("textbox", { name: "Item 1", exact: true })
    .fill("RTX 4090");
  await frame.getByText("RTX 4090", { exact: true }).waitFor();
  await first.locator(".source-code").filter({ hasText: "RTX 4090" }).waitFor();
  await frame.getByRole("checkbox", { name: "CPU", exact: true }).check();
  await first.getByRole("slider", { name: "Spacing" }).press("End");
  await first.getByRole("checkbox", { name: "Dark", exact: true }).check();
  await frame.locator('[data-dark="true"]').waitFor();
  await first.getByLabel("Accent", { exact: true }).evaluate((el) => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    ).set.call(el, "#be185d");
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await first
    .getByRole("textbox", { name: "Heading", exact: true })
    .fill("PC shopping list");
  await frame.getByRole("heading", { name: "PC shopping list" }).waitFor();
  assert(
    await frame.getByRole("checkbox", { name: "CPU", exact: true }).isChecked(),
  );
  assert.equal(
    await frame
      .locator(".component-preview")
      .evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--demo-accent").trim(),
      ),
    "#be185d",
  );
  await first.getByRole("button", { name: "Randomize", exact: true }).click();
  await frame.getByText("RTX 4090", { exact: true }).waitFor();
  await first.getByRole("button", { name: "Reset customizations" }).click();
  await frame.getByText("RTX 3060", { exact: true }).waitFor();
  await first.getByRole("button", { name: "Add item" }).click();
  await frame.getByText("New item", { exact: true }).waitFor();
  await first.getByRole("button", { name: "Remove item 4" }).click();
  await first.getByRole("button", { name: "Collapse component" }).click();
  await first
    .getByRole("region", { name: "Customize component" })
    .waitFor({ state: "detached" });
  await first.locator(".preview-open").press("Enter");
  await first
    .getByRole("button", { name: "Collapse component" })
    .press("Escape");
  await first
    .getByRole("region", { name: "Customize component" })
    .waitFor({ state: "detached" });
  await search.fill('blue buttons "Build PC"');
  await first
    .frameLocator("iframe")
    .getByRole("button", { name: "Build PC", exact: true })
    .waitFor();
  await first.locator(".preview-open").click();
  await first.getByRole("slider", { name: "Corners" }).press("End");
  await first
    .locator(".source-code")
    .filter({ hasText: '"radius": 32' })
    .waitFor();
  await search.fill("progress at 72% gap 8px");
  const progress = page.locator(".component-tile").first();
  await progress
    .frameLocator("iframe")
    .getByText("72%", { exact: true })
    .waitFor();
  await progress.locator(".preview-open").click();
  await progress.getByRole("slider", { name: "Value" }).press("Home");
  await progress.getByRole("slider", { name: "Value" }).press("ArrowRight");
  await progress
    .frameLocator("iframe")
    .getByText("1%", { exact: true })
    .waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("slider", { name: "Spacing" }).press("Home");
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Mobile page overflows horizontally",
  );
  assert.deepEqual(errors, []);
  console.log(
    "Editor checks passed: live Jev content, filters, expansion, code, sliders, color, heading, randomize, reset, items, keyboard and mobile.",
  );
} finally {
  await browser.close();
}
