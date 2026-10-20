import type { NodeOf } from "../../renderers/ContentViewRender";
import { Text } from "../../../UI/Text/Text";
export function TextBundle({ node }: { node: NodeOf<"text"> }) {
  return (
    <Text mark={node.metadata.mark} breakAfter={node.metadata.break_after}>
      {node.content}
    </Text>
  );
}
