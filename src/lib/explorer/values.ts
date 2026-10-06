import type { Appearance, Pattern } from "./catalog";

export const defaultItems = [
  "Explore the possibilities",
  "Make it your own",
  "Ship something great",
];
export const itemPatterns = new Set<Pattern>([
  "checkbox",
  "pricing",
  "tabs",
  "select",
  "accordion",
  "autocomplete",
  "marquee",
  "table",
  "menu",
]);
export const percentPatterns = new Set<Pattern>([
  "progress",
  "slider",
  "settings",
  "dashboard",
]);
const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
export function splitItems(text: string): string[] {
  return [
    ...new Set(
      text
        .split(/[,;\n]+|\s+and\s+/i)
        .map((x) =>
          x
            .trim()
            .replace(/^and\s+/i, "")
            .replace(/[.!]+$/, "")
            .replace(/^["“]|["”]$/g, ""),
        )
        .filter(Boolean),
    ),
  ]
    .slice(0, 8)
    .map((x) => x.slice(0, 80));
}
/** Explicit values update instantly; Jev resolves less structured descriptions. */
export function describedValues(query: string): Partial<Appearance> {
  const result: Partial<Appearance> = {};
  const percent = query.match(/\b(\d{1,3})(?:\s*%|\s+percent\b)/i);
  if (percent) result.value = clamp(+percent[1], 0, 100);
  const amount = query.match(
    /\$\s*(\d+(?:\.\d{1,2})?)|\b(?:price|count|total|number|value)\s*(?:of|at|to|:|=)?\s*(\d+(?:\.\d{1,2})?)\b/i,
  );
  if (amount) result.amount = clamp(+(amount[1] || amount[2]), 0, 10000);
  const rating = query.match(/\b([1-5])\s*(?:stars?|out of 5)\b/i);
  if (rating) result.value = +rating[1] * 20;
  const radius = query.match(
    /\b(?:radius|corners?)\s*(?:of|:|=)?\s*(\d{1,2})(?:\s*px)?\b/i,
  );
  if (radius) result.radius = clamp(+radius[1], 0, 32);
  const spacing = query.match(
    /\b(?:spacing|gap)\s*(?:of|:|=)?\s*(\d{1,2})(?:\s*px)?\b/i,
  );
  if (spacing) result.spacing = clamp(+spacing[1], 4, 32);
  const title = query.match(
    /\b(?:titled|title|heading)\s*(?:is|:|=)?\s*["“]([^"”]{1,80})["”]/i,
  );
  if (title) result.title = title[1];
  const explicit = query.match(
    /\b(?:items|options|entries|tasks)\s*:\s*([^.!]+)/i,
  );
  if (explicit) result.items = splitItems(explicit[1]);
  return result;
}
export function validAppearance(value: unknown): value is Appearance {
  if (!value || typeof value !== "object") return false;
  const a = value as Appearance;
  const number = (v: unknown, min: number, max: number) =>
    v === undefined ||
    (typeof v === "number" && Number.isFinite(v) && v >= min && v <= max);
  return (
    typeof a.color === "string" &&
    (a.color === "" || /^#[a-f\d]{6}$/i.test(a.color)) &&
    typeof a.dark === "boolean" &&
    typeof a.compact === "boolean" &&
    typeof a.outline === "boolean" &&
    typeof a.label === "string" &&
    a.label.length <= 60 &&
    (a.title === undefined ||
      (typeof a.title === "string" && a.title.length <= 80)) &&
    (a.items === undefined ||
      (Array.isArray(a.items) &&
        a.items.length <= 8 &&
        a.items.every(
          (x) => typeof x === "string" && x.length > 0 && x.length <= 80,
        ))) &&
    number(a.radius, 0, 32) &&
    number(a.value, 0, 100) &&
    number(a.amount, 0, 10000) &&
    number(a.spacing, 4, 32) &&
    number(a.scale, 0.7, 1.3)
  );
}
export function randomized(a: Appearance, pattern: Pattern): Appearance {
  const pick = <T>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];
  return {
    ...a,
    color: pick([
      "#2563eb",
      "#7c3aed",
      "#15803d",
      "#be185d",
      "#c2410c",
      "#0f766e",
    ]),
    radius: pick([0, 4, 8, 12, 20, 28]),
    spacing: pick([8, 12, 16, 20, 24]),
    scale: pick([0.85, 0.95, 1, 1.1]),
    dark: Math.random() > 0.5,
    compact: Math.random() > 0.5,
    outline: Math.random() > 0.5,
    ...(percentPatterns.has(pattern) || pattern === "rating"
      ? { value: Math.floor(Math.random() * 101) }
      : {}),
    ...(["pricing", "ticker", "dashboard"].includes(pattern)
      ? {
          amount:
            Math.floor(Math.random() * (pattern === "pricing" ? 100 : 5000)) +
            1,
        }
      : {}),
  };
}
