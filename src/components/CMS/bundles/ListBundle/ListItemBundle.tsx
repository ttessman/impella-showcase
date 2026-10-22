import type { NodeOf } from "../../renderers/ContentViewRender";
import { ListItem } from "../../../UI/List/ListItem";
import { ContentViewRender } from "../../renderers/ContentViewRender";
export function ListItemBundle({ node }: { node: NodeOf<"list_item"> }) {
  return (
    <ListItem data-bundle-name={node.bundle}>
      <ContentViewRender blocks={node.content} />
    </ListItem>
  );
}
