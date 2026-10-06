"use client";
import { useMemo } from "react";
import {
  ThemeProvider,
  createTheme,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Slider,
  Checkbox,
  LinearProgress,
  Tabs,
  Tab,
  Alert,
  AlertTitle,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
} from "@mui/material";
import { ChevronDown } from "lucide-react";
import {
  PatternPreview,
  type PreviewProps,
  type Controls,
} from "./PatternPreview";
export default function MuiPreview(props: PreviewProps) {
  const a = props.appearance;
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: a.dark ? "dark" : "light",
          primary: { main: a.color || "#1976d2" },
        },
        shape: { borderRadius: a.radius ?? 6 },
        typography: { fontFamily: "inherit", fontSize: a.compact ? 12 : 14 },
        components: {
          MuiButton: { defaultProps: { size: a.compact ? "small" : "medium" } },
        },
      }),
    [a.dark, a.color, a.radius, a.compact],
  );
  const c: Controls = {
    button: (label, click, secondary) => (
      <Button
        variant={secondary || a.outline ? "outlined" : "contained"}
        onClick={click}
      >
        {label}
      </Button>
    ),
    field: (label, type) => (
      <TextField label={label} type={type} size="small" fullWidth />
    ),
    toggle: (label, value, change) => (
      <FormControlLabel
        label={label}
        labelPlacement="start"
        sx={{ margin: 0, justifyContent: "space-between" }}
        control={
          <Switch checked={value} onChange={(e) => change(e.target.checked)} />
        }
      />
    ),
    slider: (value, change) => (
      <Slider
        value={value}
        onChange={(_, v) => change(v as number)}
        aria-label="Adjust value"
      />
    ),
    checkbox: (label, value, change) => (
      <FormControlLabel
        sx={{ margin: 0 }}
        label={label}
        control={
          <Checkbox
            checked={value}
            onChange={(e) => change(e.target.checked)}
          />
        }
      />
    ),
    select: () => (
      <TextField
        select
        label="Workspace"
        defaultValue="Personal"
        size="small"
        fullWidth
      >
        {["Personal", "Team", "Studio"].map((x) => (
          <MenuItem value={x} key={x}>
            {x}
          </MenuItem>
        ))}
      </TextField>
    ),
    progress: (value) => (
      <LinearProgress
        variant="determinate"
        value={value}
        aria-label="Progress"
        sx={{ height: 6, borderRadius: 3 }}
      />
    ),
    tabs: (value, change) => (
      <Tabs
        value={value}
        onChange={(_, v) => change(v)}
        variant="fullWidth"
        aria-label="Views"
      >
        {["Overview", "Activity", "Settings"].map((x) => (
          <Tab
            sx={{ minWidth: 0, padding: "8px", fontSize: 12 }}
            value={x}
            label={x}
            key={x}
          />
        ))}
      </Tabs>
    ),
    alert: () => (
      <Alert severity="success">
        <AlertTitle>All changes saved</AlertTitle>You’re ready for what’s next.
      </Alert>
    ),
    accordion: () => (
      <div>
        {["Can I make it my own?", "What’s included?", "Where do I start?"].map(
          (x, i) => (
            <Accordion
              key={x}
              defaultExpanded={i === 0}
              disableGutters
              elevation={0}
            >
              <AccordionSummary expandIcon={<ChevronDown size={15} />}>
                {x}
              </AccordionSummary>
              <AccordionDetails>
                Every detail is yours to explore and customize.
              </AccordionDetails>
            </Accordion>
          ),
        )}
      </div>
    ),
  };
  return (
    <ThemeProvider theme={theme}>
      <PatternPreview {...props} controls={c} />
    </ThemeProvider>
  );
}
