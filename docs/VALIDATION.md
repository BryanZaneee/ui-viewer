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
