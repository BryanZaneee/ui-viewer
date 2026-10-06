"use client";
import {
  ConfigProvider,
  theme,
  Button,
  Input,
  Switch,
  Slider,
  Checkbox,
  Select,
  Progress,
  Segmented,
  Alert,
  Collapse,
} from "antd";
import {
  PatternPreview,
  type PreviewProps,
  type Controls,
} from "./PatternPreview";
export default function AntPreview(props: PreviewProps) {
  const a = props.appearance;
  const c: Controls = {
    button: (label, click, secondary) => (
      <Button
        type={secondary || a.outline ? "default" : "primary"}
        onClick={click}
      >
        {label}
      </Button>
    ),
    field: (label, type) => (
      <label className="demo-field">
        <span>{label}</span>
        <Input
          type={type}
          placeholder={type === "email" ? "you@example.com" : "Type something…"}
        />
      </label>
    ),
    toggle: (label, value, change) => (
      <label className="demo-row between">
        <span>{label}</span>
        <Switch checked={value} onChange={change} />
      </label>
    ),
    slider: (value, change) => (
      <Slider
        value={value}
        onChange={change}
        ariaLabelForHandle="Adjust value"
      />
    ),
    checkbox: (label, value, change) => (
      <Checkbox checked={value} onChange={(e) => change(e.target.checked)}>
        {label}
      </Checkbox>
    ),
    select: () => (
      <Select
        aria-label="Workspace"
        defaultValue={a.items?.[0] ?? "Personal"}
        style={{ width: "100%" }}
        options={(a.items ?? ["Personal", "Team", "Studio"]).map((value) => ({
          value,
          label: value,
        }))}
      />
    ),
    progress: (value) => (
      <Progress percent={value} strokeColor={a.color || "#1261c0"} />
    ),
    tabs: (value, change) => (
      <Segmented
        block
        value={value}
        onChange={(v) => change(String(v))}
        options={a.items ?? ["Overview", "Activity", "Settings"]}
      />
    ),
    alert: () => (
      <Alert
        title="All changes saved"
        description="You’re ready for what’s next."
        type="success"
        showIcon
      />
    ),
    accordion: () => (
      <Collapse
        defaultActiveKey={["0"]}
        accordion
        items={(
          a.items ?? [
            "Can I make it my own?",
            "What’s included?",
            "Where do I start?",
          ]
        ).map((label, i) => ({
          key: String(i),
          label,
          children: "Every detail is yours to explore and customize.",
        }))}
      />
    ),
  };
  return (
    <ConfigProvider
      theme={{
        algorithm: a.dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: a.color || "#1261c0",
          borderRadius: a.radius ?? 6,
          fontFamily: "inherit",
        },
      }}
      componentSize={a.compact ? "small" : "middle"}
    >
      <PatternPreview {...props} controls={c} />
    </ConfigProvider>
  );
}
