import type { NodeOf } from "../../renderers/ContentViewRender";
import { BlockText } from "../../../UI/Text/variants/BlockText";
import { RichContentRender } from "../../renderers/RichContentRender";
export function TextBlockBundle({ node }: { node: NodeOf<"text_block"> }) {
  return (
    <BlockText
      data-bundle-name={node.bundle}
      as={node.metadata.element}
      variant={node.metadata.variant}
    >
      {typeof node.content === "string" ? (
        node.content
      ) : (
        <RichContentRender node={node} />
      )}
    </BlockText>
  );
}
