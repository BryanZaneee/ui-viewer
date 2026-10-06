"use client";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  Check,
  Code2,
  Copy,
  Layers2,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  appearance,
  catalog,
  categories,
  libraries,
  liveLibraries,
  isReference,
  searchCatalog,
  suggestions,
  type Entry,
} from "@/lib/explorer/catalog";
import { previewSource } from "@/lib/explorer/preview-source";
import { Preview } from "./Preview";
import { useSmartSearch } from "@/lib/explorer/useSmartSearch";
import "./explorer.css";

const empty = () => "";
function subscribeURL(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener("explorer-url", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("explorer-url", callback);
  };
}
const urlSnapshot = () => window.location.search;
function updateURL(values: Record<string, string>) {
  const url = new URL(window.location.href);
  for (const [k, v] of Object.entries(values)) {
    if (v) url.searchParams.set(k, v);
    else url.searchParams.delete(k);
  }
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event("explorer-url"));
}
const savedKey = "ui-viewer-saved-v1";
function savedSnapshot() {
  try {
    return localStorage.getItem(savedKey) || "";
  } catch {
    return "";
  }
}
function subscribeSaved(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("explorer-saved", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("explorer-saved", callback);
  };
}
function readSaved(raw: string): string[] {
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data)
      ? data.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}
const featured = [
  "shadcn-button",
  "heroui-tabs",
  "magicui-aurora",
  "react-aria-calendar",
  "daisyui-rating",
  "swiftui-settings",
  "radix-themes-table",
  "fluent-menu",
  "carbon-accordion",
  "chakra-switch",
  "mantine-pricing",
  "mui-login",
  "antd-slider",
  "radix-tabs",
];
async function copy(text: string, success: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(success);
  } catch {
    toast.error("Clipboard unavailable. Select and copy the text instead.");
  }
}

