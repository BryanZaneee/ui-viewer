import { validAppearance } from "./lib/explorer/values";
import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createRoot } from "react-dom/client";
import {
  appearance,
  catalog,
  type Appearance,
  type Library,
} from "./lib/explorer/catalog";
import type { PreviewProps } from "./components/explorer/PatternPreview";
import "./base.css";
import "./components/explorer/explorer.css";
import "./preview.css";

const loaders = {
  mui: () => import("./components/explorer/MuiPreview"),
  mantine: () => import("./components/explorer/MantinePreview"),
  antd: () => import("./components/explorer/AntPreview"),
  heroui: () => import("./components/explorer/HeroPreview"),
  daisyui: () => import("./components/explorer/DaisyPreview"),
  magicui: () => import("./components/explorer/MagicPreview"),
  chakra: () => import("./components/explorer/ChakraPreview"),
  "radix-themes": () => import("./components/explorer/ThemesPreview"),
  fluent: () => import("./components/explorer/FluentPreview"),
  carbon: () => import("./components/explorer/CarbonPreview"),
  "react-aria": () => import("./components/explorer/AriaPreview"),
};
const adapters = Object.fromEntries(
  Object.entries(loaders).map(([id, load]) => [id, lazy(load)]),
);
const Web = lazy(() => import("./components/explorer/WebPreview"));
class PreviewError extends Component<
  { children: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div role="alert">This preview could not load. Reload to try again.</div>
    ) : (
      this.props.children
    );
  }
}
function App() {
  const entry = catalog.find(
    (e) => e.id === new URLSearchParams(location.search).get("entry"),
  );
  const [a, setA] = useState<Appearance | null>(() =>
    window.parent === window ? appearance("") : null,
  );
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (
        event.origin === location.origin &&
        event.source === parent &&
        event.data?.type === "ui-viewer-appearance" &&
        validAppearance(event.data.appearance)
      )
        setA(event.data.appearance);
    };
    window.addEventListener("message", receive);
    parent.postMessage({ type: "ui-viewer-ready" }, location.origin);
    return () => window.removeEventListener("message", receive);
  }, []);
  if (!entry) return <p role="alert">Component not found.</p>;
  // Embedded previews wait for their real props instead of painting sample data.
  if (!a)
    return (
      <div className="frame-placeholder" role="status">
        Loading preview…
      </div>
    );
  const library: Library = entry.library.id;
  const Adapter = adapters[library];
  const props: PreviewProps = { pattern: entry.pattern.id, appearance: a };
  const style = {
    "--demo-accent": a.color || entry.library.color,
    "--demo-radius": `${a.radius ?? (library === "swiftui" ? 12 : 6)}px`,
    "--demo-space": `${a.spacing ?? (a.compact ? 10 : 16)}px`,
    "--accent": a.color || entry.library.color,
    colorScheme: a.dark ? "dark" : "light",
  } as CSSProperties;
  return (
    <div
      className={`component-preview library-${library} ${a.dark ? "dark" : ""}`}
      data-dark={a.dark}
      data-mantine-color-scheme={a.dark ? "dark" : "light"}
      data-outline={a.outline}
      style={style}
    >
      <div className="preview-inner" style={{ zoom: a.scale ?? 1 }}>
        {a.title && <h2 className="preview-custom-title">{a.title}</h2>}
        <PreviewError>
          <Suspense fallback={<div role="status">Loading library…</div>}>
            {library === "shadcn" ||
            library === "radix" ||
            library === "swiftui" ? (
              <Web key={JSON.stringify(a.items)} {...props} library={library} />
            ) : Adapter ? (
              <Adapter key={JSON.stringify(a.items)} {...props} />
            ) : (
              <p>Visit the original component library.</p>
            )}
          </Suspense>
        </PreviewError>
      </div>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
