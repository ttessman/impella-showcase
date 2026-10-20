import type { NodeOf } from "../../../../types/cms";
import { RichContent } from "../../shared/RichContent";

export function Heading({ node }: { node: NodeOf<"heading"> }) {
  const Element = `h${node.metadata.level}` as
    "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  return (
    <Element id={node.id}>
      <RichContent node={node} />
    </Element>
  );
}
