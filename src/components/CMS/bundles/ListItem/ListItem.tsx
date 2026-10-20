import type { NodeOf } from "../../../../types/cms";
import { ContentView } from "../../renderers/ContentView";

export function ListItem({
  node,
  as: Element,
}: {
  node: NodeOf<"list_item">;
  as?: "li" | "div";
}) {
  const content = <ContentView blocks={node.content} />;
  return Element ? <Element>{content}</Element> : content;
}
