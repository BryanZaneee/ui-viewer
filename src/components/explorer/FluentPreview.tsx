import { useState } from "react";
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Button,
  Input,
  Field,
  Switch,
  TabList,
  Tab,
  ProgressBar,
  Badge,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from "@fluentui/react-components";
import type { PreviewProps } from "./PatternPreview";
export default function FluentPreview({
  pattern,
  appearance: a,
}: PreviewProps) {
  const [done, setDone] = useState(false);
  const [tab, setTab] = useState("Overview");
  const theme = {
    ...(a.dark ? webDarkTheme : webLightTheme),
    ...(a.color
      ? { colorBrandBackground: a.color, colorBrandForeground1: a.color }
      : {}),
    ...(a.radius !== undefined ? { borderRadiusMedium: `${a.radius}px` } : {}),
  };
  return (
    <FluentProvider theme={theme} style={{ background: "transparent" }}>
      <div className="demo-stack">
        {pattern === "button" && (
          <>
            <Button
              appearance={a.outline ? "outline" : "primary"}
              size={a.compact ? "small" : "medium"}
              onClick={() => setDone(!done)}
            >
              {done ? "Done!" : a.label}
            </Button>
            <Button>Secondary</Button>
            <Button appearance="subtle">Quiet action</Button>
          </>
        )}
        {pattern === "input" && (
          <>
            <Field label="Your name">
              <Input placeholder="Alex Morgan" />
            </Field>
            <Field label="Email address">
              <Input type="email" placeholder="you@example.com" />
            </Field>
          </>
        )}
        {pattern === "switch" && (
          <Switch defaultChecked label="Notifications" />
        )}
        {pattern === "tabs" && (
          <>
            <TabList
              selectedValue={tab}
              onTabSelect={(_, data) => setTab(String(data.value))}
            >
              {["Overview", "Activity", "Settings"].map((x) => (
                <Tab key={x} value={x}>
                  {x}
                </Tab>
              ))}
            </TabList>
            <div role="tabpanel">{tab}: your workspace at a glance.</div>
          </>
        )}
        {pattern === "progress" && (
          <Field validationMessage="64% uploaded" validationState="none">
            <ProgressBar value={0.64} aria-label="Project upload" />
          </Field>
        )}
        {pattern === "badge" && (
          <div className="demo-row">
            <Badge color="success">Published</Badge>
            <Badge appearance="tint">In progress</Badge>
            <Badge appearance="outline">Draft</Badge>
          </div>
        )}
        {pattern === "menu" && (
          <>
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <Button>Project actions ▾</Button>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  {["Edit project", "Duplicate", "Archive"].map((x) => (
                    <MenuItem key={x} onClick={() => setDone(true)}>
                      {x}
                    </MenuItem>
                  ))}
                </MenuList>
              </MenuPopover>
            </Menu>
            {done && <span role="status">Action selected</span>}
          </>
        )}
      </div>
    </FluentProvider>
  );
}
