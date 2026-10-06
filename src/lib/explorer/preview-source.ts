import type { Entry, Appearance } from "./catalog";
const sources = import.meta.glob("../../components/explorer/*Preview.tsx", {
  query: "?raw",
  import: "default",
});
const names: Record<string, string> = {
  shadcn: "Web",
  radix: "Web",
  mui: "Mui",
  mantine: "Mantine",
  antd: "Ant",
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
    const usage = `<${name}Preview${name === "Web" ? ` library="${entry.library.id}"` : ""}\n  pattern="${entry.pattern.id}"\n  appearance={${JSON.stringify(a, null, 2)}}\n/>`;
    return `// Your configured component (shared types, renderer and CSS are in UI Viewer).\n${usage
      .split("\n")
      .map((line) => `// ${line}`)
      .join(
        "\n",
      )}\n\n// Adapter implementation: src/components/explorer/${name}Preview.tsx\n${source}`;
  }
  if (entry.library.id === "reactbits" || entry.library.id === "aceternity")
    return `Reference only.\n\nExplore ${entry.library.docs}\n\nSource is not redistributed here. Check the creator’s current license before incorporating components.`;
  const { sourceFor } = await import("./source");
  return sourceFor(entry, a);
}
