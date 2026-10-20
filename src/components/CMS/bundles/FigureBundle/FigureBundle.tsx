import type { NodeOf } from "../../renderers/ContentViewRender";
import { Figure } from "../../../UI/Figure/Figure";
import { ContentViewRender } from "../../renderers/ContentViewRender";
export function FigureBundle({ node }: { node: NodeOf<"figure"> }) {
  return (
    <Figure variant={node.metadata.variant}>
      <ContentViewRender blocks={node.content} />
    </Figure>
  );
}
