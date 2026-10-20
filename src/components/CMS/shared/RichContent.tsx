import type { CmsNode } from "../../../types/cms";
import { CitedText } from "../../content/CitedText/CitedText";
import { ContentView } from "../ContentView/ContentView";

export function RichContent({ node }: { node: CmsNode }) {
  return typeof node.content === "string" ? (
    <CitedText text={node.content} />
  ) : (
    <ContentView blocks={Array.isArray(node.content) ? node.content : []} />
  );
}
