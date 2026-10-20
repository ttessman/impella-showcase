import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "../../Button/Button";
import type { DialogSize } from "../Dialog";
import { ImageDialog } from "./ImageDialog";
import type { EvidenceImage } from "./ImageDialog";

type Props = {
  image: EvidenceImage;
  title: string;
  closeLabel: string;
  size?: DialogSize;
  children: ReactNode;
  label?: string;
  className?: string;
};

/** Images and authored actions share the same dialog lifecycle and image presentation. */
export function ImageDialogTrigger({
  image,
  title,
  closeLabel,
  size,
  children,
  label,
  className,
}: Props) {
  const [open, onOpenChange] = useState(false);
  return (
    <>
      <Button
        className={className}
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => onOpenChange(true)}
      >
        {children}
      </Button>
      <ImageDialog
        state={{ open, onOpenChange }}
        image={image}
        title={title}
        closeLabel={closeLabel}
        size={size}
      />
    </>
  );
}
