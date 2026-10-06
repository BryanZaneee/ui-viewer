import { describedValues } from "./values";
export const libraries = [
  {
    id: "shadcn",
    name: "shadcn/ui",
    mark: "◩",
    platform: "React",
    color: "#18181b",
    docs: "https://ui.shadcn.com/docs/components",
    install:
      "npx shadcn@latest add button input checkbox slider select progress tabs alert accordion switch",
  },
  {
    id: "swiftui",
    name: "SwiftUI",
    mark: "􀣺",
    platform: "Apple",
    color: "#b34118",
    docs: "https://developer.apple.com/documentation/swiftui",
    install: "Built into Xcode. Create a SwiftUI app and add the view below.",
  },
  {
    id: "mui",
    name: "Material UI",
    mark: "M",
    platform: "React",
    color: "#0762bc",
    docs: "https://mui.com/material-ui/all-components/",
    install: "npm install @mui/material @emotion/react @emotion/styled",
  },
  {
    id: "mantine",
    name: "Mantine",
    mark: "m",
    platform: "React",
    color: "#176dab",
    docs: "https://mantine.dev/core/package/",
    install: "npm install @mantine/core @mantine/hooks",
  },
  {
    id: "radix",
    name: "Radix UI",
    mark: "◐",
    platform: "React",
    color: "#7c3aed",
    docs: "https://www.radix-ui.com/primitives/docs/overview/introduction",
    install: "npm install radix-ui",
  },
  {
    id: "antd",
    name: "Ant Design",
    mark: "◇",
    platform: "React",
    color: "#1261c0",
    docs: "https://ant.design/components/overview/",
    install: "npm install antd",
  },
  {
    id: "heroui",
    name: "HeroUI",
    mark: "H",
    platform: "React",
    color: "#006fbd",
    docs: "https://heroui.com/en/docs/react",
    install: "npm install @heroui/react @heroui/styles",
  },
  {
    id: "daisyui",
    name: "daisyUI",
    mark: "\u273f",
    platform: "React",
    color: "#166655",
    docs: "https://daisyui.com/components/",
    install: "npm install daisyui tailwindcss @tailwindcss/vite",
  },
  {
    id: "magicui",
    name: "Magic UI",
    mark: "\u2727",
    platform: "React",
    color: "#784cc9",
    docs: "https://magicui.design/docs/components",
    install:
      "Copy the attributed components from src/components/magicui; npm install motion clsx tailwind-merge",
  },
  {
    id: "chakra",
    name: "Chakra UI",
    mark: "\u26a1",
    platform: "React",
    color: "#147b78",
    docs: "https://chakra-ui.com/docs/components/concepts/overview",
    install: "npm install @chakra-ui/react @emotion/react",
  },
  {
    id: "radix-themes",
    name: "Radix Themes",
    mark: "\u25d2",
    platform: "React",
    color: "#663fc1",
    docs: "https://www.radix-ui.com/themes/docs",
    install: "npm install @radix-ui/themes",
  },
  {
    id: "fluent",
    name: "Fluent UI",
    mark: "F",
    platform: "React",
    color: "#0758aa",
    docs: "https://fluent2.microsoft.design/components/web/react",
    install: "npm install @fluentui/react-components",
  },
  {
    id: "carbon",
    name: "Carbon",
    mark: "C",
    platform: "React",
    color: "#253dc6",
    docs: "https://carbondesignsystem.com/components/overview/",
    install: "npm install @carbon/react sass",
  },
  {
    id: "react-aria",
    name: "React Aria",
    mark: "A",
    platform: "React",
    color: "#b72d43",
    docs: "https://react-aria.adobe.com/",
    install: "npm install react-aria-components @internationalized/date",
  },
  {
    id: "reactbits",
    name: "React Bits",
    mark: "\u219d",
    platform: "Link",
    color: "#6540b6",
    docs: "https://reactbits.dev/",
    install:
      "Reference only. Visit the original library for licensing and installation.",
  },
  {
    id: "aceternity",
    name: "Aceternity UI",
    mark: "\u2301",
    platform: "Link",
    color: "#086b90",
    docs: "https://ui.aceternity.com/components",
    install:
      "Reference only. Visit the original library for licensing and installation.",
  },
] as const;
export type Library = (typeof libraries)[number]["id"];
export const patterns = [
  {
    id: "button",
    name: "Button collection",
    category: "Actions",
    description: "Primary, secondary, and quiet actions.",
    tags: "button buttons action submit save cancel cta click download rounded outline pill",
  },
  {
    id: "login",
    name: "Sign-in form",
    category: "Forms",
    description: "A welcoming entry point to your app.",
    tags: "login log in sign in signup auth authentication email password account form",
  },
  {
    id: "settings",
    name: "Settings panel",
    category: "Forms",
    description: "Preferences that feel right at home.",
    tags: "settings preferences notifications toggle switch controls dark mode panel",
  },
  {
    id: "pricing",
    name: "Pricing card",
    category: "Data display",
    description: "Give your next big idea a plan.",
    tags: "pricing price subscription billing payment checkout plan card membership saas",
  },
  {
    id: "tabs",
    name: "Segmented navigation",
    category: "Navigation",
    description: "Move between views without leaving context.",
    tags: "tabs tab segmented navigation menu nav dashboard views",
  },
  {
    id: "slider",
    name: "Range slider",
    category: "Forms",
    description: "Fine-grained control, direct feedback.",
    tags: "slider range volume brightness audio music value number",
  },
  {
    id: "input",
    name: "Text fields",
    category: "Forms",
    description: "A clear space for a little input.",
    tags: "input text field textbox search email form name label",
  },
  {
    id: "switch",
    name: "Toggle switches",
    category: "Forms",
    description: "Small switches for everyday decisions.",
    tags: "switch toggle boolean on off notifications settings preferences",
  },
  {
    id: "checkbox",
    name: "Checklist",
    category: "Forms",
    description: "A satisfying way to get things done.",
    tags: "checkbox check list todo task tasks shopping done selection",
  },
  {
    id: "select",
    name: "Select menu",
    category: "Forms",
    description: "A considered choice from a short list.",
    tags: "select dropdown menu picker choice options country language",
  },
  {
    id: "progress",
    name: "Progress tracker",
    category: "Feedback",
    description: "Make every bit of progress visible.",
    tags: "progress loading upload download status completion tracker bar",
  },
  {
    id: "alert",
    name: "Status message",
    category: "Feedback",
    description: "A useful update at just the right moment.",
    tags: "alert notification message feedback success warning error toast banner",
  },
  {
    id: "accordion",
    name: "Accordion",
    category: "Data display",
    description: "A little less clutter, a little more clarity.",
    tags: "accordion disclosure faq questions expandable collapse details help",
  },
  {
    id: "dashboard",
    name: "Overview card",
    category: "Data display",
    description: "The numbers and actions that matter.",
    tags: "dashboard analytics stats statistics metric chart overview admin data card",
  },
  {
    id: "calendar",
    name: "Calendar",
    category: "Dates & time",
    description: "Pick a date with keyboard-friendly month navigation.",
    tags: "calendar date dates schedule booking day month picker",
  },
  {
    id: "autocomplete",
    name: "Autocomplete",
    category: "Forms",
    description: "Find a choice as you type.",
    tags: "autocomplete combobox search suggestions filter options",
  },
  {
    id: "table",
    name: "Data table",
    category: "Data display",
    description: "A clear view of your team and their roles.",
    tags: "table rows columns data team users admin dashboard",
  },
  {
    id: "rating",
    name: "Star rating",
    category: "Forms",
    description: "Leave a little feedback.",
    tags: "rating stars review feedback score",
  },
  {
    id: "menu",
    name: "Action menu",
    category: "Navigation",
    description: "Useful actions within reach.",
    tags: "menu dropdown actions navigation context",
  },
  {
    id: "badge",
    name: "Status badges",
    category: "Data display",
    description: "Small labels, clear meaning.",
    tags: "badge chip status tag label avatar",
  },
  {
    id: "skeleton",
    name: "Loading skeleton",
    category: "Feedback",
    description: "A considered placeholder while content loads.",
    tags: "skeleton loading placeholder shimmer",
  },
  {
    id: "marquee",
    name: "Scrolling marquee",
    category: "Motion",
    description: "An endless stream of possibilities.",
    tags: "marquee scrolling animation animated testimonials logos motion",
  },
  {
    id: "aurora",
    name: "Aurora text",
    category: "Motion",
    description: "Words with a little atmosphere.",
    tags: "aurora gradient text headline animation animated motion",
  },
  {
    id: "ticker",
    name: "Number ticker",
    category: "Motion",
    description: "Bring a milestone to life.",
    tags: "number ticker count animation animated stats counter motion",
  },
  {
    id: "dialog",
    name: "Dialog",
    category: "Overlays",
    description: "Give an important decision its own space.",
    tags: "modal dialog overlay popup confirm",
  },
  {
    id: "3d-card",
    name: "3D cards",
    category: "Motion",
    description:
      "Explore the original library\u2019s perspective card effects.",
    tags: "3d card tilt hover motion perspective",
  },
  {
    id: "particles",
    name: "Particle backgrounds",
    category: "Motion",
    description: "Explore the original library\u2019s interactive backgrounds.",
    tags: "particles background animation animated interactive motion",
  },
] as const;
export type Pattern = (typeof patterns)[number]["id"];
export type Entry = {
  id: string;
  library: (typeof libraries)[number];
  pattern: (typeof patterns)[number];
};
// Explicit support lists: an entry exists only when its renderer implements it.
export const supported: Record<Library, readonly Pattern[]> = {
  shadcn: [
    "button",
    "login",
    "settings",
    "pricing",
    "tabs",
    "slider",
    "input",
    "switch",
    "checkbox",
    "select",
    "progress",
    "alert",
    "accordion",
    "dashboard",
  ],
  swiftui: [
    "button",
    "login",
    "settings",
    "pricing",
    "tabs",
    "slider",
    "input",
    "switch",
    "checkbox",
    "select",
    "progress",
    "alert",
    "accordion",
    "dashboard",
  ],
  mui: [
    "button",
    "login",
    "settings",
    "pricing",
    "tabs",
    "slider",
    "input",
    "switch",
    "checkbox",
    "select",
    "progress",
    "alert",
    "accordion",
    "dashboard",
  ],
  mantine: [
    "button",
    "login",
    "settings",
    "pricing",
    "tabs",
    "slider",
    "input",
    "switch",
    "checkbox",
    "select",
    "progress",
    "alert",
    "accordion",
    "dashboard",
  ],
  radix: [
    "button",
    "login",
    "settings",
    "pricing",
    "tabs",
    "slider",
    "input",
    "switch",
    "checkbox",
    "select",
    "progress",
    "alert",
    "accordion",
    "dashboard",
  ],
  antd: [
    "button",
    "login",
    "settings",
    "pricing",
    "tabs",
    "slider",
    "input",
    "switch",
    "checkbox",
    "select",
    "progress",
    "alert",
    "accordion",
    "dashboard",
  ],
  heroui: [
    "button",
    "input",
    "switch",
    "badge",
    "skeleton",
    "accordion",
    "tabs",
  ],
  daisyui: [
    "button",
    "rating",
    "progress",
    "accordion",
    "tabs",
    "table",
    "badge",
    "input",
    "switch",
  ],
  magicui: ["marquee", "aurora", "ticker"],
  chakra: [
    "button",
    "input",
    "switch",
    "tabs",
    "progress",
    "badge",
    "skeleton",
  ],
  "radix-themes": [
    "button",
    "input",
    "switch",
    "tabs",
    "table",
    "menu",
    "dialog",
    "badge",
  ],
  fluent: ["button", "input", "switch", "tabs", "progress", "badge", "menu"],
  carbon: [
    "button",
    "input",
    "switch",
    "accordion",
    "table",
    "badge",
    "skeleton",
  ],
  "react-aria": [
    "button",
    "calendar",
    "autocomplete",
    "switch",
    "slider",
    "tabs",
    "checkbox",
  ],
  reactbits: ["particles", "aurora"],
  aceternity: ["3d-card", "particles"],
};
export const isReference = (id: Library) =>
  id === "reactbits" || id === "aceternity";
