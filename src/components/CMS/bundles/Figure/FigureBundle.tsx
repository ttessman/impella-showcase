import type { NodeOf } from "../../../../types/cms";
import { Figure } from "./Figure";
import { ContentView } from "../../renderers/ContentView";
export function FigureBundle({ node }: { node: NodeOf<"figure"> }) {
  return (
    <Figure variant={node.metadata.variant}>
      <ContentView blocks={node.content} />
    </Figure>
  );
}
