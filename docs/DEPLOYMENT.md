# Static deployment

`npm run build` produces `dist/` with `/ui-viewer/` as the default base path.
Set `BASE_PATH=/` at build time to deploy at a domain root instead.

Upload the contents of `dist/` into a release directory’s `www/` subdirectory and atomically point
`/var/www/ui-viewer/current` at that directory. Serve files with Caddy using
[the route example](../deploy/Caddyfile.example). The static catalog needs no server process. Optional Jev search uses Node 22.12+
and the bundled `dist-server/index.mjs`, copied into the release’s `server/` directory. Preserve older hashed assets across releases if
visitors may keep the app open during deployment.

The preview endpoint must allow framing from the same origin. Override an
inherited `X-Frame-Options: DENY` and `frame-ancestors 'none'` only for
`/ui-viewer/preview.html`. Keep the main document's existing protections.

Serve HTML with `Cache-Control: no-store`. Cache hashed `/assets/` files for a
year. If Cloudflare has a cache-everything rule, add a scoped bypass for
`/ui-viewer` and descendants excluding `/ui-viewer/assets/`.

Validate the candidate Caddy configuration before reloading. Back up the
configuration and prior release target. To roll back, restore the prior
symlink (and configuration if changed) and reload Caddy. Log all system-level
changes in the VPS changelog.

Publishing a new GitHub commit does not automatically deploy this repository.
Build and upload a reviewed release explicitly.

## Jev service

Install `deploy/ui-viewer-search.service` and configure `/etc/ui-viewer.env` with
`OPENROUTER_JEV_KEY`, `PUBLIC_ORIGIN=https://your-site.example`, and `PORT=8040`.
Make the file root-owned with mode 600; systemd reads it before dropping to
www-data. Never copy it into a release or repository. The service binds to
127.0.0.1 and Caddy replaces the client-IP header used for rate limits.

Enable and start the service, then verify `/ui-viewer/api/health` and a small
POST to `/ui-viewer/api/interpret`. No query or key is written to application
logs. Limits and cache are in-memory and reset on restart. For multiple server
instances, move these limits to shared storage before scaling out.

If inherited security headers are deferred, keep the example’s site-level exact-path
X-Frame-Options rule before them. An override inside handle_path alone may be
overwritten as the response unwinds. Verify the public preview response reports
SAMEORIGIN and its CSP contains `frame-ancestors 'self'`.
