import { imageOptions } from "./studioAssets";
import type { ContentPage } from "../types/content";
export function defaultPage(): ContentPage {
  return {
    title: "A field guide to noticing",
    primary_content_value: [
      {
        id: "intro",
        bundle: "header",
        header: "Small observations. New ideas.",
        level: 2,
      },
      {
        id: "opening",
        bundle: "text_block",
        text_body:
          "A fictional journal about making time to look closely. Collect a color, sketch a shape, and write down one unexpected detail.",
      },
      {
        id: "landscape",
        bundle: "media",
        media: {
          bundle: "demo_image",
          url: imageOptions[0],
          alt: "Illustrated green mountains under a golden sun",
        },
        media_caption: "Field notes, an invented creative project.",
      },
      {
        id: "chapter",
        bundle: "demo_section",
        header: "Take a closer look",
        children: [
          {
            id: "prompt",
            bundle: "text_block",
            text_body:
              "Choose an ordinary object. Describe its texture without naming the object.",
          },
        ],
      },
      {
        id: "sources",
        bundle: "references_accordion",
        references_accordion_title: "Reading notes",
        references_container: {
          references: ["Fictional field journal, volume one."],
        },
      },
    ],
  };
}
