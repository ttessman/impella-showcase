import { useState } from "react";
import { ImageDialog } from "../ImageDialog/ImageDialog";
import type { EvidenceImage } from "../ImageDialog/ImageDialog";

export function EvidenceScreenshot({
  definition,
}: {
  definition: { title: string; image: EvidenceImage; caption: string };
}) {
  const [open, setOpen] = useState(false);
  return (
    <figure className="evidence-screenshot">
      <button
        type="button"
        aria-label={`Enlarge ${definition.title} screenshot`}
        onClick={() => setOpen(true)}
      >
        <img {...definition.image} loading="lazy" />
        <span>View full size ↗</span>
      </button>
      <figcaption>{definition.caption}</figcaption>
      <ImageDialog
        state={{ open, onOpenChange: setOpen }}
        title={definition.title}
        image={definition.image}
      />
    </figure>
  );
}
