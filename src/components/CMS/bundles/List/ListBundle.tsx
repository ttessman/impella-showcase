import type { NodeOf } from "../../../../types/cms";
import { List } from "./List";
import { ContentView } from "../../renderers/ContentView";
export function ListBundle({ node }: { node: NodeOf<"list"> }) {
  return (
    <List
      ordered={node.metadata.ordered}
      variant={node.metadata.variant}
      items={node.content
        .filter((item) => item.bundle === "list_item")
        .map((item) => ({
          id: item.id,
          content: <ContentView blocks={item.content} />,
        }))}
    />
  );
}
