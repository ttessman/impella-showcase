import type { CmsNode } from "../../../types/cms";
import { BundleRender } from "./BundleRender";

/** Render validated authored nodes in their original order. */
export function ContentView({ blocks }: { blocks: readonly CmsNode[] }) {
  return blocks.map((node) => <BundleRender key={node.id} block={node} />);
}
