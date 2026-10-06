import { useId, useState } from "react";
import {
  Theme,
  Button,
  TextInput,
  Toggle,
  Accordion,
  AccordionItem,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tag,
  SkeletonText,
  SkeletonPlaceholder,
} from "@carbon/react";
import "./carbon.scss";
import type { PreviewProps } from "./PatternPreview";
export default function CarbonPreview({
  pattern,
  appearance: a,
}: PreviewProps) {
  const id = useId();
  const [done, setDone] = useState(false);
  return (
    <Theme theme={a.dark ? "g100" : "white"}>
      <div
        className="demo-stack"
        style={
          {
            "--cds-button-primary": a.color || "#0f62fe",
            "--cds-interactive": a.color || "#0f62fe",
          } as React.CSSProperties
        }
      >
        {pattern === "button" && (
          <>
            <Button
              kind={a.outline ? "tertiary" : "primary"}
              size={a.compact ? "sm" : "md"}
              onClick={() => setDone(!done)}
            >
              {done ? "Done!" : a.label}
            </Button>
            <Button kind="secondary" size="md">
              Secondary
            </Button>
            <Button kind="ghost" size="md">
              Quiet action
            </Button>
          </>
        )}
        {pattern === "input" && (
          <>
            <TextInput
              id={`${id}-name`}
              labelText="Your name"
              placeholder="Alex Morgan"
            />
            <TextInput
              id={`${id}-email`}
              labelText="Email address"
              type="email"
              placeholder="you@example.com"
            />
          </>
        )}
        {pattern === "switch" && (
          <Toggle
            id={id}
            labelText="Notifications"
            labelA="Off"
            labelB="On"
            defaultToggled
          />
        )}
        {pattern === "accordion" && (
          <Accordion>
            {(
              a.items ?? [
                "Make it yours",
                "What is included?",
                "Where do I start?",
              ]
            ).map((x, i) => (
              <AccordionItem title={x} open={i === 0} key={x}>
                All the essentials for your next idea.
              </AccordionItem>
            ))}
          </Accordion>
        )}
        {pattern === "table" && (
          <Table size="sm" aria-label="Project team">
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Role</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {(a.items
                ? a.items.map((x) => [x, "Pending"])
                : [
                    ["Alex", "Designer"],
                    ["Sam", "Developer"],
                    ["Jordan", "Creator"],
                  ]
              ).map(([name, role]) => (
                <TableRow key={name}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {pattern === "badge" && (
          <div className="demo-row">
            <Tag type="green">Published</Tag>
            <Tag type="blue">In progress</Tag>
            <Tag type="gray">Draft</Tag>
          </div>
        )}
        {pattern === "skeleton" && (
          <div aria-label="Loading profile">
            <SkeletonText heading />
            <SkeletonText paragraph lineCount={3} />
            <SkeletonPlaceholder style={{ width: "100%", height: 72 }} />
          </div>
        )}
      </div>
    </Theme>
  );
}
