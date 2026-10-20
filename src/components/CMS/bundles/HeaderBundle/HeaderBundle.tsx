import type { NodeOf } from "../../renderers/ContentViewRender";
import { Header } from "../../../UI/Header/Header";
import { ContentViewRender } from "../../renderers/ContentViewRender";
export function HeaderBundle({ node }: { node: NodeOf<"header"> }) {
  return (
    <Header data-bundle-name={node.bundle}>
      <ContentViewRender blocks={node.content} />
    </Header>
  );
}
