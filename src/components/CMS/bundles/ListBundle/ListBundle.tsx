import type { NodeOf } from "../../renderers/ContentViewRender";
import { List } from "../../../UI/List/List";
import { ContentViewRender } from "../../renderers/ContentViewRender";
export function ListBundle({ node }: { node: NodeOf<"list"> }) {
  return (
    <List
      data-bundle-name={node.bundle}
      ordered={node.metadata.ordered}
      variant={node.metadata.variant}
      items={node.content
        .filter((item) => item.bundle === "list_item")
        .map((item) => ({
          id: item.id,
          bundleName: item.bundle,
          content: <ContentViewRender blocks={item.content} />,
        }))}
    />
  );
}
