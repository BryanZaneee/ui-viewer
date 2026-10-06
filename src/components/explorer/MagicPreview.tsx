import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { Marquee } from "@/components/magicui/marquee";
import { AuroraText } from "@/components/magicui/aurora-text";
import { NumberTicker } from "@/components/magicui/number-ticker";
import type { PreviewProps } from "./PatternPreview";
import "./magic.css";
export default function MagicPreview({ pattern, appearance: a }: PreviewProps) {
  const [count, setCount] = useState(1280);
  const reduced = useReducedMotion();
  return (
    <div className="demo-stack demo-center magic-demo">
      {pattern === "marquee" && (
        <>
          <span className="demo-eyebrow">YOUR NEXT IDEA STARTS HERE</span>
          <Marquee pauseOnHover repeat={2}>
            {["Design", "Build", "Explore", "Create"].map((x) => (
              <span key={x} className="magic-chip">
                {x}
              </span>
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover repeat={2}>
            {["Buttons", "Cards", "Motion", "Possibilities"].map((x) => (
              <span key={x} className="magic-chip">
                {x}
              </span>
            ))}
          </Marquee>
          <span className="demo-muted">Hover to pause</span>
        </>
      )}
      {pattern === "aurora" && (
        <>
          <span className="demo-eyebrow">A LITTLE MORE EXPRESSION</span>
          <h2
            style={{
              fontSize: 42,
              fontWeight: 750,
              lineHeight: 1.2,
              textAlign: "center",
            }}
          >
            <AuroraText
              colors={
                a.color ? [a.color, "#7928ca", a.color, "#0070f3"] : undefined
              }
            >
              {a.label === "Continue" ? "Make it magical." : a.label}
            </AuroraText>
          </h2>
          <span className="demo-muted">Animated gradients from Magic UI</span>
        </>
      )}
      {pattern === "ticker" && (
        <>
          <span className="demo-eyebrow">POSSIBILITIES EXPLORED</span>
          {reduced ? (
            <strong style={{ fontSize: 52 }}>{count.toLocaleString()}</strong>
          ) : (
            <NumberTicker
              key={count}
              value={count}
              className="text-5xl font-semibold"
              style={{ color: "var(--demo-accent)" }}
            />
          )}
          <button
            className="demo-button secondary"
            onClick={() => setCount(count + 128)}
          >
            Add a little more
          </button>
        </>
      )}
    </div>
  );
}
