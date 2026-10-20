import type { NodeOf } from "../../../../types/cms";
import { ListItem } from "./ListItem";
import { ContentView } from "../../renderers/ContentView";
export function ListItemBundle({ node }: { node: NodeOf<"list_item"> }) {
  return (
    <ListItem>
      <ContentView blocks={node.content} />
    </ListItem>
  );
}
