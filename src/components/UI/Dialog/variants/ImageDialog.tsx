import { Icon } from "../../Icon/Icon";
import type { CSSProperties, ReactNode } from "react";
import { IconButton } from "../../Button/variants/IconButton";
import { Dialog, DialogClose } from "../Dialog";
import type { DialogSize, DialogState } from "../Dialog";

export type EvidenceImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};
/** One enlarged-image experience for product screenshots and original evidence. */
export function ImageDialog({
  state,
  image,
  title,
  closeLabel = "Close screenshot",
  size = "small",
  caption,
  footer,
  className = "",
}: {
  state: DialogState;
  image: EvidenceImage;
  title: string;
  closeLabel?: string;
  size?: DialogSize;
  caption?: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <Dialog
      state={state}
      size={size}
      definition={{ title }}
      className={`image-dialog ${className}`}
      slots={{
        header: <h3>{title}</h3>,
        actions: (
          <DialogClose asChild>
            <IconButton
              label={closeLabel}
              onEscape={() => state.onOpenChange(false)}
            >
              <Icon type="close" />
            </IconButton>
          </DialogClose>
        ),
        body: (
          <>
            {caption && <p className="small">{caption}</p>}
            <img
              {...image}
              style={
                { "--image-natural-width": `${image.width}px` } as CSSProperties
              }
            />
          </>
        ),
        footer,
      }}
    />
  );
}
