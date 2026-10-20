import type { CmsNode } from "./ContentViewRender";
import { children } from "../../../utils/document";
import { ContentViewRender } from "./ContentViewRender";

/** Shared rendering of an optional frame part without adding a DOM wrapper. */
export function FrameContentRender({ node }: { node?: CmsNode }) {
  return node ? <ContentViewRender blocks={children(node)} /> : null;
}
