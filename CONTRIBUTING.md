# Contributing

Create a short feature branch from `main` and open a pull request back to `main`.
Use Conventional Commit subjects under 50 characters. Keep changes focused.

Run `npm ci` and `npm run check`. For visual changes, run the app and check the
modified previews at desktop and mobile sizes. Update screenshots with
`npm run screenshots` when the primary interface changes.

Register supported patterns in `src/lib/explorer/catalog.ts`. Add a library
adapter under `src/components/explorer/`, then a lazy loader in
`src/preview-main.tsx` and a source mapping in `preview-source.ts`.
Preview code must use the actual credited library. Keep restricted components
as reference links. Preserve third-party licenses and attribution.

Never commit credentials, `.env` files, node_modules, or dist. Search input is
plain text and must never be evaluated as code. Use shared appearance props
for safe live updates. Keep provider styles inside preview frames.
