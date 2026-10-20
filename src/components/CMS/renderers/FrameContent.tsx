import type { CmsNode } from "../../../types/cms";
import { children } from "../model/document";
import { ContentView } from "./ContentView";

/** Shared rendering of an optional frame part without adding a DOM wrapper. */
export function FrameContent({ node }: { node?: CmsNode }) {
  return node ? <ContentView blocks={children(node)} /> : null;
}
