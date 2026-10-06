import type { Appearance, Entry, Pattern } from "./catalog";

/** Small, editable starters. Never execute code or imports supplied by a search. */
export function sourceFor(entry: Entry, a: Appearance): string {
  const lib = entry.library.id;
  const text = JSON.stringify(a.label);
  if (lib === "swiftui") {
    const views: Partial<Record<Pattern, string>> = {
      button: `Button(${text}) { enabled.toggle() }\n    .buttonStyle(.borderedProminent)\nButton("Secondary") { enabled.toggle() }\n    .buttonStyle(.bordered)`,
      input:
        'TextField("Your name", text: $name)\nTextField("Email address", text: $email)\n    .textContentType(.emailAddress)',
      switch: 'Toggle("Notifications", isOn: $enabled)',
      slider:
        'Text("Volume: \\(Int(value))%")\nSlider(value: $value, in: 0...100)',
      checkbox: `ForEach(items.indices, id: \\.self) { index in\n    Toggle(items[index], isOn: Binding(\n        get: { selected.contains(index) },\n        set: { if $0 { selected.insert(index) } else { selected.remove(index) } }\n    ))\n}`,
      select:
        'Picker("Workspace", selection: $selection) {\n    Text("Personal").tag("Personal")\n    Text("Team").tag("Team")\n    Text("Studio").tag("Studio")\n}',
      progress:
        'Text("Progress: \\(Int(value))%")\nProgressView(value: value, total: 100)\nButton("Keep going") { value = min(100, value + 12) }',
      tabs: 'Picker("View", selection: $tab) {\n    Text("Overview").tag("Overview")\n    Text("Activity").tag("Activity")\n    Text("Settings").tag("Settings")\n}\n.pickerStyle(.segmented)\nText(tab)',
      alert:
        'Label("All changes saved", systemImage: "checkmark.circle.fill")\n    .foregroundStyle(.green)\nText("You’re ready for what’s next.")\n    .font(.caption)',
      accordion:
        'DisclosureGroup("Can I make it my own?") {\n    Text("Every detail is yours to explore and customize.")\n}\nDisclosureGroup("What’s included?") {\n    Text("All the essentials for your next idea.")\n}',
      login: `Text("Welcome back.").font(.title2.bold())\nTextField("Email address", text: $email)\n    .textContentType(.emailAddress)\nSecureField("Password", text: $password)\nButton(${a.label === "Continue" ? '"Sign in"' : text}) {\n    // Connect your authentication flow here.\n}\n.buttonStyle(.borderedProminent)`,
      pricing: `Text("The creator plan").font(.headline)\nText("$24 / month").font(.largeTitle.bold())\nLabel("Unlimited possibilities", systemImage: "checkmark")\nLabel("Your own workspace", systemImage: "checkmark")\nButton(${a.label === "Continue" ? '"Get started"' : text}) {\n    // Connect your checkout here.\n}\n.buttonStyle(.borderedProminent)`,
      settings:
        'Text("Make yourself at home.").font(.headline)\nToggle("Email notifications", isOn: $enabled)\nPicker("Workspace", selection: $selection) {\n    Text("Personal").tag("Personal")\n    Text("Team").tag("Team")\n}\nText("Brightness: \\(Int(value))%")\nSlider(value: $value, in: 0...100)',
      dashboard:
        'Text("Total projects").font(.caption)\nText("128").font(.largeTitle.bold())\nText("+24.8%").foregroundStyle(.green)\nProgressView(value: value, total: 100)\nButton("Add a project") { value = min(100, value + 5) }',
    };
    if (a.items?.length) {
      views.select =
        'Picker("Workspace", selection: $selection) {\n    ForEach(items, id: \\.self) { Text($0).tag($0) }\n}';
      views.tabs =
        'Picker("View", selection: $tab) {\n    ForEach(items, id: \\.self) { Text($0).tag($0) }\n}\n.pickerStyle(.segmented)\nText(tab)';
      views.accordion =
        'ForEach(items, id: \\.self) { item in\n    DisclosureGroup(item) { Text("Every detail is yours to customize.") }\n}';
      views.pricing = `Text("$${a.amount ?? 24} / month").font(.largeTitle.bold())\nForEach(items, id: \\.self) { Label($0, systemImage: "checkmark") }\nButton(${a.label === "Continue" ? '"Get started"' : text}) {}.buttonStyle(.borderedProminent)`;
    }
    const rgb = (a.color || "#007aff")
      .slice(1)
      .match(/../g)!
      .map((h) => (parseInt(h, 16) / 255).toFixed(3));
    return `import SwiftUI\n\nstruct ComponentDemo: View {\n    @State private var enabled = true\n    @State private var checked = false\n    @State private var selected: Set<Int> = [0]\n    private let items = [${(a.items ?? ["Explore the possibilities", "Make it your own", "Ship something great"]).map((x) => JSON.stringify(x)).join(", ")}]\n    @State private var value = ${a.value ?? 64}.0\n    @State private var name = ""\n    @State private var email = ""\n    @State private var password = ""\n    @State private var selection = ${JSON.stringify(a.items?.[0] ?? "Personal")}\n    @State private var tab = ${JSON.stringify(a.items?.[0] ?? "Overview")}\n\n    var body: some View {\n        VStack(alignment: .leading, spacing: ${a.spacing ?? (a.compact ? 10 : 16)}) {\n${(
      (a.title ? `Text(${JSON.stringify(a.title)}).font(.headline)\n` : "") +
      (views[entry.pattern.id] ?? "")
        .replace("$24", `$${a.amount ?? 24}`)
        .replace('Text("128")', `Text("${a.amount ?? 128}")`)
    )
      .split("\n")
      .map((l) => `            ${l}`)
      .join(
        "\n",
      )}\n        }\n        .padding(24)\n        .scaleEffect(${a.scale ?? 1})\n        .controlSize(.${a.compact ? "small" : "regular"})\n        .tint(Color(red: ${rgb[0]}, green: ${rgb[1]}, blue: ${rgb[2]}))\n        .preferredColorScheme(.${a.dark ? "dark" : "light"})\n    }\n}\n\n#Preview { ComponentDemo() }`;
  }
  const imports: Record<string, string> = {
    shadcn:
      'import { Button } from "@/components/ui/button";\nimport { Input } from "@/components/ui/input";\nimport { Checkbox } from "@/components/ui/checkbox";\nimport { Slider } from "@/components/ui/slider";\nimport { Progress } from "@/components/ui/progress";\nimport { Switch } from "@/components/ui/switch";\nimport { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";\nimport { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";\nimport { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";',
    mui: 'import { Button, TextField, Switch, Slider, Checkbox, LinearProgress, Tabs, Tab, Alert, Accordion, AccordionSummary, AccordionDetails, MenuItem } from "@mui/material";',
    mantine:
      'import { MantineProvider, Button, TextInput, Switch, Slider, Checkbox, Select, Progress, SegmentedControl, Alert, Accordion } from "@mantine/core";\nimport "@mantine/core/styles.css";',
    antd: 'import { ConfigProvider, Button, Input, Switch, Slider, Checkbox, Select, Progress, Segmented, Alert, Collapse } from "antd";',
    radix:
      'import { Switch, Slider, Checkbox, Select, Progress, Tabs, Accordion } from "radix-ui";',
  };
  const style = `style={{ ${a.color ? `backgroundColor: ${JSON.stringify(a.color)}, color: "white", ` : ""}borderRadius: ${a.radius ?? 6} }}`;
  const button = (label: string) =>
    lib === "radix"
      ? `<button onClick={() => setEnabled(!enabled)} ${style}>${label}</button>`
      : `<Button ${lib === "mui" ? `variant="${a.outline ? "outlined" : "contained"}"` : lib === "antd" ? 'type="primary"' : lib === "shadcn" && a.outline ? 'variant="outline"' : ""} onClick={() => setEnabled(!enabled)} ${style}>${label}</Button>`;
  const field = (label: string, type = "text") =>
    lib === "mui"
      ? `<TextField label="${label}" type="${type}" size="small" />`
      : lib === "mantine"
        ? `<TextInput label="${label}" type="${type}" />`
        : lib === "radix"
          ? `<label>${label}<input type="${type}" /></label>`
          : `<label>${label}<Input type="${type}" /></label>`;
  const toggle =
    lib === "radix"
      ? '<Switch.Root checked={enabled} onCheckedChange={setEnabled} aria-label="Notifications"><Switch.Thumb /></Switch.Root>'
      : lib === "shadcn"
        ? '<Switch checked={enabled} onCheckedChange={setEnabled} aria-label="Notifications" />'
        : lib === "antd"
          ? '<Switch checked={enabled} onChange={setEnabled} aria-label="Notifications" />'
          : '<Switch checked={enabled} onChange={e => setEnabled(e.target.checked)} aria-label="Notifications" />';
  const slider =
    lib === "radix"
      ? '<Slider.Root value={[value]} onValueChange={v => setValue(v[0])}><Slider.Track><Slider.Range /></Slider.Track><Slider.Thumb aria-label="Adjust value" /></Slider.Root>'
      : lib === "shadcn"
        ? '<Slider value={[value]} onValueChange={v => setValue(v[0])} aria-label="Adjust value" />'
        : lib === "mui"
          ? '<Slider value={value} onChange={(_, v) => setValue(v as number)} aria-label="Adjust value" />'
          : '<Slider value={value} onChange={setValue} aria-label="Adjust value" />';
  const progress =
    lib === "radix"
      ? '<Progress.Root value={value} aria-label="Progress"><Progress.Indicator style={{ transform: `translateX(-${100-value}%)` }} /></Progress.Root>'
      : lib === "mui"
        ? '<LinearProgress variant="determinate" value={value} />'
        : lib === "antd"
          ? "<Progress percent={value} />"
          : "<Progress value={value} />";
  const checkbox =
    lib === "radix"
      ? '<Checkbox.Root checked={enabled} onCheckedChange={v => setEnabled(v === true)} aria-label="Explore the possibilities"><Checkbox.Indicator>✓</Checkbox.Indicator></Checkbox.Root>'
      : lib === "shadcn"
        ? '<Checkbox checked={enabled} onCheckedChange={v => setEnabled(v === true)} aria-label="Explore the possibilities" />'
        : '<Checkbox checked={enabled} onChange={e => setEnabled(e.target.checked)} aria-label="Explore the possibilities" />';
  const select =
    lib === "mui"
      ? '<TextField select label="Workspace" defaultValue="Personal">{["Personal", "Team", "Studio"].map(x => <MenuItem value={x} key={x}>{x}</MenuItem>)}</TextField>'
      : lib === "mantine"
        ? '<Select label="Workspace" data={["Personal", "Team", "Studio"]} defaultValue="Personal" />'
        : lib === "antd"
          ? '<Select aria-label="Workspace" defaultValue="Personal" options={["Personal", "Team", "Studio"].map(value => ({value, label:value}))} />'
          : lib === "shadcn"
            ? '<Select defaultValue="Personal"><SelectTrigger aria-label="Workspace"><SelectValue /></SelectTrigger><SelectContent>{["Personal", "Team", "Studio"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select>'
            : '<Select.Root defaultValue="Personal"><Select.Trigger aria-label="Workspace"><Select.Value /></Select.Trigger><Select.Portal><Select.Content><Select.Viewport>{["Personal", "Team", "Studio"].map(x => <Select.Item key={x} value={x}><Select.ItemText>{x}</Select.ItemText></Select.Item>)}</Select.Viewport></Select.Content></Select.Portal></Select.Root>';
  const tabs =
    lib === "mui"
      ? '<Tabs value={tab} onChange={(_, v) => setTab(v)}>{["Overview", "Activity", "Settings"].map(x => <Tab key={x} label={x} value={x} />)}</Tabs>'
      : lib === "mantine"
        ? '<SegmentedControl value={tab} onChange={setTab} data={["Overview", "Activity", "Settings"]} />'
        : lib === "antd"
          ? '<Segmented value={tab} onChange={setTab} options={["Overview", "Activity", "Settings"]} />'
          : lib === "shadcn"
            ? '<Tabs value={tab} onValueChange={setTab}><TabsList>{["Overview", "Activity", "Settings"].map(x => <TabsTrigger key={x} value={x}>{x}</TabsTrigger>)}</TabsList>{["Overview", "Activity", "Settings"].map(x => <TabsContent key={x} value={x}>{x}</TabsContent>)}</Tabs>'
            : '<Tabs.Root value={tab} onValueChange={setTab}><Tabs.List>{["Overview", "Activity", "Settings"].map(x => <Tabs.Trigger key={x} value={x}>{x}</Tabs.Trigger>)}</Tabs.List>{["Overview", "Activity", "Settings"].map(x => <Tabs.Content key={x} value={x}>{x}</Tabs.Content>)}</Tabs.Root>';
  const accordion =
    lib === "mui"
      ? "<Accordion><AccordionSummary>Can I make it my own?</AccordionSummary><AccordionDetails>Every detail is yours to customize.</AccordionDetails></Accordion>"
      : lib === "mantine"
        ? '<Accordion><Accordion.Item value="custom"><Accordion.Control>Can I make it my own?</Accordion.Control><Accordion.Panel>Every detail is yours to customize.</Accordion.Panel></Accordion.Item></Accordion>'
        : lib === "antd"
          ? '<Collapse items={[{ key:"custom", label:"Can I make it my own?", children:"Every detail is yours to customize." }]} />'
          : lib === "shadcn"
            ? '<Accordion type="single" collapsible><AccordionItem value="custom"><AccordionTrigger>Can I make it my own?</AccordionTrigger><AccordionContent>Every detail is yours to customize.</AccordionContent></AccordionItem></Accordion>'
            : '<Accordion.Root type="single" collapsible><Accordion.Item value="custom"><Accordion.Header><Accordion.Trigger>Can I make it my own?</Accordion.Trigger></Accordion.Header><Accordion.Content>Every detail is yours to customize.</Accordion.Content></Accordion.Item></Accordion.Root>';
  const views: Partial<Record<Pattern, string>> = {
    button: button(`{${text}}`),
    input: field("Your name") + "\n" + field("Email address", "email"),
    switch: "<span>Notifications</span>\n" + toggle,
    slider: "<span>Volume: {value}%</span>\n" + slider,
    checkbox: "<span>Explore the possibilities</span>\n" + checkbox,
    select,
    progress:
      progress +
      "\n<button onClick={() => setValue(Math.min(100, value + 12))}>Keep going</button>",
    tabs,
    accordion,
    alert:
      lib === "mui"
        ? '<Alert severity="success">All changes saved.</Alert>'
        : lib === "mantine"
          ? '<Alert title="All changes saved" color="green">You’re ready for what’s next.</Alert>'
          : lib === "antd"
            ? '<Alert type="success" title="All changes saved" showIcon />'
            : '<div role="status">✓ All changes saved.</div>',
    login:
      "<h2>Welcome back.</h2>\n" +
      field("Email address", "email") +
      "\n" +
      field("Password", "password") +
      "\n" +
      button("Sign in"),
    pricing:
      "<h2>The creator plan</h2>\n<strong>$24 / month</strong>\n<p>✓ Unlimited possibilities</p>\n<p>✓ Your own workspace</p>\n" +
      button("Get started"),
    settings:
      "<h2>Make yourself at home.</h2>\n<span>Notifications</span>\n" +
      toggle +
      "\n" +
      select +
      "\n" +
      slider,
    dashboard:
      "<span>Total projects</span>\n<h2>128</h2>\n<p>+24.8%</p>\n" +
      progress +
      "\n<button onClick={() => setValue(Math.min(100, value + 5))}>Add a project</button>",
  };
  const body = views[entry.pattern.id];
  if (!body) throw new Error("No starter for this pattern");
  // Keep only component imports used by the selected starter.
  const used = imports[lib]
    .replace(
      /import \{ ([^}]+) \} from "([^"]+)";/g,
      (_, names: string, from: string) => {
        const matches = names
          .split(", ")
          .filter(
            (name) =>
              new RegExp(`<${name}[ ./>]`).test(body) ||
              name === "MantineProvider" ||
              name === "ConfigProvider",
          );
        return matches.length
          ? `import { ${matches.join(", ")} } from "${from}";`
          : "";
      },
    )
    .split("\n")
    .filter(Boolean)
    .join("\n");
  const providerStart =
    lib === "mantine"
      ? `<MantineProvider forceColorScheme="${a.dark ? "dark" : "light"}">`
      : lib === "antd"
        ? `<ConfigProvider theme={{ token: { colorPrimary: ${JSON.stringify(a.color || "#1677ff")} } }}>`
        : "";
  const providerEnd =
    lib === "mantine"
      ? "</MantineProvider>"
      : lib === "antd"
        ? "</ConfigProvider>"
        : "";
  const states = [
    body.includes("enabled")
      ? "  const [enabled, setEnabled] = useState(true);"
      : "",
    body.includes("value") &&
    ["slider", "progress", "settings", "dashboard"].includes(entry.pattern.id)
      ? "  const [value, setValue] = useState(64);"
      : "",
    entry.pattern.id === "tabs"
      ? '  const [tab, setTab] = useState("Overview");'
      : "",
  ]
    .filter(Boolean)
    .join("\n");
  return `"use client";\n${states ? 'import { useState } from "react";\n' : ""}${used}\n\n${lib === "radix" ? "// Radix primitives are unstyled. Add your own component CSS.\n" : ""}export default function ComponentDemo() {\n${states}\n  return (\n    ${providerStart}<div style={{ display: "grid", gap: ${a.spacing ?? (a.compact ? 10 : 16)}, padding: 24 }}>\n${body
    .split("\n")
    .map((l) => `      ${l}`)
    .join("\n")}\n    </div>${providerEnd}\n  );\n}`;
}
