import type { ContentBlock } from "../../../types/content";
import { BundleRender } from "../BundleRender/BundleRender";

/** Ordered authored content; the bundle dispatcher owns component selection. */
export function ContentView({ blocks }: { blocks: ContentBlock[] }) {
  return blocks.map((block) => <BundleRender key={block.id} block={block} />);
}
