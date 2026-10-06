import { useState } from "react";
import {
  Button,
  Input,
  Label,
  TextField,
  Switch,
  Chip,
  Skeleton,
  Tabs,
  Accordion,
} from "@heroui/react";
import "./hero.css";
import type { PreviewProps } from "./PatternPreview";

export default function HeroPreview({ pattern, appearance: a }: PreviewProps) {
  const [done, setDone] = useState(false);
  return (
    <div className={`demo-stack ${a.dark ? "dark" : "light"}`}>
      {pattern === "button" && (
        <>
          <Button
            size={a.compact ? "sm" : "md"}
            variant={a.outline ? "outline" : "primary"}
            onPress={() => setDone(!done)}
          >
            {done ? "Done!" : a.label}
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Quiet action</Button>
        </>
      )}
      {pattern === "input" && (
        <>
          <TextField>
            <Label>Your name</Label>
            <Input placeholder="Alex Morgan" />
          </TextField>
          <TextField type="email">
            <Label>Email address</Label>
            <Input placeholder="you@example.com" />
          </TextField>
        </>
      )}
      {pattern === "switch" && (
        <Switch defaultSelected>
          <Switch.Content>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Label>Notifications</Label>
          </Switch.Content>
        </Switch>
      )}
      {pattern === "badge" && (
        <div className="demo-row">
          <Chip color="success">Published</Chip>
          <Chip color="accent">In progress</Chip>
          <Chip>Draft</Chip>
        </div>
      )}
      {pattern === "skeleton" && (
        <div aria-label="Loading profile" className="demo-stack">
          <Skeleton className="h-14 w-14 rounded-full" />
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-24 w-full rounded" />
        </div>
      )}
      {pattern === "tabs" && (
        <Tabs defaultSelectedKey="Overview">
          <Tabs.List aria-label="Views">
            {["Overview", "Activity", "Settings"].map((x) => (
              <Tabs.Tab id={x} key={x}>
                {x}
                <Tabs.Indicator />
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {["Overview", "Activity", "Settings"].map((x) => (
            <Tabs.Panel id={x} key={x}>
              {x}: your workspace at a glance.
            </Tabs.Panel>
          ))}
        </Tabs>
      )}
      {pattern === "accordion" && (
        <Accordion>
          {["Make it yours", "What is included?", "Where do I start?"].map(
            (x) => (
              <Accordion.Item id={x} key={x}>
                <Accordion.Heading>
                  <Accordion.Trigger>
                    {x}
                    <Accordion.Indicator />
                  </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel>
                  <Accordion.Body>
                    Choose a component, change the details, and bring it to your
                    next project.
                  </Accordion.Body>
                </Accordion.Panel>
              </Accordion.Item>
            ),
          )}
        </Accordion>
      )}
    </div>
  );
}
