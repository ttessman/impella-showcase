import type { ReactNode } from "react";
import { Button } from "../../actions/Button/Button";
import { Dialog, DialogClose } from "../../overlays/Dialog/Dialog";
import type { DialogState } from "../../overlays/Dialog/Dialog";

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
  caption,
  footer,
  className = "",
}: {
  state: DialogState;
  image: EvidenceImage;
  title: string;
  closeLabel?: string;
  caption?: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <Dialog
      state={state}
      definition={{ title }}
      className={`image-dialog ${className}`}
      slots={{
        header: <h3>{title}</h3>,
        actions: (
          <DialogClose asChild>
            <Button>{closeLabel} ×</Button>
          </DialogClose>
        ),
        body: (
          <>
            {caption && <p className="small">{caption}</p>}
            <img {...image} />
          </>
        ),
        footer,
      }}
    />
  );
}