export const liveLibraries = libraries.filter((l) => !isReference(l.id));
export const catalog: Entry[] = patterns.flatMap((pattern) =>
  libraries
    .filter((library) => supported[library.id].includes(pattern.id))
    .map((library) => ({
      id: `${library.id}-${pattern.id}`,
      library,
      pattern,
    })),
);
export const categories = [
  "All components",
  ...new Set(patterns.map((p) => p.category)),
];
export const suggestions = [
  "rounded blue buttons",
  "animated text",
  "calendar",
  "SwiftUI settings",
  "dark pricing cards",
];
export type Appearance = {
  color: string;
  dark: boolean;
  radius: number | undefined;
  compact: boolean;
  outline: boolean;
  label: string;
  title?: string;
  items?: string[];
  value?: number;
  amount?: number;
  spacing?: number;
  scale?: number;
};
const colors: Record<string, string> = {
  blue: "#2563eb",
  purple: "#7c3aed",
  violet: "#7c3aed",
  green: "#15803d",
  emerald: "#047857",
  red: "#dc2626",
  orange: "#c2410c",
  pink: "#be185d",
  rose: "#be123c",
  teal: "#0f766e",
  black: "#18181b",
  indigo: "#4f46e5",
};
export function appearance(query: string): Appearance {
  const q = query.toLowerCase();
  const words = q.match(/[a-z]+/g) ?? [];
  const color =
    q.match(/#[\da-f]{6}\b/i)?.[0] ??
    colors[[...words].reverse().find((w) => colors[w]) ?? ""] ??
    "";
  return {
    color,
    dark: /\b(dark|night)\b/.test(q),
    radius: /\b(pill|rounded|round)\b/.test(q)
      ? 24
      : /\b(square|sharp)\b/.test(q)
        ? 0
        : undefined,
    compact: /\b(compact|small|dense|tiny)\b/.test(q),
    outline: /\b(outline|outlined|ghost)\b/.test(q),
    ...describedValues(query),
    label: query.match(/["“]([^"”]{1,60})["”]/)?.[1] ?? "Continue",
  };
}
const stopWords = new Set(
  "a an the with and or for to of in on ui component components show me make want i like please that has is it some more style styled minimal modern clean dark light night rounded round pill square sharp outline outlined ghost compact small dense tiny large big accents accent called labeled label".split(
    " ",
  ),
);
const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/shadcn\/ui|shadcn|shade/g, "shadcn")
    .replace(/material ui|material design/g, "mui")
    .replace(/ant design/g, "antd")
    .replace(/radix ui/g, "radix")
    .replace(/swift ui|ios|apple/g, "swiftui")
    .replace(/hero ui/g, "heroui")
    .replace(/daisy ui/g, "daisyui")
    .replace(/magic ui/g, "magicui")
    .replace(/chakra ui/g, "chakra")
    .replace(/radix[- ]themes/g, "radixthemes")
    .replace(/react[- ]aria/g, "reactaria")
    .replace(/fluent ui/g, "fluent")
    .replace(/react bits/g, "reactbits")
    .replace(/aceternity ui/g, "aceternity");
export function searchCatalog(
  query: string,
  library = "all",
  category = "All components",
  intent: Pattern | null = null,
): Entry[] {
  const q = normalize(
    query.replace(/["“][^"”]*["”]/g, "").replace(/#[\da-f]{6}\b/gi, ""),
  );
  const tokens = (q.match(/[a-z0-9]+/g) ?? []).filter(
    (t) => !stopWords.has(t) && !colors[t],
  );
  const mentioned = libraries
    .filter((l) => tokens.includes(l.id.replace(/-/g, "")))
    .map((l) => l.id);
  const terms = tokens.filter(
    (t) => !mentioned.some((id) => id.replace(/-/g, "") === t),
  );
  return catalog
    .filter(
      (e) =>
        (library === "all" || e.library.id === library) &&
        (category === "All components" || e.pattern.category === category) &&
        (!mentioned.length || mentioned.includes(e.library.id)),
    )
    .map((e) => {
      const words = `${e.pattern.name} ${e.pattern.tags} ${e.pattern.category}`
        .toLowerCase()
        .split(/\W+/);
      const score = terms.reduce(
        (total, t) =>
          total +
          (words.includes(t)
            ? 5
            : words.some(
                  (w) =>
                    w.startsWith(t) ||
                    (t.endsWith("s") && w === t.slice(0, -1)),
                )
              ? 2
              : 0),
        0,
      );
      return { e, score: score + (e.pattern.id === intent ? 20 : 0) };
    })
    .filter(({ score }) => !terms.length || score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ e }) => e);
}
