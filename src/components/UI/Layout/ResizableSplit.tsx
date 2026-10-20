import { useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  first: ReactNode;
  second: ReactNode;
  axis: "x" | "y";
  value: number;
  onChange: (value: number) => void;
  label: string;
  className: string;
  firstCollapsed?: boolean;
  collapsedFirst?: ReactNode;
  reverse?: boolean;
  min?: number;
  max?: number;
  initial?: number;
};

/** Controlled split; resizing changes presentation only, so editor state stays mounted. */
export function ResizableSplit({
  first,
  second,
  axis,
  value,
  onChange,
  label,
  className,
  firstCollapsed = false,
  collapsedFirst,
  reverse = false,
  min = 30,
  max = 70,
  initial = 50,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const resizing = useRef(false);
  const change = (next: number) => onChange(Math.min(max, Math.max(min, next)));
  function resizeAt(x: number, y: number) {
    const rect = root.current?.getBoundingClientRect();
    if (!rect) return;
    const length = (axis === "x" ? rect.width : rect.height) - 12;
    if (length > 0)
      change(
        (((axis === "x" ? x - rect.left : y - rect.top) - 6) / length) * 100,
      );
  }
  const firstSlot = (
    <div
      key="first"
      className="split-slot"
      hidden={firstCollapsed && !collapsedFirst}
    >
      <div className="split-content" hidden={firstCollapsed}>
        {first}
      </div>
      {collapsedFirst && (
        <div className="collapsed-content" hidden={!firstCollapsed}>
          {collapsedFirst}
        </div>
      )}
    </div>
  );
  const secondSlot = (
    <div key="second" className="split-slot">
      {second}
    </div>
  );
  const separator = (
    <div
      key="separator"
      className="split-handle"
      hidden={firstCollapsed}
      role="separator"
      tabIndex={0}
      aria-label={label}
      aria-orientation={axis === "x" ? "vertical" : "horizontal"}
      aria-valuenow={Math.round(value)}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={`${Math.round(value)} percent`}
      aria-describedby="workspace-layout-help"
      onPointerDown={(event) => {
        if (event.button !== 0 || !event.isPrimary) return;
        resizing.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.focus({ preventScroll: true });
      }}
      onPointerMove={(event) => {
        if (resizing.current) resizeAt(event.clientX, event.clientY);
      }}
      onPointerUp={() => {
        resizing.current = false;
      }}
      onPointerCancel={() => {
        resizing.current = false;
      }}
      onLostPointerCapture={() => {
        resizing.current = false;
      }}
      onDoubleClick={() => change(initial)}
      onKeyDown={(event) => {
        const decrease = axis === "x" ? "ArrowLeft" : "ArrowUp";
        const increase = axis === "x" ? "ArrowRight" : "ArrowDown";
        if (![decrease, increase, "Home", "End", "Enter"].includes(event.key))
          return;
        event.preventDefault();
        change(
          event.key === "Home"
            ? min
            : event.key === "End"
              ? max
              : event.key === "Enter"
                ? initial
                : value +
                  (event.key === increase ? 1 : -1) * (event.shiftKey ? 10 : 2),
        );
      }}
    >
      <span aria-hidden="true" />
    </div>
  );
  return (
    <div
      ref={root}
      className={`resizable-split axis-${axis} ${className}`}
      data-first-collapsed={firstCollapsed}
      style={
        {
          "--first-pane": `${value}fr`,
          "--second-pane": `${100 - value}fr`,
        } as CSSProperties
      }
    >
      {reverse
        ? [secondSlot, separator, firstSlot]
        : [firstSlot, separator, secondSlot]}
    </div>
  );
}
