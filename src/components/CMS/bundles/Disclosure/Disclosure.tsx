import type { NodeOf } from "../../../../types/cms";
import { ContentView } from "../../ContentView/ContentView";

export function Disclosure({ node }: { node: NodeOf<"disclosure"> }) {
  return (
    <details
      className={
        node.metadata.variant === "implementation"
          ? "tool-implementation"
          : undefined
      }
      open={node.metadata.initially_expanded || undefined}
    >
      <summary>{node.metadata.label}</summary>
      <ContentView blocks={node.content} />
    </details>
  );
}
