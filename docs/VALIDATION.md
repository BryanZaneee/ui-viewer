# Validation

Validated on 2026-10-06. Production checks ran with Node 22 on the VPS in an isolated temporary directory; browser checks ran in Chromium locally.

- `npm run check`: TypeScript, nine catalog/source/value/Jev tests, static build, and server build pass.
- All 139 interactive entries render without a runtime error (`npm run test:previews`).
- `npm run test:editor`: automatic Jev matching, PC checklist content, library-filter placement, sidebar toggle, animated expansion, source updates, item editing/removal, keyboard sliders, color, heading, randomization, reset, and Escape/Enter behavior pass.
- Mounted checkbox state survives styling changes. Randomize preserves supplied content. Each card maintains independent overrides for the current query.
- Mobile at 390×844 has no horizontal page overflow. The sidebar starts collapsed on small screens; the expanded editor uses the page's scroll on mobile. Reduced-motion preferences are respected.
- Axe WCAG 2 A/AA and 2.1 AA scan of the expanded catalog/editor returned zero violations. This does not certify every upstream library component.
- Source spans preserve exact spelling/case; malformed, reversed, out-of-range, low-confidence, and unknown decisions cannot become component data. Numeric styles and frame messages have bounded validation.
- The exact request `I need a checklist for my PC to get my RTX 3060, CPU, and motherboard` returns `checkbox` with items `RTX 3060`, `CPU`, `motherboard`. Grocery-list, pricing, and percentage requests also passed live Jev checks. Four sampled calls took 221–437 ms; this is not a general accuracy or latency guarantee.
- API keys remain in a root-owned mode-600 environment file outside the repository and web root. Source and browser/server build artifacts were scanned for OpenRouter key literals before publishing.

The shell is approximately 146 KiB gzip, excluding lazy library previews. The bundled search service is approximately 22 KiB uncompressed. The existing motion dependency supplies layout animations; no new library dependency was added.

React source panels show the current configuration and actual adapter implementation. Shared renderer/types/styles remain repository dependencies. SwiftUI is a browser approximation with a native starter; native Xcode compilation is not part of these checks.

Use `UI_VIEWER_URL` to point browser scripts at a local preview or the live app. Editor tests need the Jev service; catalog rendering checks do not.

## Live verification

Release `20261006-205154` is live at https://bryanzane.com/ui-viewer/.
The complete editor flow passed again against the public site, including Jev's
exact PC checklist extraction and mobile layout. Preview responses return
`X-Frame-Options: SAMEORIGIN`, a same-origin framing CSP, and `no-store` with
Cloudflare `DYNAMIC`. The portfolio and original Shapeshift route return 200.
Temporary local credentials and isolated VPS build files were removed afterward.

## Search continuity

The repository now lives at `~/programming-projects/ui-viewer`. The search input
keeps the last completed query, content, and styling together until the next
response is ready. Embedded frames wait for actual props before rendering.

- `npm run check` passes from the relocated checkout.
- `npm run test:search` verifies first-search loading, debounce and delayed
  responses, preserved iframe identity, stale-response rejection, cache hits,
  temporary failures, clearing during a request, and no transient sample text.
- All 139 interactive previews pass after the embedded-frame initialization change.
- Release `20261006-220329` is live. Search continuity and the full editor flow
  both pass against the public site, including actual server-side Jev content.
  The server implementation and private environment were unchanged.

## Immediate typing updates

Removed the first-search loading screen. Local catalog matches and explicit
values update on each keystroke while Jev refines the result in the background.
Completed contextual values remain available during pending requests.

- Typecheck, nine unit tests, and production builds pass.
- The browser regression now verifies visible first-search matches, immediate
  item edits and a new button label before held API responses, plus retained
  content, stale-response rejection, failures, caching, and clearing.
- Release `20261006-221612`: the updated search regression and full editor
  flow both pass on the public site with live Jev enabled.

## Optional Jev

The native **Use Jev** checkbox is unchecked on each fresh page load. No health
or interpretation requests run until it is enabled. Disabling it aborts pending
work and immediately restores local-only matching and values. The browser
regression verifies the default, enabling, cancellation, and no further requests
after disabling, alongside the existing search continuity cases.

Typecheck, nine unit tests, production builds, and the updated browser regression pass.
Release `20261006-232350`: public opt-in/search regression and full editor checks pass.
