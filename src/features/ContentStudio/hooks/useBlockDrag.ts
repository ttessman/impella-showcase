import { useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { DropTarget } from "../model/contentTree";

type Drag = { id: string; label: string; target: DropTarget | null };
const readTarget = (element: HTMLElement): DropTarget => ({
  parentId: element.dataset.parentId || null,
  beforeId: element.dataset.beforeId || null,
});
export const targetKey = (target: DropTarget) =>
  JSON.stringify([target.parentId, target.beforeId]);

/** Pointer capture supports mouse, pen and touch; keyboard uses the same destinations. */
export function useBlockDrag({
  disabled,
  drop,
  announce,
}: {
  disabled: boolean;
  drop: (id: string, target: DropTarget) => void;
  announce: (message: string) => void;
}) {
  const [drag, setDrag] = useState<Drag | null>(null);
  const active = useRef<Drag | null>(null);
  const origin = useRef<{ x: number; y: number } | null>(null);
  function update(next: Drag | null) {
    active.current = next;
    setDrag(next);
  }
  function cancel() {
    update(null);
    origin.current = null;
  }
  function finish() {
    const current = active.current;
    cancel();
    if (!disabled && current?.target) {
      drop(current.id, current.target);
      requestAnimationFrame(() =>
        document
          .querySelector<HTMLButtonElement>(
            `[data-drag-handle="${current.id}"]`,
          )
          ?.focus({ preventScroll: true }),
      );
    } else if (current)
      announce("Move cancelled. Choose a drop position to move the block.");
  }
  function hitTarget(x: number, y: number) {
    const element = document.elementFromPoint(x, y);
    if (!element) return null;
    const container = element.closest<HTMLElement>("[data-drop-container]");
    const item = element.closest<HTMLElement>("li[data-block-id]");
    const row =
      element.closest<HTMLElement>("[data-drag-row]") ??
      (item?.parentElement === container
        ? item?.querySelector<HTMLElement>(":scope > [data-drag-row]")
        : null);
    let target: DropTarget;
    if (row) {
      const bounds = row.getBoundingClientRect();
      target = {
        parentId: row.dataset.parentId || null,
        beforeId:
          y < bounds.top + bounds.height / 2
            ? row.dataset.blockId!
            : row.dataset.nextId || null,
      };
    } else {
      if (!container) return null;
      const following = Array.from(
        container.querySelectorAll<HTMLElement>(":scope > li[data-block-id]"),
      ).find((sibling) => y < sibling.getBoundingClientRect().top);
      target = {
        parentId: container.dataset.parentId || null,
        beforeId: following?.dataset.blockId || null,
      };
    }
    return (
      Array.from(
        document.querySelectorAll<HTMLElement>("[data-drop-target]"),
      ).find(
        (candidate) =>
          candidate.dataset.dropDisabled !== "true" &&
          targetKey(readTarget(candidate)) === targetKey(target),
      ) ?? null
    );
  }

  return {
    drag,
    cancel,
    handle: (id: string, label: string) => ({
      onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
        if (disabled || !event.isPrimary || event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        origin.current = { x: event.clientX, y: event.clientY };
      },
      onPointerMove: (event: PointerEvent<HTMLButtonElement>) => {
        if (!origin.current || disabled) return;
        if (
          !active.current &&
          Math.hypot(
            event.clientX - origin.current.x,
            event.clientY - origin.current.y,
          ) < 5
        )
          return;
        const element = hitTarget(event.clientX, event.clientY);
        update({ id, label, target: element ? readTarget(element) : null });
        const studio = event.currentTarget.closest<HTMLElement>(
          "[data-editor-scroll]",
        );
        const bounds = studio?.getBoundingClientRect();
        if (studio && bounds) {
          if (event.clientY < bounds.top + 45) studio.scrollBy(0, -16);
          else if (event.clientY > bounds.bottom - 45) studio.scrollBy(0, 16);
        } else if (event.clientY < 70) window.scrollBy(0, -16);
        else if (event.clientY > window.innerHeight - 70)
          window.scrollBy(0, 16);
      },
      onPointerUp: () => {
        if (active.current) finish();
        else origin.current = null;
      },
      onPointerCancel: () => {
        cancel();
        announce("Move cancelled.");
      },
      onLostPointerCapture: () => {
        if (origin.current) cancel();
      },
      onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
        if (disabled) return;
        if (event.key === "Escape") {
          event.preventDefault();
          cancel();
          announce("Move cancelled.");
          return;
        }
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          if (active.current) finish();
          else {
            update({ id, label, target: null });
            announce(
              `Picked up ${label}. Use arrow keys to choose a position, Enter to drop, or Escape to cancel.`,
            );
          }
        } else if (
          active.current &&
          [
            "ArrowUp",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",
            "Home",
            "End",
          ].includes(event.key)
        ) {
          event.preventDefault();
          const targets = Array.from(
            document.querySelectorAll<HTMLElement>("[data-drop-target]"),
          ).filter((el) => el.dataset.dropDisabled !== "true");
          if (!targets.length) return;
          const currentIndex = targets.findIndex(
            (el) =>
              active.current?.target &&
              targetKey(readTarget(el)) === targetKey(active.current.target),
          );
          const forward =
            event.key === "ArrowDown" || event.key === "ArrowRight";
          const index =
            event.key === "Home"
              ? 0
              : event.key === "End"
                ? targets.length - 1
                : (currentIndex + (forward ? 1 : -1) + targets.length) %
                  targets.length;
          const element = targets[index];
          update({ id, label, target: readTarget(element) });
          element.scrollIntoView({ block: "nearest" });
          announce(element.dataset.dropLabel || "Drop position selected.");
        }
      },
    }),
  };
}
export type BlockDrag = ReturnType<typeof useBlockDrag>;
