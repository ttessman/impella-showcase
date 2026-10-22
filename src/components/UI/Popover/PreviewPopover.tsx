import * as Primitive from "@radix-ui/react-popover";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import { usePreviewPopover } from "../../../hooks/usePreviewPopover";
import { IconButton } from "../Button/variants/IconButton";
import { Icon } from "../Icon/Icon";

type Props = {
  title: string;
  slots: { trigger: ReactElement; body: ReactNode; footer?: ReactNode };
  className?: string;
  style?: CSSProperties;
};
/** Accessible nonmodal preview with caller-supplied trigger, body and footer slots. */
export function PreviewPopover({ title, slots, className = "", style }: Props) {
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
          style={style}
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
          <div className="preview-popover-heading">
            <h4>{title}</h4>
            <IconButton
              label="Close source preview"
              onEscape={() => close(true)}
              onClick={() => close(true)}
            >
              <Icon type="close" />
            </IconButton>
          </div>
          {slots.body}
          {slots.footer}
          <Primitive.Arrow
            className="preview-popover-arrow"
            width={20}
            height={10}
          />
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
