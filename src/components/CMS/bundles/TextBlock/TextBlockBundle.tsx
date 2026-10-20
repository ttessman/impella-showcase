import type { NodeOf } from "../../../../types/cms";
import { TextBlock } from "./TextBlock";
import { RichContent } from "../../renderers/RichContent";
export function TextBlockBundle({ node }: { node: NodeOf<"text_block"> }) {
  return (
    <TextBlock as={node.metadata.element} variant={node.metadata.variant}>
      <RichContent node={node} />
    </TextBlock>
  );
}
