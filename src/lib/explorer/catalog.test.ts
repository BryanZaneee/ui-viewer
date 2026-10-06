import assert from "node:assert/strict";
import test from "node:test";
import { transformSync } from "esbuild";
import {
  catalog,
  appearance,
  searchCatalog,
  supported,
  libraries,
  liveLibraries,
  isReference,
} from "./catalog";
import { sourceFor } from "./source";

test("every catalog entry is unique and explicitly supported", () => {
  assert.equal(new Set(catalog.map((e) => e.id)).size, catalog.length);
  assert.equal(liveLibraries.length, 14);
  assert.equal(catalog.filter((e) => !isReference(e.library.id)).length, 139);
  for (const lib of libraries) {
    const entries = catalog.filter((e) => e.library.id === lib.id);
    assert.equal(entries.length, supported[lib.id].length);
    assert(entries.every((e) => supported[lib.id].includes(e.pattern.id)));
  }
});
test("natural descriptions, aliases, prefixes and filters resolve the right components", () => {
  for (const [query, id] of [
    ["shade buttons", "shadcn-button"],
    ["Swift UI settings", "swiftui-settings"],
    ["react aria calendar", "react-aria-calendar"],
    ["react-aria calendar", "react-aria-calendar"],
    ["radix themes table", "radix-themes-table"],
    ["magic ui animated text", "magicui-aurora"],
    ["daisyui rating", "daisyui-rating"],
  ])
    assert(
      searchCatalog(query).some((e) => e.id === id),
      query,
    );
  assert(
    searchCatalog("rounded blue buttons").every(
      (e) => e.pattern.id === "button",
    ),
  );
  assert(searchCatalog("calen").some((e) => e.pattern.id === "calendar"));
  assert(
    searchCatalog("", "fluent", "Navigation").every(
      (e) => e.library.id === "fluent" && e.pattern.category === "Navigation",
    ),
  );
  assert.equal(searchCatalog("zqxv987noresults").length, 0);
  assert(searchCatalog("React Bits").every((e) => isReference(e.library.id)));
});
test("appearance extraction changes live props without treating labels as search/code", () => {
  const a = appearance(
    'dark compact rounded outline #123abc buttons "Launch <script>"',
  );
  assert.deepEqual(a, {
    color: "#123abc",
    dark: true,
    compact: true,
    radius: 24,
    outline: true,
    label: "Launch <script>",
  });
  assert.equal(appearance("sharp green then blue").color, "#2563eb");
  assert.equal(appearance("sharp").radius, 0);
  assert(searchCatalog('button "not a catalog keyword"').length > 5);
});
test("all legacy TSX starters parse, including quoted labels", () => {
  for (const entry of catalog.filter((e) =>
    ["shadcn", "mui", "mantine", "radix", "antd"].includes(e.library.id),
  )) {
    const source = sourceFor(entry, appearance('rounded dark blue "Launch"'));
    assert.doesNotThrow(
      () => transformSync(source, { loader: "tsx", target: "es2022" }),
      entry.id,
    );
    assert(!source.includes("undefined"), entry.id);
  }
});

test("semantic matches preserve explicit library and category filters", () => {
  assert.equal(
    searchCatalog(
      "pick a day for an appointment",
      "all",
      "All components",
      "calendar",
    )[0].pattern.id,
    "calendar",
  );
  assert(
    searchCatalog("mui appointment", "all", "All components", "calendar").every(
      (e) => e.library.id === "mui",
    ),
  );
  assert(
    searchCatalog("appointment", "all", "Forms", "calendar").every(
      (e) => e.pattern.category === "Forms",
    ),
  );
});

test("live values parse numbers by purpose, bound inputs and preserve content", async () => {
  const { validAppearance, randomized } = await import("./values");
  const a = appearance(
    'dark progress at 72% radius 12px gap 8px title "Downloads"',
  );
  assert.equal(a.value, 72);
  assert.equal(a.radius, 12);
  assert.equal(a.spacing, 8);
  assert.equal(a.title, "Downloads");
  assert.equal(appearance("checklist for RTX 3060").amount, undefined);
  assert.equal(appearance("price $49.99").amount, 49.99);
  assert.deepEqual(
    appearance("checklist items: RTX 3060, CPU and motherboard").items,
    ["RTX 3060", "CPU", "motherboard"],
  );
  assert(validAppearance(a));
  assert(!validAppearance({ ...a, items: ["x".repeat(81)] }));
  for (const values of [
    { value: NaN },
    { radius: 100 },
    { scale: 10 },
    { amount: Infinity },
    { items: [3] },
  ])
    assert(!validAppearance({ ...a, ...values }));
  for (const pattern of [
    "checkbox",
    "progress",
    "pricing",
    "ticker",
  ] as const) {
    const customized = { ...a, items: ["RTX 3060", "CPU", "motherboard"] };
    const random = randomized(customized, pattern);
    assert(validAppearance(random));
    assert.deepEqual(random.items, customized.items);
  }
  const swift = sourceFor(
    catalog.find((e) => e.id === "swiftui-checkbox")!,
    { ...a, items: ["RTX 3060", "CPU", "motherboard"] },
  );
  assert(swift.includes('"RTX 3060", "CPU", "motherboard"'));
  assert(swift.includes("selected.contains(index)"));
});
