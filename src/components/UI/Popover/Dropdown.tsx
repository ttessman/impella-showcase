import * as Popover from "@radix-ui/react-popover";
import { useRef } from "react";
import type { ReactElement, ReactNode } from "react";

type Props = {
  label: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactElement;
  children: ReactNode;
  variant?: "actions" | "navigation";
  align?: "start" | "center" | "end";
  className?: string;
};

/** Shared dropdown surface, spacing, dismissal and keyboard/focus behavior. */
export function Dropdown({
  label,
  open,
  onOpenChange,
  trigger,
  children,
  variant = "actions",
  align = "end",
  className = "",
}: Props) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild ref={triggerRef}>
        {trigger}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          ref={contentRef}
          className={`dropdown dropdown-${variant} ${className}`}
          aria-label={label}
          align={align}
          sideOffset={4}
          collisionPadding={12}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            const target = contentRef.current?.querySelector<HTMLElement>(
              "[data-dropdown-item][aria-current], [data-dropdown-item]:not(:disabled)",
            );
            const current = contentRef.current?.querySelector<HTMLElement>(
              "[data-dropdown-item][aria-current]",
            );
            (current ?? target)?.focus({ preventScroll: true });
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            triggerRef.current?.focus({ preventScroll: true });
          }}
          onKeyDown={(event) => {
            if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key))
              return;
            const items = Array.from(
              event.currentTarget.querySelectorAll<HTMLElement>(
                "[data-dropdown-item]:not(:disabled)",
              ),
            );
            if (!items.length) return;
            const index = items.indexOf(document.activeElement as HTMLElement);
            const next =
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? items.length - 1
                  : (index +
                      (event.key === "ArrowDown" ? 1 : -1) +
                      items.length) %
                    items.length;
            event.preventDefault();
            items[next]?.focus({ preventScroll: true });
            items[next]?.scrollIntoView({ block: "nearest" });
          }}
        >
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
