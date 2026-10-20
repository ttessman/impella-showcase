import type { NodeOf } from "../../../../types/cms";
import { Code } from "./Code";
export function CodeBundle({ node }: { node: NodeOf<"code"> }) {
  return (
    <Code inline={node.metadata.variant === "inline"}>{node.content}</Code>
  );
}
