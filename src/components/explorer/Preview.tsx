import { useEffect, useRef, useState } from "react";
import {
  isReference,
  type Entry,
  type Appearance,
} from "@/lib/explorer/catalog";

// Frames isolate each library's resets, CSS tokens, providers, and portal layers.
// Unmount distant frames to bound memory and stop offscreen animation work.
export function Preview({
  entry,
  appearance,
}: {
  entry: Entry;
  appearance: Appearance;
}) {
  const container = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const latest = useRef(appearance);
  latest.current = appearance;
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([record]) => setVisible(record.isIntersecting),
      { rootMargin: "100px" },
    );
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (
        event.origin !== location.origin ||
        event.source !== frame.current?.contentWindow ||
        event.data?.type !== "ui-viewer-ready"
      )
        return;
      setReady(true);
      frame.current?.contentWindow?.postMessage(
        { type: "ui-viewer-appearance", appearance: latest.current },
        location.origin,
      );
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, []);
  useEffect(() => {
    frame.current?.contentWindow?.postMessage(
      { type: "ui-viewer-appearance", appearance },
      location.origin,
    );
  }, [appearance]);
  useEffect(() => {
    if (!visible) setReady(false);
  }, [visible]);
  if (isReference(entry.library.id))
    return (
      <div className="reference-preview">
        <span className="reference-mark">↗</span>
        <strong>Explore {entry.library.name}</strong>
        <p>{entry.pattern.description}</p>
        <a href={entry.library.docs} target="_blank" rel="noreferrer">
          View original components ↗
        </a>
        <span>Reference link · source stays with its creator</span>
      </div>
    );
  return (
    <div
      ref={container}
      className="preview-frame-wrap"
      data-dark={appearance.dark}
    >
      {!ready && (
        <div className="frame-placeholder" role="status">
          {visible
            ? "Loading interactive preview…"
            : "Preview loads as you explore"}
        </div>
      )}
      {visible && (
        <iframe
          ref={frame}
          className="preview-frame"
          data-ready={ready}
          title={`${entry.library.name} ${entry.pattern.name} interactive preview`}
          src={`${import.meta.env.BASE_URL}preview.html?entry=${encodeURIComponent(entry.id)}`}
          loading="lazy"
        />
      )}
    </div>
  );
}
