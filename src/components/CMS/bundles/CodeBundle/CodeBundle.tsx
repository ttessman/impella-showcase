import type { NodeOf } from "../../renderers/ContentViewRender";
import { Code } from "../../../UI/Code/Code";
export function CodeBundle({ node }: { node: NodeOf<"code"> }) {
  return (
    <Code inline={node.metadata.variant === "inline"}>{node.content}</Code>
  );
}
