import * as Primitive from "@radix-ui/react-dialog";
import { useRef } from "react";
import type { ReactNode } from "react";

export type DialogSize = "small" | "default" | "large";

export type DialogState = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
type Props = {
  state: DialogState;
  definition: { title: string; description?: string };
  slots: {
    header?: ReactNode;
    actions?: ReactNode;
    body: ReactNode;
    footer?: ReactNode;
  };
  variant?: "standard" | "workspace";
  size?: DialogSize;
  className?: string;
  id?: string;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
};

/** Radix owns modality and dismissal; named slots own the dialog's content. */
export function Dialog({
  state,
  definition,
  slots,
  className = "",
  variant = "standard",
  size = "default",
  id,
  onEscapeKeyDown,
}: Props) {
  const opener = useRef<HTMLElement | null>(null);
  return (
    <Primitive.Root {...state}>
      <Primitive.Portal>
        <Primitive.Overlay className="dialog-overlay" />
        <Primitive.Content
          id={id}
          onEscapeKeyDown={onEscapeKeyDown}
          className={`dialog-surface dialog-${variant} dialog-size-${size} ${className}`}
          {...(!definition.description
            ? { "aria-describedby": undefined }
            : {})}
          onOpenAutoFocus={() => {
            opener.current = document.activeElement as HTMLElement;
          }}
          onCloseAutoFocus={(event) => {
            if (opener.current?.isConnected) {
              event.preventDefault();
              opener.current.focus({ preventScroll: true });
            }
          }}
        >
          <Primitive.Title className="sr-only">
            {definition.title}
          </Primitive.Title>
          {definition.description && (
            <Primitive.Description className="sr-only">
              {definition.description}
            </Primitive.Description>
          )}
          <header className="dialog-header">
            <div className="dialog-heading">
              {slots.header ?? <h3>{definition.title}</h3>}
            </div>
            {slots.actions && (
              <div className="dialog-header-actions">{slots.actions}</div>
            )}
          </header>
          <div
            className="dialog-body"
            role="region"
            aria-label={`${definition.title} content`}
            tabIndex={0}
          >
            {slots.body}
          </div>
          {slots.footer != null && (
            <footer className="dialog-footer">{slots.footer}</footer>
          )}
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
