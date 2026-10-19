import * as Primitive from "@radix-ui/react-popover";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import { usePreviewPopover } from "../../../hooks/usePreviewPopover";
import { IconButton } from "../../actions/IconButton/IconButton";
import { WorkspaceIcon } from "../../icons/WorkspaceIcon/WorkspaceIcon";

type Props = {
  title: string;
  slots: { trigger: ReactElement; body: ReactNode; footer?: ReactNode };
  className?: string;
  style?: CSSProperties;
  anchor?: "center" | "start";
};
/** Accessible nonmodal preview with caller-supplied trigger, body and footer slots. */
export function PreviewPopover({
  title,
  slots,
  className = "",
  style,
  anchor = "center",
}: Props) {
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
      {anchor === "start" && (
        <Primitive.Anchor asChild>
          <span aria-hidden="true" className="preview-popover-anchor" />
        </Primitive.Anchor>
      )}
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
          alignOffset={anchor === "start" ? -20 : 0}
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
            <IconButton
              label="Close source preview"
              onEscape={() => close(true)}
              onClick={() => close(true)}
            >
              <WorkspaceIcon name="close" />
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
