import { createServer, type ServerResponse } from "node:http";
import {
  requestFor,
  parseIntent,
  validQuery,
  WindowLimit,
  type Intent,
} from "./jev";

const key = process.env.OPENROUTER_JEV_KEY || process.env.OPENROUTER_API_KEY;
const allowedOrigins = new Set([
  process.env.PUBLIC_ORIGIN || "https://bryanzane.com",
  "https://www.bryanzane.com",
]);
const perClient = new WindowLimit(20, 60_000);
// Bounded public demo spend; instant local search still works at the limit.
const globalLimit = new WindowLimit(300, 3_600_000);
const cache = new Map<string, { intent: Intent; until: number }>();
const pending = new Map<string, Promise<Intent>>();
let inFlight = 0;
function reply(res: ServerResponse, status: number, body: unknown) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify(body));
}
async function interpret(query: string): Promise<Intent> {
  const response = await fetch("https://openrouter.ai/api/v1/systemone", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestFor(query)),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("Decision service unavailable");
  return parseIntent(await response.json());
}
const server = createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/api/health")
    return reply(res, 200, { available: !!key });
  if (req.method !== "POST" || req.url !== "/api/interpret")
    return reply(res, 404, { error: "Not found" });
  if (req.headers.origin && !allowedOrigins.has(req.headers.origin))
    return reply(res, 403, { error: "Origin not allowed" });
  if (!key) return reply(res, 503, { error: "Smart search unavailable" });
  if (!req.headers["content-type"]?.startsWith("application/json"))
    return reply(res, 415, { error: "JSON required" });
  // Caddy overwrites this header; the service binds only to loopback.
  const client = String(
    req.headers["x-ui-viewer-ip"] || req.socket.remoteAddress || "unknown",
  );
  if (!perClient.take(client))
    return reply(res, 429, { error: "Use instant search for now" });
  let bytes = 0;
  const chunks: Buffer[] = [];
  try {
    for await (const chunk of req) {
      bytes += chunk.length;
      if (bytes > 2048) {
        reply(res, 413, { error: "Request too large" });
        req.resume();
        return;
      }
      chunks.push(Buffer.from(chunk));
    }
    const query = validQuery(
      JSON.parse(Buffer.concat(chunks).toString("utf8")),
    );
    if (!query)
      return reply(res, 400, {
        error: "Describe a component in 3–300 characters",
      });
    const cacheKey = query.toLowerCase();
    const saved = cache.get(cacheKey);
    if (saved && saved.until > Date.now()) return reply(res, 200, saved.intent);
    if (pending.has(cacheKey))
      return reply(res, 200, await pending.get(cacheKey));
    if (inFlight >= 4 || !globalLimit.take("all"))
      return reply(res, 429, { error: "Use instant search for now" });
    inFlight++;
    const promise = interpret(query);
    pending.set(cacheKey, promise);
    try {
      const intent = await promise;
      if (cache.size >= 1000) cache.delete(cache.keys().next().value!);
      cache.set(cacheKey, { intent, until: Date.now() + 3_600_000 });
      reply(res, 200, intent);
    } finally {
      inFlight--;
      pending.delete(cacheKey);
    }
  } catch (error) {
    reply(res, error instanceof SyntaxError ? 400 : 503, {
      error:
        error instanceof SyntaxError
          ? "Invalid JSON"
          : "Smart search unavailable; instant search is still available",
    });
  }
});
server.requestTimeout = 10_000;
server.headersTimeout = 10_000;
server.listen(Number(process.env.PORT || 8040), "127.0.0.1", () =>
  console.log("UI Viewer search listening on loopback"),
);
