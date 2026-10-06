import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Bookmark, Code2, Copy, Dice5, RotateCcw, X, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  isReference,
  type Appearance,
  type Entry,
} from "@/lib/explorer/catalog";
import {
  defaultItems,
  itemPatterns,
  percentPatterns,
  randomized,
} from "@/lib/explorer/values";
import { previewSource } from "@/lib/explorer/preview-source";
import { Preview } from "./Preview";

type Props = {
  entry: Entry;
  entranceIndex?: number;
  appearance: Appearance;
  query: string;
  expanded: boolean;
  onExpand: () => void;
  onClose: () => void;
  saved: boolean;
  onSave: () => void;
};
export function ComponentCard({
  entry,
  entranceIndex = 0,
  appearance,
  query,
  expanded,
  onExpand,
  onClose,
  saved,
  onSave,
}: Props) {
  const reducedMotion = useReducedMotion();
  const [edit, setEdit] = useState<{
    query: string;
    values: Partial<Appearance>;
  }>({ query, values: {} });
  const a = { ...appearance, ...(edit.query === query ? edit.values : {}) };
  const update = (values: Partial<Appearance>) =>
    setEdit((old) => ({
      query,
      values: { ...(old.query === query ? old.values : {}), ...values },
    }));
  const [source, setSource] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const sourceKey = JSON.stringify(a);
  const reference = isReference(entry.library.id);
  const pattern = entry.pattern.id;
  const originalFamily = [
    "shadcn",
    "swiftui",
    "mui",
    "mantine",
    "radix",
    "antd",
  ].includes(entry.library.id);
  const contentDefaults: Record<string, string[]> = {
    checkbox: defaultItems,
    tabs: ["Overview", "Activity", "Settings"],
    select: ["Personal", "Team", "Studio"],
    pricing: [
      "Unlimited possibilities",
      "Your own workspace",
      "Every detail, yours",
    ],
    accordion: originalFamily
      ? ["Can I make it my own?", "What’s included?", "Where do I start?"]
      : ["Make it yours", "What is included?", "Where do I start?"],
    autocomplete: ["React", "Vue", "Svelte", "Angular", "Solid"],
    marquee: ["Design", "Build", "Explore", "Create"],
    table: ["Alex", "Sam", "Jordan"],
    menu: ["Edit project", "Duplicate", "Archive"],
  };
  const items = a.items ?? contentDefaults[pattern] ?? defaultItems;
  const displayedLabel =
    a.label === "Continue"
      ? ((
          {
            login: "Sign in",
            pricing: "Get started",
            aurora: "Make it magical.",
            dialog: "Edit profile",
          } as Record<string, string>
        )[pattern] ?? a.label)
      : a.label;
  const close = () => {
    onClose();
    requestAnimationFrame(() =>
      trigger.current?.focus({ preventScroll: true }),
    );
  };
  useEffect(() => {
    if (expanded) closeButton.current?.focus({ preventScroll: true });
  }, [expanded]);
  useEffect(() => {
    if (!expanded) return;
    let active = true;
    setSource("Loading source…");
    previewSource(entry, JSON.parse(sourceKey))
      .then((text) => {
        if (active) setSource(text);
      })
      .catch(() => {
        if (active) setSource("Source could not load. Please try again.");
      });
    return () => {
      active = false;
    };
  }, [expanded, entry, sourceKey]);
  const range = (
    label: string,
    key: "radius" | "spacing" | "scale" | "value" | "amount",
    min: number,
    max: number,
    fallback: number,
    unit = "",
    step = 1,
  ) => (
    <label className="editor-range">
      <span>
        {label}
        <span className="editor-value" aria-hidden="true">
          {key === "scale"
            ? Math.round((a[key] ?? fallback) * 100)
            : (a[key] ?? fallback)}
          {unit}
        </span>
      </span>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={a[key] ?? fallback}
        onChange={(e) => update({ [key]: +e.target.value })}
      />
    </label>
  );
  return (
    <motion.article
      layout="position"
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        layout: { type: "spring", stiffness: 320, damping: 34 },
        opacity: { duration: 0.22, delay: reducedMotion ? 0 : entranceIndex * 0.035 },
        y: { duration: 0.28, delay: reducedMotion ? 0 : entranceIndex * 0.035 },
      }}
      className={`component-tile ${expanded ? "is-expanded" : ""}`}
      onKeyDown={(e) => {
        if (e.key === "Escape" && expanded) {
          e.stopPropagation();
          close();
        }
      }}
    >
      <div className="tile-top">
        <span className="tile-library">
          <span style={{ color: entry.library.color }}>
            {entry.library.mark}
          </span>
          {entry.library.name}
        </span>
        <div className="card-actions">
          <button
            className="save-button"
            aria-label={`${saved ? "Unsave" : "Save"} ${entry.library.name} ${entry.pattern.name}`}
            aria-pressed={saved}
            onClick={onSave}
          >
            <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
          </button>
          {expanded && (
            <button
              ref={closeButton}
              className="save-button"
              aria-label="Collapse component"
              onClick={close}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
      <div className="card-workbench">
        <div className="card-preview">
          <div inert={!expanded && !reference ? true : undefined}>
            <Preview entry={entry} appearance={a} />
          </div>
          {!expanded && !reference && (
            <button
              ref={trigger}
              className="preview-open"
              aria-label={`Customize ${entry.library.name} ${entry.pattern.name}`}
              aria-expanded={false}
              onClick={onExpand}
            >
              <span>
                <Code2 size={14} /> Customize
              </span>
            </button>
          )}
          {expanded && entry.library.id === "swiftui" && (
            <p className="preview-caption">
              Browser approximation · Native SwiftUI starter below
            </p>
          )}
        </div>
        <AnimatePresence initial={false}>
          {expanded && !reference && (
            <motion.section
              className="component-controls"
              aria-label="Customize component"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.24 }}
            >
              <div className="editor-toolbar">
                <strong>Make it yours</strong>
                <div>
                  <button onClick={() => update(randomized(a, pattern))}>
                    <Dice5 size={14} />
                    Randomize
                  </button>
                  <button
                    aria-label="Reset customizations"
                    title="Reset to your description"
                    onClick={() => setEdit({ query, values: {} })}
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>
              <div className="editor-fields">
                <label className="editor-color">
                  Accent
                  <input
                    type="color"
                    value={a.color || entry.library.color}
                    onChange={(e) => update({ color: e.target.value })}
                  />
                </label>
                {[
                  "button",
                  "input",
                  "login",
                  "pricing",
                  "select",
                  "dialog",
                ].includes(pattern) &&
                  range("Corners", "radius", 0, 32, 6, "px")}
                {range("Spacing", "spacing", 4, 32, a.compact ? 10 : 16, "px")}
                {range("Scale", "scale", 0.7, 1.3, 1, "%", 0.05)}
                {percentPatterns.has(pattern) &&
                  range("Value", "value", 0, 100, 64, "%")}
                {pattern === "rating" && (
                  <label className="editor-range">
                    <span>
                      Stars
                      <span className="editor-value" aria-hidden="true">
                        {Math.max(1, Math.round((a.value ?? 80) / 20))} / 5
                      </span>
                    </span>
                    <input
                      aria-label="Stars"
                      type="range"
                      min={1}
                      max={5}
                      value={Math.max(1, Math.round((a.value ?? 80) / 20))}
                      onChange={(e) => update({ value: +e.target.value * 20 })}
                    />
                  </label>
                )}
                {["pricing", "ticker", "dashboard"].includes(pattern) &&
                  range(
                    pattern === "pricing" ? "Price ($)" : "Count",
                    "amount",
                    0,
                    pattern === "pricing" ? 500 : 10000,
                    pattern === "pricing"
                      ? 24
                      : pattern === "dashboard"
                        ? 128
                        : 1280,
                  )}
                <div className="editor-toggles">
                  {(
                    [
                      ["dark", "Dark"],
                      ["compact", "Compact"],
                      ["outline", "Outline"],
                    ] as const
                  )
                    .filter(
                      ([key]) =>
                        key !== "outline" ||
                        ["button", "login", "pricing"].includes(pattern),
                    )
                    .map(([key, label]) => (
                      <label key={key}>
                        <input
                          type="checkbox"
                          checked={a[key]}
                          onChange={(e) => update({ [key]: e.target.checked })}
                        />
                        {label}
                      </label>
                    ))}
                </div>
                <label className="editor-text">
                  Heading
                  <input
                    value={a.title ?? ""}
                    maxLength={80}
                    placeholder="Add a heading…"
                    onChange={(e) => update({ title: e.target.value })}
                  />
                </label>
                {["button", "login", "pricing", "aurora", "dialog"].includes(
                  pattern,
                ) && (
                  <label className="editor-text">
                    {pattern === "aurora" ? "Text" : "Button label"}
                    <input
                      value={displayedLabel}
                      maxLength={60}
                      onChange={(e) => update({ label: e.target.value })}
                    />
                  </label>
                )}
                {itemPatterns.has(pattern) && (
                  <div className="editor-items">
                    <span>
                      Content <small>One item per row</small>
                    </span>
                    {items.map((item, i) => (
                      <div key={i}>
                        <input
                          aria-label={`Item ${i + 1}`}
                          value={item}
                          maxLength={80}
                          onChange={(e) =>
                            update({
                              items: items.map((x, n) =>
                                n === i ? e.target.value || " " : x,
                              ),
                            })
                          }
                        />
                        <button
                          aria-label={`Remove item ${i + 1}`}
                          disabled={items.length <= 1}
                          onClick={() =>
                            update({ items: items.filter((_, n) => n !== i) })
                          }
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                    {items.length < 8 && (
                      <button
                        onClick={() =>
                          update({ items: [...items, "New item"] })
                        }
                      >
                        <Plus size={13} />
                        Add item
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
      <div className="tile-bottom">
        <div>
          <h3>
            <button
              onClick={expanded ? close : onExpand}
              aria-expanded={expanded}
            >
              {entry.pattern.name}
            </button>
          </h3>
          <span>
            {entry.pattern.category} · {reference
              ? "Reference link"
              : entry.library.id === "swiftui"
                ? "Apple · Browser approximation"
                : "Interactive preview"}
          </span>
        </div>
        <button
          className="inspect-button"
          aria-label={`View ${entry.library.name} ${entry.pattern.name} code`}
          onClick={expanded ? close : onExpand}
        >
          <Code2 size={16} />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            className="card-code"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="editor-toolbar">
              <strong>
                {reference ? "Library reference" : entry.library.id === "swiftui"
                  ? "SwiftUI starter"
                  : "Component code"}
              </strong>
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(source);
                    toast.success("Code copied");
                  } catch {
                    toast.error("Select and copy the code instead.");
                  }
                }}
              >
                <Copy size={14} />
                Copy code
              </button>
            </div>
            <pre
              className="source-code"
              tabIndex={0}
              aria-label="Component source code"
            >
              <code>{source}</code>
            </pre>
            <div className="code-footer">
              <details className="setup-details">
                <summary>Setup instructions</summary>
                <pre>{entry.library.install}</pre>
              </details>
              <a href={entry.library.docs} target="_blank" rel="noreferrer">
                Library documentation ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
