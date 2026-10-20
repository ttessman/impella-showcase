import { useEffect, useId, useRef, useState } from "react";
import { Button } from "../Button/Button";
import { Tooltip } from "../Tooltip/Tooltip";
import type { SourceReferenceData } from "./SourceReference";

/** Compact file navigation and code canvas, driven by source illustrations. */
export function SourceCodePreview({ source }: { source: SourceReferenceData }) {
  const id = useId();
  const initialIndex = source.files.findIndex(
    (file) => file.path === source.initialFile,
  );
  const [active, setActive] = useState(Math.max(0, initialIndex));
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const code = useRef<HTMLPreElement>(null);
  useEffect(() => {
    tabs.current[active]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "instant",
    });
  }, [active]);
  const file = source.files[active];
  function select(index: number) {
    setActive(index);
    code.current?.scrollTo(0, 0);
  }
  return (
    <div className="source-code-preview">
      <div
        role="tablist"
        aria-label="Source files"
        className="source-file-tabs"
      >
        {source.files.map((item, index) => (
          <Tooltip key={item.path} label={`${item.path} — ${item.context}`}>
            <Button
              ref={(element) => {
                tabs.current[index] = element;
              }}
              role="tab"
              id={`${id}-tab-${index}`}
              aria-controls={`${id}-panel`}
              aria-label={item.path}
              aria-selected={index === active}
              tabIndex={index === active ? 0 : -1}
              onClick={() => select(index)}
              onKeyDown={(event) => {
                const last = source.files.length - 1;
                const next =
                  event.key === "ArrowRight"
                    ? (active + 1) % source.files.length
                    : event.key === "ArrowLeft"
                      ? (active + last) % source.files.length
                      : event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? last
                          : null;
                if (next !== null) {
                  event.preventDefault();
                  select(next);
                  tabs.current[next]?.focus({ preventScroll: true });
                }
              }}
            >
              {item.path.split("/").at(-1)}
            </Button>
          </Tooltip>
        ))}
      </div>
      <pre
        ref={code}
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${active}`}
        tabIndex={0}
      >
        <code>{file.example}</code>
      </pre>
      <details className="source-file-context">
        <summary>About this file</summary>
        <p>{file.context}</p>
        <p>{source.summary}</p>
      </details>
    </div>
  );
}
