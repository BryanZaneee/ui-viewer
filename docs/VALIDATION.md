# Validation

Validated on 2026-10-06 with Node 26.8.1 and Chromium.

- Typecheck, catalog/search checks, legacy TSX starter parsing, Jev response validation, and rate-limit tests pass.
- All 139 interactive catalog entries rendered in the production build without a runtime error.
- Live color changes preserve mounted component state; favorites survive reloads.
- Calendar navigation, autocomplete selection, HeroUI switch interaction, Radix Themes dialogs, source inspection, and reference links work.
- Mobile viewport at 390×844 has no horizontal overflow.
- Axe WCAG 2 A/AA and 2.1 AA scan of the catalog shell returned no violations. This is not a certification of every upstream component.
- Jev selected calendar, rating, table, aurora text, login, and none correctly for six representative descriptions. Observed response times were 276–483 ms; this small sample is not a latency guarantee or broad accuracy benchmark.
- API validation rejects oversized/invalid descriptions and disallowed origins. Repeated queries use the response cache.
- Smart-search opt-out persists; local results work when the service responds 503.

Run `npm run check`, then serve the production build and run `npm run test:previews`.
`npm run bundle` reports the actual compressed shell footprint; visible library
previews are additional lazy requests.

## Live deployment

The public repository is a fresh, public GitHub repository rather than a fork.
The live app at https://bryanzane.com/ui-viewer/ passed browser checks for Jev
description matching and interactive library previews. The original portfolio
and Shapeshift routes both still return HTTP 200. HTML responses bypass CDN
caching, and the preview endpoint permits same-origin embedding via CSP.

The final shell measures 125.7 KiB gzip excluding visible library modules.
The bundled search server is 16.7 KiB uncompressed. Credentials are held in a
root-owned mode-600 environment file outside the repository and web root.
Staged files were scanned before publishing; no OpenRouter keys or environment
files were included. Temporary local credential files were removed after testing.
