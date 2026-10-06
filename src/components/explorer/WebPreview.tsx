"use client";
import {
  Accordion,
  Switch,
  Slider,
  Checkbox,
  Select,
  Tabs,
  Progress,
} from "radix-ui";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox as ShadCheckbox } from "@/components/ui/checkbox";
import { Slider as ShadSlider } from "@/components/ui/slider";
import { Progress as ShadProgress } from "@/components/ui/progress";
import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PatternPreview,
  type PreviewProps,
  type Controls,
} from "./PatternPreview";
export default function WebPreview({
  library,
  ...props
}: PreviewProps & { library: "shadcn" | "radix" | "swiftui" }) {
  const native = library === "swiftui";
  const shad = library === "shadcn";
  const c: Controls = {
    button: (label, click, secondary) =>
      shad ? (
        <Button
          className="demo-button"
          variant={
            secondary || props.appearance.outline ? "outline" : "default"
          }
          onClick={click}
          type="button"
        >
          {label}
        </Button>
      ) : (
        <button
          type="button"
          className={`demo-button ${secondary ? "secondary" : ""}`}
          onClick={click}
        >
          {label}
        </button>
      ),
    field: (label, type = "text") => (
      <label className="demo-field">
        <span>{label}</span>
        {shad ? (
          <Input
            aria-label={label}
            type={type}
            placeholder={
              type === "email"
                ? "you@example.com"
                : type === "password"
                  ? "Enter your password"
                  : "Alex Morgan"
            }
          />
        ) : (
          <input
            type={type}
            placeholder={
              type === "email"
                ? "you@example.com"
                : type === "password"
                  ? "Enter your password"
                  : "Alex Morgan"
            }
          />
        )}
      </label>
    ),
    toggle: (label, value, change) => (
      <label className="demo-row between">
        <span>{label}</span>
        {native ? (
          <input
            className="native-switch"
            type="checkbox"
            role="switch"
            checked={value}
            onChange={(e) => change(e.target.checked)}
          />
        ) : (
          <Switch.Root
            className="demo-switch"
            checked={value}
            onCheckedChange={change}
          >
            <Switch.Thumb className="demo-switch-thumb" />
          </Switch.Root>
        )}
      </label>
    ),
    slider: (value, change) =>
      shad ? (
        <ShadSlider
          aria-label="Adjust value"
          value={[value]}
          onValueChange={(v) => change(v[0])}
        />
      ) : native ? (
        <input
          aria-label="Adjust value"
          type="range"
          value={value}
          onChange={(e) => change(+e.target.value)}
        />
      ) : (
        <Slider.Root
          className="demo-slider"
          value={[value]}
          onValueChange={(v) => change(v[0])}
        >
          <Slider.Track className="demo-slider-track">
            <Slider.Range className="demo-slider-range" />
          </Slider.Track>
          <Slider.Thumb
            className="demo-slider-thumb"
            aria-label="Adjust value"
          />
        </Slider.Root>
      ),
    checkbox: (label, checked, change) => (
      <label className="demo-row">
        {shad ? (
          <ShadCheckbox
            checked={checked}
            onCheckedChange={(v) => change(v === true)}
          />
        ) : native ? (
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => change(e.target.checked)}
          />
        ) : (
          <Checkbox.Root
            className="demo-checkbox"
            checked={checked}
            onCheckedChange={(v) => change(v === true)}
          >
            <Checkbox.Indicator>
              <Check size={14} />
            </Checkbox.Indicator>
          </Checkbox.Root>
        )}
        <span>{label}</span>
      </label>
    ),
    select: () =>
      shad ? (
        <ShadSelect defaultValue="Personal">
          <SelectTrigger aria-label="Workspace" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["Personal", "Team", "Studio"].map((x) => (
              <SelectItem value={x} key={x}>
                {x}
              </SelectItem>
            ))}
          </SelectContent>
        </ShadSelect>
      ) : native ? (
        <label className="demo-field">
          Workspace
          <select defaultValue="Personal">
            {["Personal", "Team", "Studio"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
      ) : (
        <Select.Root defaultValue="Personal">
          <Select.Trigger className="demo-select" aria-label="Workspace">
            <Select.Value />
            <Select.Icon>
              <ChevronDown size={14} />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content
              className="explorer-select-menu"
              position="popper"
              sideOffset={5}
            >
              <Select.Viewport>
                {["Personal", "Team", "Studio"].map((x) => (
                  <Select.Item
                    className="explorer-select-item"
                    value={x}
                    key={x}
                  >
                    <Select.ItemText>{x}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      ),
    progress: (value) =>
      shad ? (
        <ShadProgress value={value} aria-label="Progress" />
      ) : native ? (
        <progress max={100} value={value} aria-label="Progress" />
      ) : (
        <Progress.Root
          className="demo-progress"
          value={value}
          aria-label="Progress"
        >
          <Progress.Indicator
            style={{ transform: `translateX(-${100 - value}%)` }}
          />
        </Progress.Root>
      ),
    tabs: (value, change) => (
      <Tabs.Root value={value} onValueChange={change}>
        <Tabs.List className="demo-tabs" aria-label="Views">
          {["Overview", "Activity", "Settings"].map((x) => (
            <Tabs.Trigger value={x} key={x}>
              {x}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {["Overview", "Activity", "Settings"].map((x) => (
          <Tabs.Content value={x} key={x} className="sr-only">
            {x} view
          </Tabs.Content>
        ))}
      </Tabs.Root>
    ),
    alert: () => (
      <div className="demo-alert" role="status">
        <Check size={18} />
        <div>
          <strong>All changes saved</strong>
          <p>You’re ready for what’s next.</p>
        </div>
      </div>
    ),
    accordion: () => (
      <Accordion.Root
        type="single"
        collapsible
        defaultValue="0"
        className="demo-accordion"
      >
        {["Can I make it my own?", "What’s included?", "Where do I start?"].map(
          (x, i) => (
            <Accordion.Item value={String(i)} key={x}>
              <Accordion.Header>
                <Accordion.Trigger>
                  {x}
                  <ChevronDown size={15} />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content>
                <p>
                  {
                    [
                      "Every detail is yours to explore and customize.",
                      "All the essentials for your next great idea.",
                      "Pick a component. Try it. Make something new.",
                    ][i]
                  }
                </p>
              </Accordion.Content>
            </Accordion.Item>
          ),
        )}
      </Accordion.Root>
    ),
  };
  return <PatternPreview {...props} controls={c} />;
}
