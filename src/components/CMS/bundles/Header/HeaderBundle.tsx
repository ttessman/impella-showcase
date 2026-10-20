import type { NodeOf } from "../../../../types/cms";
import { Header } from "./Header";
import { ContentView } from "../../renderers/ContentView";
export function HeaderBundle({ node }: { node: NodeOf<"header"> }) {
  return (
    <Header>
      <ContentView blocks={node.content} />
    </Header>
  );
}
