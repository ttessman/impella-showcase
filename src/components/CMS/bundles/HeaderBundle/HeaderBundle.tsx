import type { NodeOf } from "../../renderers/ContentViewRender";
import { Header } from "../../../UI/Header/Header";
import { ContentViewRender } from "../../renderers/ContentViewRender";
export function HeaderBundle({ node }: { node: NodeOf<"header"> }) {
  return (
    <Header>
      <ContentViewRender blocks={node.content} />
    </Header>
  );
}
