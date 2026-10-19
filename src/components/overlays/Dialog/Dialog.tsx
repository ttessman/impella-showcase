import * as Primitive from "@radix-ui/react-dialog";
import { useRef } from "react";
import type { ReactNode } from "react";

export type DialogState = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
type Props = {
  state: DialogState;
  definition: { title: string; description?: string };
  slots: { header?: ReactNode; body: ReactNode; footer?: ReactNode };
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
          className={`dialog-surface ${className}`}
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
          {slots.header}
          {slots.body}
          {slots.footer}
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
export const DialogClose = Primitive.Close;
