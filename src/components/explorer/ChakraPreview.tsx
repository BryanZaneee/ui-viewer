import { useState } from "react";
import {
  ChakraProvider,
  defaultSystem,
  Button,
  Input,
  Switch,
  Tabs,
  Progress,
  Badge,
  Skeleton,
  Theme,
} from "@chakra-ui/react";
import type { PreviewProps } from "./PatternPreview";
export default function ChakraPreview({
  pattern,
  appearance: a,
}: PreviewProps) {
  const [done, setDone] = useState(false);
  return (
    <ChakraProvider value={defaultSystem}>
      <Theme
        appearance={a.dark ? "dark" : "light"}
        style={{ background: "transparent" }}
      >
        <div
          className="demo-stack"
          style={
            {
              "--chakra-colors-color-palette-solid": a.color || "#147b78",
            } as React.CSSProperties
          }
        >
          {pattern === "button" && (
            <>
              <Button
                colorPalette="teal"
                borderRadius={a.radius}
                size={a.compact ? "xs" : "md"}
                variant={a.outline ? "outline" : "solid"}
                onClick={() => setDone(!done)}
              >
                {done ? "Done!" : a.label}
              </Button>
              <Button variant="outline">Secondary</Button>
              <Button variant="ghost">Quiet action</Button>
            </>
          )}
          {pattern === "input" && (
            <>
              <label>
                Your name
                <Input placeholder="Alex Morgan" borderRadius={a.radius} />
              </label>
              <label>
                Email address
                <Input
                  type="email"
                  placeholder="you@example.com"
                  borderRadius={a.radius}
                />
              </label>
            </>
          )}
          {pattern === "switch" && (
            <Switch.Root defaultChecked colorPalette="teal">
              <Switch.HiddenInput />
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <Switch.Label>Notifications</Switch.Label>
            </Switch.Root>
          )}
          {pattern === "tabs" && (
            <Tabs.Root defaultValue="Overview" colorPalette="teal">
              <Tabs.List>
                {["Overview", "Activity", "Settings"].map((x) => (
                  <Tabs.Trigger key={x} value={x}>
                    {x}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
              {["Overview", "Activity", "Settings"].map((x) => (
                <Tabs.Content key={x} value={x}>
                  {x}: your workspace at a glance.
                </Tabs.Content>
              ))}
            </Tabs.Root>
          )}
          {pattern === "progress" && (
            <Progress.Root value={64} colorPalette="teal">
              <Progress.Label>Uploading your project</Progress.Label>
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
              <Progress.ValueText />
            </Progress.Root>
          )}
          {pattern === "badge" && (
            <div className="demo-row">
              <Badge colorPalette="green">Published</Badge>
              <Badge colorPalette="teal">In progress</Badge>
              <Badge>Draft</Badge>
            </div>
          )}
          {pattern === "skeleton" && (
            <div className="demo-stack" aria-label="Loading profile">
              <Skeleton height="48px" width="48px" borderRadius="full" />
              <Skeleton height="16px" />
              <Skeleton height="16px" width="80%" />
              <Skeleton height="80px" />
            </div>
          )}
        </div>
      </Theme>
    </ChakraProvider>
  );
}
