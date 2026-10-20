import type { NodeOf } from "../../renderers/ContentViewRender";
import { Text } from "../../../UI/Text/Text";
export function TextBundle({ node }: { node: NodeOf<"text"> }) {
  return (
    <Text
      data-bundle-name={node.bundle}
      mark={node.metadata.mark}
      breakAfter={node.metadata.break_after}
    >
      {node.content}
    </Text>
  );
}
