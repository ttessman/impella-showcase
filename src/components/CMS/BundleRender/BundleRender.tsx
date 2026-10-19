import type { ContentBlock } from "../../../types/content";
import { HeadingBlock } from "../blocks/HeadingBlock/HeadingBlock";
import { TextBlock } from "../blocks/TextBlock/TextBlock";
import { MediaBlock } from "../blocks/MediaBlock/MediaBlock";
import { SectionBlock } from "../blocks/SectionBlock/SectionBlock";
import { ReferencesBlock } from "../blocks/ReferencesBlock/ReferencesBlock";

/** Exhaustive dispatch follows the original architecture; sections recurse through ContentView. */
export function BundleRender({ block }: { block: ContentBlock }) {
  switch (block.bundle) {
    case "header":
      return <HeadingBlock block={block} />;
    case "text_block":
      return <TextBlock block={block} />;
    case "media":
      return <MediaBlock block={block} />;
    case "demo_section":
      return <SectionBlock block={block} />;
    case "references_accordion":
      return <ReferencesBlock block={block} />;
    default:
      return <p role="status">This block is not supported by this renderer.</p>;
  }
}
