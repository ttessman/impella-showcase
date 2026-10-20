import type { CmsNode } from "./ContentViewRender";
import { RichText } from "../../UI/Text/RichText";
import { ContentViewRender } from "./ContentViewRender";

export function RichContentRender({ node }: { node: CmsNode }) {
  if (node.bundle === "text" && node.metadata.mark === "code")
    return <>{node.content}</>;
  return typeof node.content === "string" ? (
    <RichText
      text={node.content}
      block={node.bundle === "text_block" && node.metadata.element === "div"}
      links={node.bundle !== "action"}
    />
  ) : (
    <ContentViewRender
      blocks={Array.isArray(node.content) ? node.content : []}
    />
  );
}
