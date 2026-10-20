import type { NodeOf } from "../../../../types/cms";
import { Text } from "./Text";
export function TextBundle({ node }: { node: NodeOf<"text"> }) {
  return (
    <Text mark={node.metadata.mark} breakAfter={node.metadata.break_after}>
      {node.content}
    </Text>
  );
}
