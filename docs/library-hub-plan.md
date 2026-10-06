# UI library hub plan

## Shipped foundation

The sidebar contains Apple UI, Motion & effects, and Web UI. Groups and their library names are alphabetical, with collapsible groups and a separate component-type filter. The selected library and type remain visible above the results and in shareable URLs. Mobile filters use a bounded, scrollable panel.

There are 20 libraries: 14 preview families and six reference libraries. Bits UI, Headless UI, Reka UI, and UIKit join the existing React Bits and Aceternity UI references. References link to their creators and never imply a working local preview. SwiftUI remains a browser approximation with a native starter. Cards always display component category plus preview status.

Cards enter with a short, capped stagger; loaded preview frames fade in. Existing keyed cards retain their state while typing. Reduced-motion preferences disable entrance movement and frame transitions.

## Grouping as the catalog grows

| Group | Contents | Next organization step |
| --- | --- | --- |
| Apple UI | SwiftUI and UIKit | Add macOS/AppKit after validating useful reference coverage; distinguish native code from browser approximations. |
| Motion & effects | Aceternity UI, Magic UI, React Bits | Tag text, backgrounds, transitions, and interaction effects. |
| Web UI | React libraries plus Headless UI, Bits UI, Reka UI references | Add framework filters (React, Vue, Svelte, framework-independent CSS) when adapters support them. Keep names alphabetical. |

Keep platform/framework, component type, and support status as separate dimensions. A form control can belong to any library; “reference” is a support status, not a component type. Expand component types only when real catalog entries justify them. Retain Actions, Forms, Navigation, Data display, Feedback, Dates & time, Motion, and Overlays.

## Delivery sequence

1. **Promote reference libraries individually.** Start with Headless UI (the app already uses React), then evaluate Vue and Svelte preview entry points for Reka UI and Bits UI. For each library: verify license and setup from its official docs, add isolated renderers and source export, declare only implemented patterns, and check keyboard use, themes, narrow screens, loading failures, and bundle cost. Keep iframe isolation and offscreen unloading.
2. **Offer several options from one description.** Preserve the existing Jev opt-in and server-only credentials. Jev already chooses a component type and bounded style/content values; the app renders matches across supported libraries. Next, supply platform constraints and a shortlist of supported entries, ask independent relevance questions in one call, and show three to six diverse library choices. Explicit library/type filters always win. Reference entries cannot become generated previews.
3. **Compose complete UIs.** Define a small validated screen schema with known sections (e.g. sign-in, settings, dashboard) and supported component IDs. Jev selects sections and styles; deterministic code assembles vetted library templates and exports runnable files with dependencies. Keep each option within a compatible framework/library. Unsupported requests should say what is missing; free-form code generation would require a separate generative model.
4. **Scale discovery.** Add sidebar library search when the list becomes cumbersome, then compatibility, license, and support-status filters backed by verified metadata. Prioritize adapters using actual searches and saved components rather than installing every library up front.

## Acceptance checks for the next phases

- One natural-language request produces several supported, materially distinct options, with clear library, framework, type, and support status.
- No-match, uncertain, slow, failed, and stale Jev responses preserve usable local browsing; score thresholds are evaluated against representative UI requests.
- Exported examples build and reflect the shown values; native Apple output is checked in its native toolchain.
- New libraries add no eager preview dependency to the main explorer bundle.
- Keyboard navigation, mobile overflow, reduced motion, and preview lifecycle checks pass.

## Sources checked October 6, 2026

- [Headless UI](https://headlessui.com/): React and Vue primitives.
- [Bits UI](https://www.bits-ui.com/): Svelte primitives.
- [Reka UI](https://reka-ui.com/): Vue primitives.
- [UIKit](https://developer.apple.com/documentation/uikit): Apple framework reference.
- [TypeSafe System One](https://docs.typesafe.ai/concepts/system-one): typed decisions rather than generated code.
- [TypeSafe function calling](https://docs.typesafe.ai/cookbooks/function_calling): bounded choices mapped to application functions.
