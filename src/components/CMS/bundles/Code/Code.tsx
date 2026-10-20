import type { NodeOf } from "../../../../types/cms";

export function Code({ node }: { node: NodeOf<"code"> }) {
  return node.metadata.variant === "inline" ? (
    <code>{node.content}</code>
  ) : (
    <pre>
      <code>{node.content}</code>
    </pre>
  );
}
