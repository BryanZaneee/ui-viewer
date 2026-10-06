"use client";
import {
  MantineProvider,
  Button,
  TextInput,
  Switch,
  Slider,
  Checkbox,
  Select,
  Progress,
  SegmentedControl,
  Alert,
  Accordion,
} from "@mantine/core";
import "@mantine/core/styles.css";
import {
  PatternPreview,
  type PreviewProps,
  type Controls,
} from "./PatternPreview";
export default function MantinePreview(props: PreviewProps) {
  const a = props.appearance;
  const c: Controls = {
    button: (label, click, secondary) => (
      <Button
        color={a.color || "#176dab"}
        radius={a.radius}
        size={a.compact ? "xs" : "sm"}
        variant={secondary || a.outline ? "outline" : "filled"}
        onClick={click}
      >
        {label}
      </Button>
    ),
    field: (label, type) => (
      <TextInput
        label={label}
        type={type}
        placeholder={type === "email" ? "you@example.com" : "Type something…"}
        radius={a.radius}
      />
    ),
    toggle: (label, value, change) => (
      <Switch
        label={label}
        labelPosition="left"
        styles={{ body: { justifyContent: "space-between" } }}
        checked={value}
        onChange={(e) => change(e.target.checked)}
        color={a.color || "#176dab"}
      />
    ),
    slider: (value, change) => (
      <Slider
        value={value}
        onChange={change}
        color={a.color || "#176dab"}
        aria-label="Adjust value"
      />
    ),
    checkbox: (label, value, change) => (
      <Checkbox
        label={label}
        checked={value}
        onChange={(e) => change(e.target.checked)}
        color={a.color || "#176dab"}
      />
    ),
    select: () => (
      <Select
        label="Workspace"
        defaultValue="Personal"
        data={["Personal", "Team", "Studio"]}
        allowDeselect={false}
      />
    ),
    progress: (value) => (
      <Progress
        value={value}
        color={a.color || "#176dab"}
        aria-label="Progress"
      />
    ),
    tabs: (value, change) => (
      <SegmentedControl
        value={value}
        onChange={change}
        data={["Overview", "Activity", "Settings"]}
        fullWidth
        size="xs"
      />
    ),
    alert: () => (
      <Alert title="All changes saved" color="green">
        You’re ready for what’s next.
      </Alert>
    ),
    accordion: () => (
      <Accordion defaultValue="0">
        {["Can I make it my own?", "What’s included?", "Where do I start?"].map(
          (x, i) => (
            <Accordion.Item value={String(i)} key={x}>
              <Accordion.Control>{x}</Accordion.Control>
              <Accordion.Panel>
                Every detail is yours to explore and customize.
              </Accordion.Panel>
            </Accordion.Item>
          ),
        )}
      </Accordion>
    ),
  };
  return (
    <MantineProvider
      forceColorScheme={a.dark ? "dark" : "light"}
      withCssVariables={false}
      withGlobalClasses={false}
      getRootElement={() => undefined}
      theme={{ fontFamily: "inherit" }}
    >
      <PatternPreview {...props} controls={c} />
    </MantineProvider>
  );
}
