import type { ContentBlock } from "../../../types/content";
import type { CmsNode } from "../../../types/cms";
import { studioNode } from "../model/studioAdapter";
import { BundleRender } from "../BundleRender/BundleRender";

/** Arrays keep their authored order. Legacy studio drafts normalize at this boundary. */
export function ContentView({
  blocks,
}: {
  blocks: readonly CmsNode[] | readonly ContentBlock[];
}) {
  return blocks.map((block) => {
    const node = "metadata" in block ? block : studioNode(block);
    return <BundleRender key={node.id} block={node} />;
  });
}
