import type { EvidenceImage } from "../../../../overlays/ImageDialog/ImageDialog";
export type MediaDefinition = {
  image: EvidenceImage;
  title: string;
  variant: "hero" | "original" | "linked" | "evidence" | "gallery" | "inline";
  body?: string;
  captionLabel?: string;
  triggerLabel?: string;
  closeLabel?: string;
  originalLinkLabel?: string;
};
