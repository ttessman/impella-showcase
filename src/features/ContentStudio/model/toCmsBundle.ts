import type { StudioBundle } from "./studioDocument";
import type { CmsNode } from "../../../types/cms";

/** Compatibility boundary: the bounded studio editor keeps its draft format;
 * its preview uses the same recursive renderer as authored case-study pages. */
export function studioNode(block: StudioBundle): CmsNode {
  switch (block.bundle) {
    case "header":
      return {
        id: `studio-block-${block.id}`,
        bundle: "heading",
        metadata: { level: block.level === 2 ? 3 : 4 },
        content: block.header,
      };
    case "text_block":
      return {
        id: `studio-block-${block.id}`,
        bundle: "text_block",
        metadata: { variant: "plain" },
        content: block.text_body,
      };
    case "media":
      return {
        id: `studio-block-${block.id}`,
        bundle: "media",
        metadata: {
          src: `/${block.media.url}`,
          alt: block.media.alt,
          width: 800,
          height: 480,
          title: block.media.alt,
          variant: "inline",
        },
        content: [
          {
            id: `studio-caption-${block.id}`,
            bundle: "text_block",
            metadata: {},
            content: block.media_caption,
          },
        ],
      };
    case "demo_section":
      return {
        id: `studio-block-${block.id}`,
        bundle: "section",
        metadata: { label: block.header, variant: "preview" },
        content: [
          {
            id: `studio-heading-${block.id}`,
            bundle: "heading",
            metadata: { level: 3 },
            content: block.header,
          },
          ...block.children.map(studioNode),
        ],
      };
    case "references_accordion":
      return {
        id: `studio-block-${block.id}`,
        bundle: "references_accordion",
        metadata: { label: block.references_accordion_title || "References" },
        content: block.references_container.references.map((text, index) => ({
          id: `studio-reference-${index}-${block.id}`,
          bundle: "text_block",
          metadata: {},
          content: text,
        })),
      };
  }
}
