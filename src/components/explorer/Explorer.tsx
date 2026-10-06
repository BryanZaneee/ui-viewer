"use client";
import { useMemo, useRef, useState, useSyncExternalStore } from "react";

import {
  ArrowDown,
  ArrowUpRight,
  Bookmark,
  Copy,
  Layers2,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  appearance,
  catalog,
  categories,
  libraries,
  liveLibraries,
  searchCatalog,
} from "@/lib/explorer/catalog";
import { MotionConfig } from "motion/react";
import { ComponentCard } from "./ComponentCard";
import { describedValues } from "@/lib/explorer/values";
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
  const previewQuery = query;
  const library = libraries.some((l) => l.id === params.get("library"))
    ? params.get("library")!
    : "all";
  const category = categories.includes(params.get("category") || "")
    ? params.get("category")!
    : "All components";
  const savedOnly = params.get("saved") === "1";
  const rawSaved = useSyncExternalStore(subscribeSaved, savedSnapshot, empty);
  const saved = useMemo(() => readSaved(rawSaved), [rawSaved]);
  const [selected, setSelected] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(
    () => !window.matchMedia("(max-width: 760px)").matches,
  );
  const [limit, setLimit] = useState(6);
  const input = useRef<HTMLInputElement>(null);
  const look = useMemo(() => {
    const defaults = appearance("");
    const explicit = Object.fromEntries(
      Object.entries(appearance(query)).filter(
        ([key, value]) =>
          value !== undefined && value !== defaults[key as keyof typeof defaults],
      ),
    );
    // Apply recognizable edits immediately without replacing Jev content with samples.
    return {
      ...appearance(smart.query),
      ...smart.values,
      ...explicit,
      ...describedValues(query),
    };
  }, [query, smart.query, smart.values]);
  const results = useMemo(() => {
    let found = searchCatalog(
      previewQuery,
      library,
      category,
      previewQuery === smart.query ? smart.pattern : null,
    );
    // Incomplete words should not blank the gallery while interpretation catches up.
    if (!found.length && smart.pending)
      found = searchCatalog(smart.query, library, category, smart.pattern);
    found = found.filter((e) => !savedOnly || saved.includes(e.id));
    if (
      !previewQuery.trim() &&
      library === "all" &&
      category === "All components"
    )
      found.sort((a, b) => {
        const ai = featured.indexOf(a.id),
          bi = featured.indexOf(b.id);
        return (ai < 0 ? 100 : ai) - (bi < 0 ? 100 : bi);
      });
    return found;
  }, [
    previewQuery,
    library,
    category,
    savedOnly,
    saved,
    smart.query,
    smart.pattern,
    smart.pending,
  ]);
  const change = (values: Record<string, string>) => {
    setSelected(null);
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
  return (
    <MotionConfig reducedMotion="user">
      <div className={`explorer ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
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
          <aside
            id="component-sidebar"
            className="explorer-sidebar"
            aria-label="Component filters"
            hidden={!sidebarOpen}
          >
            <button
              className={!savedOnly ? "side-item active" : "side-item"}
              onClick={() => change({ saved: "" })}
            >
              <Layers2 size={17} />
              Explore<span>{catalog.length}</span>
            </button>
            <button
              className={savedOnly ? "side-item active" : "side-item"}
              onClick={() => change({ saved: "1" })}
            >
              <Bookmark size={17} />
              Saved<span>{saved.length}</span>
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
          </aside>
          <main className="explorer-main">
            <section
              className="explorer-hero"
              aria-labelledby="explorer-heading"
            >
              <div className="hero-topline">
                <button
                  className="sidebar-toggle"
                  aria-controls="component-sidebar"
                  aria-expanded={sidebarOpen}
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  {sidebarOpen ? (
                    <PanelLeftClose size={17} />
                  ) : (
                    <PanelLeftOpen size={17} />
                  )}
                  <span>{sidebarOpen ? "Hide filters" : "Show filters"}</span>
                </button>
                <span>THE COMPONENT PLAYGROUND</span>
              </div>
              <h1 id="explorer-heading">
                One idea. <br className="mobile-break" />{" "}
                <span>Every possibility.</span>
              </h1>
              <p>
                Describe what you’re imagining. Explore it across your favorite
                UI libraries.
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
            </section>
            <section
              className="results-section"
              id="component-results"
              aria-label="Component results"
              aria-busy={smart.pending}
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
                  onClick={() =>
                    copy(window.location.href, "Search link copied")
                  }
                >
                  <Copy size={14} />
                  Share search
                </button>
              </div>
              <div className="component-grid">
                {results.slice(0, limit).map((entry) => (
                  <ComponentCard
                    key={entry.id}
                    entry={entry}
                    appearance={look}
                    query={previewQuery}
                    expanded={selected === entry.id}
                    onExpand={() => setSelected(entry.id)}
                    onClose={() => setSelected(null)}
                    saved={saved.includes(entry.id)}
                    onSave={() => toggleSaved(entry.id)}
                  />
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
                {liveLibraries.length} preview families · {catalog.length}{" "}
                catalog entries · Yours to explore
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
      </div>
    </MotionConfig>
  );
}
