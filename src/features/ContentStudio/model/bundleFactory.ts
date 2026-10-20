import type { StudioBundleName, StudioBundle } from "./studioDocument";
import { imageOptions } from "../../../content/studioAssets";
export function makeBundle(bundle: StudioBundleName): StudioBundle {
  const id = crypto.randomUUID();
  switch (bundle) {
    case "header":
      return { id, bundle, header: "New heading", level: 2 };
    case "text_block":
      return {
        id,
        bundle,
        text_body: "Add a note from your next creative adventure.",
      };
    case "media":
      return {
        id,
        bundle,
        media: {
          bundle: "demo_image",
          url: imageOptions[0],
          alt: "Illustrated green mountains under a golden sun",
        },
        media_caption: "A fictional field journal illustration.",
      };
    case "demo_section":
      return { id, bundle, header: "New section", children: [] };
    case "references_accordion":
      return {
        id,
        bundle,
        references_accordion_title: "References",
        references_container: {
          references: [
            "Fictional field journal, volume one.",
            "Fictional studio notes, edition two.",
          ],
        },
      };
  }
}
