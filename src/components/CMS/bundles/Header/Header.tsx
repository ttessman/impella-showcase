import type { NodeOf } from "../../../../types/cms";
import { ContentView } from "../../ContentView/ContentView";

export function Header({ node }: { node: NodeOf<"header"> }) {
  return <ContentView blocks={node.content} />;
}
