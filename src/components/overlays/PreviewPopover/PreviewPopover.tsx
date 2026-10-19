import * as Primitive from "@radix-ui/react-popover";
import type { ReactElement, ReactNode } from "react";
import { usePreviewPopover } from "../../../hooks/usePreviewPopover";
import { Button } from "../../actions/Button/Button";

type Props = {
  title: string;
  slots: { trigger: ReactElement; body: ReactNode; footer?: ReactNode };
  className?: string;
};
/** Accessible nonmodal preview with caller-supplied trigger, body and footer slots. */
export function PreviewPopover({ title, slots, className = "" }: Props) {
  const {
    open,
    trigger: triggerRef,
    content: contentRef,
    onOpenChange,
    show,
    scheduleClose,
    focus,
    toggle,
    close,
    cancelClose,
  } = usePreviewPopover();
  return (
    <Primitive.Root open={open} onOpenChange={onOpenChange}>
      <Primitive.Trigger
        asChild
        ref={triggerRef}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") show();
        }}
        onPointerLeave={scheduleClose}
        onFocus={focus}
        onClick={(event) => {
          event.preventDefault();
          toggle();
        }}
      >
        {slots.trigger}
      </Primitive.Trigger>
      <Primitive.Portal>
        <Primitive.Content
          ref={contentRef}
          className={`preview-popover ${className}`}
          side="top"
          align="start"
          sideOffset={10}
          collisionPadding={16}
          sticky="always"
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
          onEscapeKeyDown={(event) => {
            event.preventDefault();
            close(true);
          }}
          onPointerEnter={cancelClose}
          onPointerLeave={scheduleClose}
          aria-label={title}
        >
          <div className="source-reference-heading">
            <h4>{title}</h4>
            <Button
              aria-label="Close source preview"
              onClick={() => close(true)}
            >
              ×
            </Button>
          </div>
          {slots.body}
          {slots.footer}
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
