import { useId, useState, type CSSProperties } from "react";
import type { PreviewProps } from "./PatternPreview";
import "./daisy.css";
export default function DaisyPreview({ pattern, appearance: a }: PreviewProps) {
  const id = useId();
  const [done, setDone] = useState(false);
  const [tab, setTab] = useState("Overview");
  const [value, setValue] = useState(64);
  return (
    <div
      data-theme={a.dark ? "dark" : "light"}
      className="demo-stack daisy-demo"
      style={
        {
          "--color-primary": a.color || "#6952d5",
          "--radius-field": `${a.radius ?? 8}px`,
        } as CSSProperties
      }
    >
      {pattern === "button" && (
        <>
          <button
            className={`btn btn-primary ${a.outline ? "btn-outline" : ""} ${a.compact ? "btn-sm" : ""}`}
            onClick={() => setDone(!done)}
          >
            {done ? "Done!" : a.label}
          </button>
          <button className="btn btn-soft">Secondary</button>
          <button className="btn btn-ghost">Quiet action</button>
        </>
      )}
      {pattern === "input" && (
        <>
          <label className="input">
            <span>Name</span>
            <input placeholder="Alex Morgan" />
          </label>
          <label className="input">
            <span>Email</span>
            <input type="email" placeholder="you@example.com" />
          </label>
        </>
      )}
      {pattern === "switch" && (
        <label className="demo-row between">
          Notifications
          <input
            type="checkbox"
            className="toggle toggle-primary"
            defaultChecked
          />
        </label>
      )}
      {pattern === "rating" && (
        <>
          <strong>How did we do?</strong>
          <div className="rating rating-lg">
            {[1, 2, 3, 4, 5].map((n) => (
              <input
                key={n}
                type="radio"
                name={id}
                aria-label={`${n} star${n === 1 ? "" : "s"}`}
                className="mask mask-star-2 bg-orange-500"
                defaultChecked={n === 4}
              />
            ))}
          </div>
          <span className="demo-muted">Select a star to leave a rating.</span>
        </>
      )}
      {pattern === "progress" && (
        <>
          <div
            className="radial-progress"
            role="progressbar"
            aria-label="Project progress"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ "--value": value } as CSSProperties}
          >
            {value}%
          </div>
          <progress
            className="progress progress-primary"
            value={value}
            max="100"
            aria-label="Project progress"
          />
          <button
            className="btn btn-sm"
            onClick={() =>
              setValue(value >= 100 ? 0 : Math.min(value + 12, 100))
            }
          >
            Keep going
          </button>
        </>
      )}
      {pattern === "accordion" &&
        ["Make it yours", "What is included?", "Where do I start?"].map(
          (x, i) => (
            <details
              className="collapse collapse-arrow bg-base-200"
              key={x}
              open={i === 0 ? true : undefined}
            >
              <summary className="collapse-title">{x}</summary>
              <div className="collapse-content">
                All the essentials for your next idea.
              </div>
            </details>
          ),
        )}
      {pattern === "tabs" && (
        <>
          <div role="tablist" aria-label="Views" className="tabs tabs-box">
            {["Overview", "Activity", "Settings"].map((x) => (
              <button
                role="tab"
                aria-selected={tab === x}
                key={x}
                className={`tab ${tab === x ? "tab-active" : ""}`}
                onClick={() => setTab(x)}
              >
                {x}
              </button>
            ))}
          </div>
          <div role="tabpanel">{tab}: your workspace at a glance.</div>
        </>
      )}
      {pattern === "badge" && (
        <div className="demo-row">
          <span className="badge badge-success">Published</span>
          <span className="badge badge-primary">In progress</span>
          <span className="badge badge-outline">Draft</span>
        </div>
      )}
      {pattern === "table" && (
        <table className="table table-zebra">
          <caption>Project team</caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Alex", "Designer"],
              ["Sam", "Developer"],
              ["Jordan", "Creator"],
            ].map(([name, role]) => (
              <tr key={name}>
                <td>{name}</td>
                <td>{role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
