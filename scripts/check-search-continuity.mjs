import { chromium } from "playwright";
import assert from "node:assert/strict";

const base = process.env.UI_VIEWER_URL || "http://127.0.0.1:3091/ui-viewer/";
const browser = await chromium.launch();
const page = await browser.newPage();
const routes = new Map();
const samples = [];
let monitor = true;
await page.exposeFunction("recordSample", (text) => {
  if (monitor) samples.push(text);
});
await page.addInitScript(() => {
  if (parent === window) return;
  new MutationObserver(() => {
    const text = document.querySelector(".preview-inner")?.textContent || "";
    if (
      /Explore the possibilities|Make it your own|Ship something great/.test(
        text,
      )
    )
      window.recordSample(text);
  }).observe(document, { subtree: true, childList: true, characterData: true });
});
await page.route("**/api/health", (route) =>
  route.fulfill({ json: { available: true } }),
);
await page.route("**/api/interpret", (route) => {
  routes.set(route.request().postDataJSON().query, route);
});
const query =
  "I need a checklist for my PC with RTX 3060, CPU, and motherboard";
const next = query.replace("3060", "4090");
const latest = query.replace("3060", "5090");
const waitForRequest = async (text) => {
  const until = Date.now() + 5000;
  while (!routes.has(text) && Date.now() < until)
    await new Promise((resolve) => setTimeout(resolve, 20));
  assert(routes.has(text), `No request for ${text}`);
  return routes.get(text);
};
const resolve = async (text, gpu) =>
  (await waitForRequest(text)).fulfill({
    json: {
      pattern: "checkbox",
      confidence: 1,
      values: { items: [gpu, "CPU", "motherboard"] },
    },
  });
const first = page.locator(".component-tile").first();
const content = (name) =>
  first.frameLocator("iframe").getByText(name, { exact: true });
try {
  await page.goto(`${base}?q=${encodeURIComponent(query)}`);
  await waitForRequest(query);
  assert.equal(
    await page.locator(".component-tile").count(),
    0,
    "Fresh search must not paint sample cards before its response",
  );
  await resolve(query, "RTX 3060");
  await content("RTX 3060").waitFor();
  const originalFrame = await first.locator("iframe").elementHandle();
  const search = page.getByRole("textbox", { name: "Describe a component" });
  // Both the debounce gap and a slow request retain the entire completed preview.
  await search.fill(next);
  await page.waitForTimeout(200);
  await content("RTX 3060").waitFor();
  await waitForRequest(next);
  await page.waitForTimeout(700);
  await content("RTX 3060").waitFor();
  assert(
    await originalFrame.evaluate((el) => el.isConnected),
    "Typing remounted the preview frame",
  );
  // A newer result wins even when the old response arrives afterwards.
  await search.fill(latest);
  await resolve(latest, "RTX 5090");
  await content("RTX 5090").waitFor();
  await resolve(next, "RTX 4090").catch(() => {}); // Aborted requests may already be closed.
  await page.waitForTimeout(200);
  await content("RTX 5090").waitFor();
  // A cached result swaps in without an intermediate reset or another request.
  routes.delete(query);
  await search.fill(query);
  await content("RTX 3060").waitFor();
  assert(!routes.has(query), "Cached query unexpectedly used the network");
  const failure = query + " in blue";
  await search.fill(failure);
  await (
    await waitForRequest(failure)
  ).fulfill({ status: 503, json: { error: "Unavailable" } });
  await page.locator('#component-results[aria-busy="false"]').waitFor();
  await content("RTX 3060").waitFor();
  assert.deepEqual(
    samples,
    [],
    "A preview briefly rendered default checklist content",
  );
  // Explicit clearing resets immediately and cancels any pending context.
  monitor = false;
  const pending = query + " in green";
  await search.fill(pending);
  await waitForRequest(pending);
  await page.getByRole("button", { name: "Clear search" }).click();
  await page
    .getByRole("button", {
      name: "Customize shadcn/ui Button collection",
      exact: true,
    })
    .waitFor();
  await resolve(pending, "Unexpected late content").catch(() => {});
  await page.waitForTimeout(200);
  assert.equal(await search.inputValue(), "");
  assert.equal(
    await page
      .getByRole("button", {
        name: "Customize shadcn/ui Button collection",
        exact: true,
      })
      .count(),
    1,
  );
  console.log(
    "Search continuity passed: initial loading, debounce, slow responses, stale response rejection, cached results, failure retention, clear, and no sample-text flashes.",
  );
} finally {
  await browser.close();
}
