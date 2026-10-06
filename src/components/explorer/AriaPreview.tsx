import { useState } from "react";
import {
  Button,
  Calendar,
  CalendarGrid,
  CalendarCell,
  Heading,
  ComboBox,
  Label,
  Input,
  Popover,
  ListBox,
  ListBoxItem,
  Switch,
  Slider,
  SliderOutput,
  SliderTrack,
  SliderThumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Checkbox,
} from "react-aria-components";
import { CalendarDate } from "@internationalized/date";
import type { PreviewProps } from "./PatternPreview";
import "./aria.css";
export default function AriaPreview({ pattern, appearance: a }: PreviewProps) {
  const [done, setDone] = useState(false);
  return (
    <div className="demo-stack aria-demo">
      {pattern === "button" && (
        <>
          <Button
            className={`aria-button ${a.outline ? "outline" : ""}`}
            onPress={() => setDone(!done)}
          >
            {done ? "Done!" : a.label}
          </Button>
          <Button className="aria-button outline">Secondary</Button>
        </>
      )}
      {pattern === "calendar" && (
        <Calendar
          aria-label="Booking date"
          defaultValue={new CalendarDate(2026, 10, 15)}
        >
          <header className="demo-row between">
            <Button slot="previous" aria-label="Previous month">
              ‹
            </Button>
            <Heading />
            <Button slot="next" aria-label="Next month">
              ›
            </Button>
          </header>
          <CalendarGrid>{(date) => <CalendarCell date={date} />}</CalendarGrid>
        </Calendar>
      )}
      {pattern === "autocomplete" && (
        <ComboBox>
          <Label>Your framework</Label>
          <div className="demo-row">
            <Input placeholder="Search frameworks…" />
            <Button aria-label="Show frameworks">⌄</Button>
          </div>
          <Popover>
            <ListBox>
              {["React", "Vue", "Svelte", "Angular", "Solid"].map((x) => (
                <ListBoxItem key={x} id={x}>
                  {x}
                </ListBoxItem>
              ))}
            </ListBox>
          </Popover>
        </ComboBox>
      )}
      {pattern === "switch" && (
        <Switch defaultSelected>
          <span className="aria-switch-track">
            <span />
          </span>
          Notifications
        </Switch>
      )}
      {pattern === "slider" && (
        <Slider defaultValue={64}>
          <div className="demo-row between">
            <Label>Volume</Label>
            <SliderOutput />
          </div>
          <SliderTrack>
            <SliderThumb />
          </SliderTrack>
        </Slider>
      )}
      {pattern === "checkbox" &&
        [
          "Explore the possibilities",
          "Make it your own",
          "Ship something great",
        ].map((x, i) => (
          <Checkbox key={x} defaultSelected={i === 0}>
            <span className="aria-check">✓</span>
            {x}
          </Checkbox>
        ))}
      {pattern === "tabs" && (
        <Tabs>
          <TabList aria-label="Views">
            {["Overview", "Activity", "Settings"].map((x) => (
              <Tab key={x} id={x}>
                {x}
              </Tab>
            ))}
          </TabList>
          {["Overview", "Activity", "Settings"].map((x) => (
            <TabPanel key={x} id={x}>
              {x}: your workspace at a glance.
            </TabPanel>
          ))}
        </Tabs>
      )}
    </div>
  );
}
