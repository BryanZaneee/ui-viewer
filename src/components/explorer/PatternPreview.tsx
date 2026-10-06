import { defaultItems } from "@/lib/explorer/values";
("use client");
import { useEffect, useState, type ReactNode } from "react";
import { Check, ArrowUpRight, Sparkles } from "lucide-react";
import type { Appearance, Pattern } from "@/lib/explorer/catalog";
export type PreviewProps = { pattern: Pattern; appearance: Appearance };
export type Controls = {
  button: (label: string, click: () => void, secondary?: boolean) => ReactNode;
  field: (label: string, type?: string) => ReactNode;
  toggle: (
    label: string,
    value: boolean,
    change: (value: boolean) => void,
  ) => ReactNode;
  slider: (value: number, change: (value: number) => void) => ReactNode;
  checkbox: (
    label: string,
    checked: boolean,
    change: (value: boolean) => void,
  ) => ReactNode;
  select: () => ReactNode;
  progress: (value: number) => ReactNode;
  tabs: (value: string, change: (value: string) => void) => ReactNode;
  alert: () => ReactNode;
  accordion: () => ReactNode;
};
export function PatternPreview({
  pattern,
  appearance: a,
  controls: c,
}: PreviewProps & { controls: Controls }) {
  const [enabled, setEnabled] = useState(true);
  const [value, setValue] = useState(a.value ?? 64);
  const [tab, setTab] = useState(a.items?.[0] ?? "Overview");
  const [checked, setChecked] = useState<Record<number, boolean>>({ 0: true });
  useEffect(() => {
    setValue(a.value ?? 64);
  }, [a.value]);
  const [action, setAction] = useState(false);
  const button = (label = a.label, secondary = false) =>
    c.button(action ? "Done!" : label, () => setAction(!action), secondary);
  const toggle = (label = "Notifications") =>
    c.toggle(label, enabled, setEnabled);
  const checklist = () => (
    <div className="demo-stack">
      {(a.items ?? defaultItems).map((label, i) => (
        <div key={i}>
          {c.checkbox(label, checked[i] ?? false, (v) =>
            setChecked((old) => ({ ...old, [i]: v })),
          )}
        </div>
      ))}
    </div>
  );
  switch (pattern) {
    case "button":
      return (
        <div className="demo-stack demo-center">
          <div className="demo-eyebrow">MAKE YOUR NEXT MOVE</div>
          {button()}
          <div className="demo-row">
            {button("Secondary", true)}
            {c.button("Reset", () => setAction(false), true)}
          </div>
        </div>
      );
    case "input":
      return (
        <div className="demo-stack">
          {c.field("Your name")}
          {c.field("Email address", "email")}
        </div>
      );
    case "switch":
      return (
        <div className="demo-stack">
          {toggle()}
          {c.toggle("Focus mode", !enabled, (v) => setEnabled(!v))}
          <p className="demo-muted">
            {enabled ? "You’re all caught up." : "A little peace and quiet."}
          </p>
        </div>
      );
    case "slider":
      return (
        <div className="demo-stack">
          <div className="demo-row between">
            <span>Volume</span>
            <strong>{value}%</strong>
          </div>
          {c.slider(value, setValue)}
          <div className="demo-row between demo-muted">
            <span>Quiet</span>
            <span>A little louder</span>
          </div>
        </div>
      );
    case "checkbox":
      return checklist();
    case "select":
      return (
        <div className="demo-stack">
          <strong>Your workspace</strong>
          <p className="demo-muted">Good things start with the right space.</p>
          {c.select()}
        </div>
      );
    case "progress":
      return (
        <div className="demo-stack">
          <div className="demo-row between">
            <strong>Making progress</strong>
            <span>{value}%</span>
          </div>
          {c.progress(value)}
          {c.button(
            value === 100 ? "Start again" : "Keep going",
            () => setValue(value >= 100 ? 0 : Math.min(100, value + 12)),
            true,
          )}
        </div>
      );
    case "tabs":
      return (
        <div className="demo-stack">
          {c.tabs(tab, setTab)}
          <div className="demo-tab-content">
            <strong>{tab}</strong>
            <p className="demo-muted">
              {tab === "Overview"
                ? "Everything you need, in one place."
                : tab === "Activity"
                  ? "Your latest work is looking good."
                  : "A space that works the way you do."}
            </p>
          </div>
        </div>
      );
    case "alert":
      return (
        <div className="demo-stack">
          {c.alert()}
          <p className="demo-muted">A little reassurance goes a long way.</p>
        </div>
      );
    case "accordion":
      return <div>{c.accordion()}</div>;
    case "login":
      return (
        <form
          className="demo-stack"
          onSubmit={(e) => {
            e.preventDefault();
            setAction(true);
          }}
        >
          <div>
            <strong className="demo-title">
              {a.title ? "" : "Welcome back."}
            </strong>
            <p className="demo-muted">Your next idea is waiting.</p>
          </div>
          {c.field("Email address", "email")}
          {c.field("Password", "password")}
          {button(a.label === "Continue" ? "Sign in" : a.label)}
          <span className="demo-muted demo-small">
            Interactive demo · No account required
          </span>
        </form>
      );
    case "pricing":
      return (
        <div className="demo-stack">
          <div className="demo-row between">
            <span className="demo-eyebrow">
              {a.title ? "" : "THE CREATOR PLAN"}
            </span>
            <Sparkles size={17} />
          </div>
          <div>
            <strong className="demo-price">${a.amount ?? 24}</strong>
            <span className="demo-muted"> / month</span>
          </div>
          <p className="demo-muted">A little more room to create.</p>
          <div className="demo-stack demo-small">
            {(
              a.items ?? [
                "Unlimited possibilities",
                "Your own workspace",
                "Every detail, yours",
              ]
            ).map((t) => (
              <span className="demo-row" key={t}>
                <Check size={14} />
                {t}
              </span>
            ))}
          </div>
          {button(a.label === "Continue" ? "Get started" : a.label)}
        </div>
      );
    case "settings":
      return (
        <div className="demo-stack">
          <strong className="demo-title">
            {a.title ? "" : "Make yourself at home."}
          </strong>
          {toggle("Email notifications")}
          <div className="demo-divider" />
          {c.select()}
          <div className="demo-row between">
            <span className="demo-small">Display brightness</span>
            <span>{value}%</span>
          </div>
          {c.slider(value, setValue)}
        </div>
      );
    case "dashboard":
      return (
        <div className="demo-stack">
          <div className="demo-row between">
            <span className="demo-muted">Total projects</span>
            <ArrowUpRight size={17} />
          </div>
          <div className="demo-row">
            <strong className="demo-price">{a.amount ?? 128}</strong>
            <span className="demo-growth">+24.8%</span>
          </div>
          <div
            className="demo-chart"
            aria-label="Projects increased over six months"
            role="img"
          >
            {[32, 49, 40, 66, 58, 82, 74, 100].map((h, i) => (
              <span key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
          {c.progress(value)}
          {c.button(
            "Add a project",
            () => setValue(Math.min(100, value + 5)),
            true,
          )}
        </div>
      );
  }
}
