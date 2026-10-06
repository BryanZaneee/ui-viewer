import { validAppearance } from "./values";
import { appearance } from "./catalog";
import { useEffect, useState } from "react";
import { patterns, type Appearance, type Pattern } from "./catalog";
type Result = {
  query: string;
  displayQuery: string;
  pattern: Pattern | null;
  values?: Partial<Appearance>;
  status: "matching" | "matched" | "local";
};
const cache = new Map<
  string,
  { pattern: Pattern | null; values?: Partial<Appearance> }
>();
export function useSmartSearch(query: string) {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [result, setResult] = useState<Result>({
    query: "",
    displayQuery: "",
    pattern: null,
    status: "local",
  });
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${import.meta.env.BASE_URL}api/health`, {
      signal: AbortSignal.any([controller.signal, AbortSignal.timeout(4000)]),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setAvailable(data?.available === true))
      .catch(() => {
        if (!controller.signal.aborted) setAvailable(false);
      });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (!query.trim()) {
      setResult({
        query: "",
        displayQuery: "",
        pattern: null,
        status: "local",
      });
      return;
    }
    if (available !== true || query.trim().length < 3) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      if (cache.has(query)) {
        setResult({
          query,
          displayQuery: query,
          ...cache.get(query)!,
          status: "matched",
        });
        return;
      }
      // Keep the last completed preview intact through debounce and network work.
      setResult((previous) => ({ ...previous, query, status: "matching" }));
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}api/interpret`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
            signal: AbortSignal.any([
              controller.signal,
              AbortSignal.timeout(9000),
            ]),
          },
        );
        if (!response.ok) throw new Error("Unavailable");
        const data = await response.json();
        const pattern = patterns.find((p) => p.id === data.pattern)?.id ?? null;
        if (controller.signal.aborted) return;
        if (cache.size >= 100) cache.delete(cache.keys().next().value!);
        const values =
          data.values && validAppearance({ ...appearance(""), ...data.values })
            ? (data.values as Partial<Appearance>)
            : undefined;
        cache.set(query, { pattern, values });
        setResult({
          query,
          displayQuery: query,
          pattern,
          values,
          status: "matched",
        });
      } catch {
        if (!controller.signal.aborted)
          setResult((previous) =>
            previous.displayQuery
              ? { ...previous, query, status: "local" }
              : { query, displayQuery: query, pattern: null, status: "local" },
          );
      }
    }, 450);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, available]);
  const local = available === false || !query.trim();
  return {
    available,
    query: local ? query : result.displayQuery,
    pattern: local ? null : result.pattern,
    values: local ? undefined : result.values,
    pending:
      !local &&
      query.trim().length >= 3 &&
      (result.query !== query || result.status === "matching"),
  };
}
