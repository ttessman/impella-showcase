import { useEffect, useId, useRef, useState } from "react";

export type SourceReferenceData = {
  title: string;
  paths: string[];
  summary: string;
  example: string;
};

function positionPreview(panel: HTMLDivElement, button: HTMLButtonElement) {
  const anchor = button.getBoundingClientRect();
  const box = panel.getBoundingClientRect();
  panel.style.left = `${Math.max(16, Math.min(anchor.left, innerWidth - box.width - 16))}px`;
  const preferred =
    anchor.top >= box.height + 24
      ? anchor.top - box.height - 10
      : anchor.bottom + 10;
  panel.style.top = `${Math.max(16, Math.min(preferred, innerHeight - box.height - 16))}px`;
}

/** A nonmodal source preview: hover/focus to inspect, click/tap to keep open. */
export function SourceReference({ source }: { source: SourceReferenceData }) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const pinned = useRef(false);
  const suppressFocus = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [open, setOpen] = useState(false);
  function cancelClose() {
    clearTimeout(timer.current);
  }
  function close(restoreFocus = false) {
    cancelClose();
    pinned.current = false;
    popup.current?.hidePopover();
    if (restoreFocus) {
      suppressFocus.current = document.activeElement !== trigger.current;
      trigger.current?.focus({ preventScroll: true });
    }
  }
  function show() {
    cancelClose();
    const panel = popup.current;
    const button = trigger.current;
    if (!panel || !button) return;
    panel.showPopover();
    positionPreview(panel, button);
  }
  function scheduleClose() {
    if (
      pinned.current ||
      document.activeElement === trigger.current ||
      popup.current?.contains(document.activeElement)
    )
      return;
    cancelClose();
    timer.current = setTimeout(() => popup.current?.hidePopover(), 180);
  }
  useEffect(() => {
    function dismiss(event: Event) {
      if (event.target instanceof Node && popup.current?.contains(event.target))
        return;
      const panel = popup.current;
      const button = trigger.current;
      if (!panel || !button || !panel.matches(":popover-open")) return;
      const anchor = button.getBoundingClientRect();
      if (anchor.bottom < 0 || anchor.top > innerHeight) {
        pinned.current = false;
        panel.hidePopover();
      } else positionPreview(panel, button);
    }
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    return () => {
      clearTimeout(timer.current);
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
    };
  }, []);
  return (
    <div
      className="source-note source-reference"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          close(true);
        }
      }}
    >
      <button
        type="button"
        className="source-reference-trigger"
        ref={trigger}
        aria-expanded={open}
        aria-controls={id}
        aria-haspopup="dialog"
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") show();
        }}
        onPointerLeave={scheduleClose}
        onFocus={() => {
          if (suppressFocus.current) {
            suppressFocus.current = false;
            return;
          }
          show();
        }}
        onClick={() => {
          if (pinned.current) close();
          else {
            pinned.current = true;
            show();
          }
        }}
      >
        Source: {source.paths.join(" · ")}{" "}
        <span aria-hidden="true">&lt;/&gt;</span>
      </button>
      <div
        ref={popup}
        id={id}
        popover="auto"
        className="source-reference-popup"
        role="dialog"
        aria-labelledby={`${id}-title`}
        onToggle={(event) => {
          const visible =
            (event.nativeEvent as ToggleEvent).newState === "open";
          setOpen(visible);
          if (!visible) pinned.current = false;
        }}
        onPointerEnter={cancelClose}
        onPointerLeave={scheduleClose}
      >
        <div className="source-reference-heading">
          <h4 id={`${id}-title`}>{source.title}</h4>
          <button
            type="button"
            aria-label="Close source preview"
            onClick={() => close(true)}
          >
            ×
          </button>
        </div>
        <p>{source.summary}</p>
        <pre tabIndex={0} aria-label={`${source.title} illustrative code`}>
          <code>{source.example}</code>
        </pre>
        <p className="source-reference-disclaimer">
          Independently written illustration · Not original Impella source code.
        </p>
      </div>
    </div>
  );
}
