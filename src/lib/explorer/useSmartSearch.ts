import { useEffect, useState } from "react";
import { patterns, type Pattern } from "./catalog";
type Result = {
  query: string;
  pattern: Pattern | null;
  status: "matching" | "matched" | "local";
};
const cache = new Map<string, Pattern | null>();
export function useSmartSearch(query: string) {
  const [available, setAvailable] = useState(false);
  const [enabled, setEnabled] = useState(() => {
    try {
      return localStorage.getItem("ui-viewer-smart") !== "off";
    } catch {
      return true;
    }
  });
  const [result, setResult] = useState<Result>({
    query: "",
    pattern: null,
    status: "local",
  });
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${import.meta.env.BASE_URL}api/health`, {
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setAvailable(data?.available === true))
      .catch(() => {});
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (!available || !enabled || query.trim().length < 3) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      if (cache.has(query)) {
        setResult({ query, pattern: cache.get(query)!, status: "matched" });
        return;
      }
      setResult({ query, pattern: null, status: "matching" });
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}api/interpret`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
            signal: AbortSignal.any([
              controller.signal,
              AbortSignal.timeout(6000),
            ]),
          },
        );
        if (!response.ok) throw new Error("Unavailable");
        const data = await response.json();
        const pattern = patterns.find((p) => p.id === data.pattern)?.id ?? null;
        if (controller.signal.aborted) return;
        if (cache.size >= 100) cache.delete(cache.keys().next().value!);
        cache.set(query, pattern);
        setResult({ query, pattern, status: "matched" });
      } catch {
        if (!controller.signal.aborted)
          setResult({ query, pattern: null, status: "local" });
      }
    }, 450);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, enabled, available]);
  return {
    available,
    enabled,
    toggle: () => {
      setEnabled((v) => {
        try {
          localStorage.setItem("ui-viewer-smart", v ? "off" : "on");
        } catch {
          /* Storage is optional. */
        }
        return !v;
      });
    },
    pattern: enabled && result.query === query ? result.pattern : null,
    status: enabled && result.query === query ? result.status : "local",
  };
}
