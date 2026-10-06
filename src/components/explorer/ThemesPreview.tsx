import { useState } from "react";
import {
  Theme,
  Button,
  TextField,
  Switch,
  Tabs,
  Table,
  DropdownMenu,
  Dialog,
  Badge,
  Flex,
} from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import type { PreviewProps } from "./PatternPreview";
export default function ThemesPreview({
  pattern,
  appearance: a,
}: PreviewProps) {
  const [done, setDone] = useState(false);
  return (
    <Theme
      appearance={a.dark ? "dark" : "light"}
      accentColor="violet"
      radius={a.radius === 0 ? "none" : a.radius ? "full" : "medium"}
      scaling={a.compact ? "90%" : "100%"}
      style={
        {
          minHeight: 0,
          background: "transparent",
          "--accent-9": a.color || "#6e56cf",
        } as React.CSSProperties
      }
    >
      <div className="demo-stack">
        {pattern === "button" && (
          <>
            <Button
              variant={a.outline ? "outline" : "solid"}
              onClick={() => setDone(!done)}
            >
              {done ? "Done!" : a.label}
            </Button>
            <Button variant="soft">Secondary</Button>
            <Button variant="outline">Outline</Button>
          </>
        )}
        {pattern === "input" && (
          <>
            <label>
              Your name
              <TextField.Root placeholder="Alex Morgan" />
            </label>
            <label>
              Email address
              <TextField.Root type="email" placeholder="you@example.com" />
            </label>
          </>
        )}
        {pattern === "switch" && (
          <label className="demo-row between">
            Notifications
            <Switch defaultChecked />
          </label>
        )}
        {pattern === "tabs" && (
          <Tabs.Root defaultValue="Overview">
            <Tabs.List>
              {["Overview", "Activity", "Settings"].map((x) => (
                <Tabs.Trigger key={x} value={x}>
                  {x}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            {["Overview", "Activity", "Settings"].map((x) => (
              <Tabs.Content key={x} value={x} style={{ paddingTop: 20 }}>
                {x}: your workspace at a glance.
              </Tabs.Content>
            ))}
          </Tabs.Root>
        )}
        {pattern === "table" && (
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {[
                ["Alex", "Designer"],
                ["Sam", "Developer"],
                ["Jordan", "Creator"],
              ].map(([name, role]) => (
                <Table.Row key={name}>
                  <Table.RowHeaderCell>{name}</Table.RowHeaderCell>
                  <Table.Cell>{role}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
        {pattern === "menu" && (
          <>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="soft">Project actions ▾</Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                {["Edit project", "Duplicate", "Archive"].map((x) => (
                  <DropdownMenu.Item key={x} onSelect={() => setDone(true)}>
                    {x}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
            {done && <span role="status">Action selected</span>}
          </>
        )}
        {pattern === "dialog" && (
          <Dialog.Root>
            <Dialog.Trigger>
              <Button>
                {a.label === "Continue" ? "Edit profile" : a.label}
              </Button>
            </Dialog.Trigger>
            <Dialog.Content maxWidth="350px">
              <Dialog.Title>Edit profile</Dialog.Title>
              <Dialog.Description size="2">
                Make yourself at home.
              </Dialog.Description>
              <label>
                Your name
                <TextField.Root defaultValue="Alex Morgan" />
              </label>
              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft">Cancel</Button>
                </Dialog.Close>
                <Dialog.Close>
                  <Button>Save</Button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        )}
        {pattern === "badge" && (
          <Flex gap="2" wrap="wrap">
            <Badge color="green">Published</Badge>
            <Badge>In progress</Badge>
            <Badge color="gray">Draft</Badge>
          </Flex>
        )}
      </div>
    </Theme>
  );
}
