import type { Entry, Appearance } from "./catalog";
const sources = import.meta.glob("../../components/explorer/*Preview.tsx", {
  query: "?raw",
  import: "default",
});
const names: Record<string, string> = {
  heroui: "Hero",
  daisyui: "Daisy",
  magicui: "Magic",
  chakra: "Chakra",
  "radix-themes": "Themes",
  fluent: "Fluent",
  carbon: "Carbon",
  "react-aria": "Aria",
};
export async function previewSource(
  entry: Entry,
  a: Appearance,
): Promise<string> {
  const name = names[entry.library.id];
  if (name) {
    const source =
      await sources[`../../components/explorer/${name}Preview.tsx`]();
    return `// Actual UI Viewer preview adapter. Shared types and CSS are in the repository.\n// Render with pattern=${JSON.stringify(entry.pattern.id)} and appearance=${JSON.stringify(a)}\n\n${source}`;
  }
  if (entry.library.id === "reactbits" || entry.library.id === "aceternity")
    return `Reference only.\n\nExplore ${entry.library.docs}\n\nSource is not redistributed here. Check the creator’s current license before incorporating components.`;
  const { sourceFor } = await import("./source");
  return sourceFor(entry, a);
}