export function Explorer() {
  const search = useSyncExternalStore(subscribeURL, urlSnapshot, empty);
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const query = params.get("q") || "";
  const smart = useSmartSearch(query);
  const library = libraries.some((l) => l.id === params.get("library"))
    ? params.get("library")!
    : "all";
  const category = categories.includes(params.get("category") || "")
    ? params.get("category")!
    : "All components";
  const savedOnly = params.get("saved") === "1";
  const rawSaved = useSyncExternalStore(subscribeSaved, savedSnapshot, empty);
  const saved = useMemo(() => readSaved(rawSaved), [rawSaved]);
  const [selected, setSelected] = useState<Entry | null>(null);
  const [limit, setLimit] = useState(6);
  const input = useRef<HTMLInputElement>(null);
  const look = useMemo(() => appearance(query), [query]);
  const results = useMemo(() => {
    const found = searchCatalog(query, library, category, smart.pattern).filter(
      (e) => !savedOnly || saved.includes(e.id),
    );
    if (!query.trim() && library === "all" && category === "All components")
      found.sort((a, b) => {
        const ai = featured.indexOf(a.id),
          bi = featured.indexOf(b.id);
        return (ai < 0 ? 100 : ai) - (bi < 0 ? 100 : bi);
      });
    return found;
  }, [query, library, category, savedOnly, saved, smart.pattern]);
  const change = (values: Record<string, string>) => {
    updateURL(values);
    setLimit(6);
  };
  const toggleSaved = (id: string) => {
    try {
      localStorage.setItem(
        savedKey,
        JSON.stringify(
          saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id],
        ),
      );
      window.dispatchEvent(new Event("explorer-saved"));
    } catch {
      toast.error("Your browser couldn’t save this component.");
    }
  };
  const [source, setSource] = useState("");
  useEffect(() => {
    let active = true;
    setSource(selected ? "Loading source…" : "");
    if (selected)
      previewSource(selected, look)
        .then((text) => {
          if (active) setSource(text);
        })
        .catch(() => {
          if (active) setSource("Source could not load. Reload and try again.");
        });
    return () => {
      active = false;
    };
  }, [selected, look]);
  return (
    <div className="explorer">
      <a className="explorer-skip" href="#component-results">
        Skip to components
      </a>
      <header className="explorer-header">
        <a href={import.meta.env.BASE_URL} className="explorer-brand">
          <span className="brand-symbol">
            <Layers2 size={22} />
          </span>
          UI Viewer<span className="version-tag">01</span>
        </a>
        <nav aria-label="Main navigation">
          <a
            href="https://github.com/BryanZaneee/ui-viewer"
            target="_blank"
            rel="noreferrer"
          >
            View source <ArrowUpRight size={13} />
          </a>
          <a href="https://bryanzane.com">
            by Bryan Zane <ArrowUpRight size={13} />
          </a>
        </nav>
      </header>
      <div className="explorer-layout">
        <aside className="explorer-sidebar" aria-label="Component filters">
          <div className="sidebar-label">YOUR PLAYGROUND</div>
          <button
            className={!savedOnly ? "side-item active" : "side-item"}
            onClick={() => change({ saved: "" })}
          >
            <Layers2 size={17} />
            Explore components<span>{catalog.length}</span>
          </button>
          <button
            className={savedOnly ? "side-item active" : "side-item"}
            onClick={() => change({ saved: "1" })}
          >
            <Bookmark size={17} />
            Saved collection<span>{saved.length}</span>
          </button>
          <div className="sidebar-label spaced">BROWSE BY TYPE</div>
          {categories.map((c, i) => (
            <button
              key={c}
              aria-pressed={category === c}
              className={`side-item ${category === c ? "selected" : ""}`}
              onClick={() =>
                change({ category: c === "All components" ? "" : c })
              }
            >
              <span className="category-mark">
                {["✳︎", "↗", "▤", "◫", "↔", "◉", "◷", "✧", "▣"][i]}
              </span>
              {c}
            </button>
          ))}
          <div className="sidebar-label spaced">
            THE LIBRARIES <span>{libraries.length}</span>
          </div>
          {libraries.map((l) => (
            <button
              key={l.id}
              aria-pressed={library === l.id}
              className={`side-item library-item ${library === l.id ? "selected" : ""}`}
              onClick={() => change({ library: library === l.id ? "" : l.id })}
            >
              <span className="library-mark" style={{ color: l.color }}>
                {l.id === "swiftui" ? "S" : l.mark}
              </span>
              {l.name}
              <span>{l.platform}</span>
            </button>
          ))}
          <div className="sidebar-note">
            <span className="live-dot" />A little idea. Many possibilities.
            <p>Type it. Try it. Make it yours.</p>
          </div>
        </aside>
        <main className="explorer-main">
          <section className="explorer-hero" aria-labelledby="explorer-heading">
            <div className="hero-eyebrow">
              <span className="live-dot" />
              THE COMPONENT PLAYGROUND
            </div>
            <h1 id="explorer-heading">
              One idea. <br className="mobile-break" />{" "}
              <span>Every possibility.</span>
            </h1>
            <p>
              Describe what you’re imagining. Explore it across your favorite UI
              libraries.
            </p>
            <div className="explorer-search">
              <Search size={23} />
              <label className="sr-only" htmlFor="component-search">
                Describe a component
              </label>
              <input
                ref={input}
                id="component-search"
                value={query}
                maxLength={300}
                onChange={(e) => change({ q: e.target.value })}
                placeholder={
                  "Try “rounded blue buttons” or “SwiftUI settings”…"
                }
                onKeyDown={(e) => {
                  if (e.key === "Escape") change({ q: "" });
                }}
                autoComplete="off"
                spellCheck={false}
              />
              {query ? (
                <button
                  aria-label="Clear search"
                  onClick={() => {
                    change({ q: "" });
                    input.current?.focus();
                  }}
                >
                  <X size={19} />
                </button>
              ) : (
                <span className="search-hint">
                  <Sparkles size={14} />
                  Live preview
                </span>
              )}
            </div>
            {smart.available && (
              <div className="smart-search-row">
                <label>
                  <input
                    type="checkbox"
                    checked={smart.enabled}
                    onChange={smart.toggle}
                  />{" "}
                  Smart search
                </label>
                <span>
                  {smart.enabled
                    ? "Jev matches descriptions through OpenRouter."
                    : "Instant local search only."}
                </span>
                <span role="status">
                  {smart.status === "matching"
                    ? "Finding related components…"
                    : smart.pattern
                      ? "Description matched"
                      : ""}
                </span>
              </div>
            )}
            <div className="suggestions">
              <span>A little inspiration</span>
              {suggestions.slice(0, 4).map((s) => (
                <button
                  key={s}
                  onClick={() =>
                    change({ q: s, category: "", library: "", saved: "" })
                  }
                >
                  {s}
                  <ArrowUpRight size={12} />
                </button>
              ))}
            </div>
          </section>
          <section
            className="results-section"
            id="component-results"
            aria-label="Component results"
          >
            <div className="results-heading">
              <div>
                <h2>
                  {savedOnly
                    ? "Your collection"
                    : query.trim()
                      ? "Taking shape"
                      : "A world of components"}
                  <span aria-live="polite" aria-atomic="true">
                    {results.length}{" "}
                    {results.length === 1 ? "component" : "components"}
                  </span>
                </h2>
                <p>
                  {query.trim()
                    ? "Keep typing. The possibilities change with you."
                    : "Different libraries. Real interactions. Find your starting point."}
                </p>
              </div>
              <button
                className="share-button"
                onClick={() => copy(window.location.href, "Search link copied")}
              >
                <Copy size={14} />
                Share search
              </button>
            </div>
            <div className="library-filters" aria-label="Filter by library">
              <button
                className={library === "all" ? "active" : ""}
                aria-pressed={library === "all"}
                onClick={() => change({ library: "" })}
              >
                All libraries
              </button>
              {libraries.map((l) => (
                <button
                  key={l.id}
                  className={library === l.id ? "active" : ""}
                  aria-pressed={library === l.id}
                  onClick={() => change({ library: l.id })}
                >
                  <span style={{ color: l.color }}>
                    {l.id === "swiftui" ? "S" : l.mark}
                  </span>
                  {l.name}
                </button>
              ))}
            </div>
            {query.trim() && (
              <div className="interpretation">
                <SlidersHorizontal size={13} />
                <span>Live styling</span>
                {look.color && (
                  <span>
                    <i style={{ background: look.color }} />
                    {look.color}
                  </span>
                )}
                {look.radius !== undefined && (
                  <span>{look.radius === 0 ? "Square" : "Rounded"}</span>
                )}
                {look.dark && <span>Dark</span>}
                {look.compact && <span>Compact</span>}
                {look.outline && <span>Outlined</span>}
                {look.label !== "Continue" && <span>“{look.label}”</span>}
                <span className="interpretation-tip">
                  Try a color, “rounded”, “dark”, or a label in quotes.
                </span>
              </div>
            )}
            <div className="component-grid">
              {results.slice(0, limit).map((entry) => (
                <article className="component-tile" key={entry.id}>
                  <div className="tile-top">
                    <span className={`tile-library ${entry.library.id}`}>
                      <span style={{ color: entry.library.color }}>
                        {entry.library.id === "swiftui"
                          ? "S"
                          : entry.library.mark}
                      </span>
                      {entry.library.name}
                    </span>
                    <button
                      aria-label={`${saved.includes(entry.id) ? "Unsave" : "Save"} ${entry.library.name} ${entry.pattern.name}`}
                      aria-pressed={saved.includes(entry.id)}
                      className="save-button"
                      onClick={() => toggleSaved(entry.id)}
                    >
                      <Bookmark
                        size={16}
                        fill={
                          saved.includes(entry.id) ? "currentColor" : "none"
                        }
                      />
                    </button>
                  </div>
                  <Preview entry={entry} appearance={look} />
                  <div className="tile-bottom">
                    <div>
                      <h3>
                        <button onClick={() => setSelected(entry)}>
                          {entry.pattern.name}
                        </button>
                      </h3>
                      <span>
                        {isReference(entry.library.id)
                          ? "Reference link"
                          : entry.library.id === "swiftui"
                            ? "Apple · Browser approximation"
                            : entry.pattern.category}
                      </span>
                    </div>
                    <button
                      className="inspect-button"
                      aria-label={`View ${entry.library.name} ${entry.pattern.name} code`}
                      onClick={() => setSelected(entry)}
                    >
                      <Code2 size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
            {!results.length && (
              <div className="empty-results">
                <Search size={30} />
                <h3>
                  {savedOnly
                    ? "No saved matches yet."
                    : "A new possibility starts here."}
                </h3>
                <p>
                  {savedOnly
                    ? "Bookmark components to keep them in your collection."
                    : "Try “login”, “slider”, “pricing”, or choose a different library."}
                </p>
                <button
                  onClick={() =>
                    change({ q: "", library: "", category: "", saved: "" })
                  }
                >
                  Explore all components <ArrowUpRight size={15} />
                </button>
              </div>
            )}
            {results.length > limit && (
              <button
                className="load-more"
                onClick={() => setLimit((v) => v + 6)}
              >
                Explore more components <ArrowDown size={15} />
                <span>{results.length - limit} more</span>
              </button>
            )}
          </section>
          <footer className="explorer-footer">
            <span>
              <Layers2 size={14} />
              Built for the “what if?”
            </span>
            <span>
              {liveLibraries.length} preview families · {catalog.length} catalog
              entries · Yours to explore
            </span>
            <a
              href="https://github.com/anishfn/shapeshift"
              target="_blank"
              rel="noreferrer"
            >
              Based on Shapeshift <ArrowUpRight size={12} />
            </a>
          </footer>
        </main>
      </div>
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="explorer-inspector max-h-[90dvh] overflow-y-auto sm:max-w-5xl">
          {selected && (
            <>
              <div className="inspector-heading">
                <span className="inspector-eyebrow">
                  {selected.library.name} / {selected.pattern.category}
                </span>
                <DialogTitle className="text-2xl">
                  {selected.pattern.name}
                </DialogTitle>
                <DialogDescription>
                  {selected.pattern.description}{" "}
                  {isReference(selected.library.id)
                    ? "Open the original library to explore these components."
                    : selected.library.id === "swiftui"
                      ? "This is a browser approximation. Run the SwiftUI source in Xcode for native rendering."
                      : selected.library.id === "radix"
                        ? "Radix primitives with custom styling."
                        : "Interactive preview using the actual component library."}
                </DialogDescription>
              </div>
              <div className="inspector-columns">
                <div>
                  <div className="inspector-section-title">
                    <span>LIVE PREVIEW</span>
                    <span>
                      <span className="live-dot" />
                      Interactive
                    </span>
                  </div>
                  <Preview entry={selected} appearance={look} />
                  <button
                    className="inspector-save"
                    onClick={() => toggleSaved(selected.id)}
                  >
                    {saved.includes(selected.id) ? (
                      <Check size={15} />
                    ) : (
                      <Bookmark size={15} />
                    )}{" "}
                    {saved.includes(selected.id)
                      ? "In your collection"
                      : "Save to collection"}
                  </button>
                </div>
                <div>
                  <div className="inspector-section-title">
                    <span>
                      {isReference(selected.library.id)
                        ? "REFERENCE"
                        : selected.library.id === "swiftui"
                          ? "SWIFT STARTER"
                          : [
                                "shadcn",
                                "mui",
                                "mantine",
                                "radix",
                                "antd",
                              ].includes(selected.library.id)
                            ? "TSX STARTER"
                            : "PREVIEW SOURCE"}
                    </span>
                    <button onClick={() => copy(source, "Starter code copied")}>
                      <Copy size={14} />
                      Copy code
                    </button>
                  </div>
                  <pre className="source-code">
                    <code>{source}</code>
                  </pre>
                  <p className="source-note">
                    Source includes sample data. Preview adapters use shared
                    types and styles available in the repository.
                  </p>
                  <details className="setup-details">
                    <summary>Setup instructions</summary>
                    <pre>{selected.library.install}</pre>
                    {selected.library.id === "mantine" && (
                      <p>
                        Wrap your app in MantineProvider and import
                        @mantine/core/styles.css.
                      </p>
                    )}
                    {selected.library.id === "radix" && (
                      <p>
                        Radix primitives are unstyled. Add your own CSS or a
                        design system.
                      </p>
                    )}
                  </details>
                  <a
                    className="docs-link"
                    href={selected.library.docs}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Official {selected.library.name} documentation{" "}
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
              <button
                className="back-to-exploring"
                onClick={() => setSelected(null)}
              >
                <ArrowLeft size={14} />
                Back to exploring
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
