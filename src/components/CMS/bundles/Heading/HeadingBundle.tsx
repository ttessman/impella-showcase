import type { NodeOf } from "../../../../types/cms";
import { Heading } from "./Heading";
import { RichContent } from "../../renderers/RichContent";
export function HeadingBundle({ node }: { node: NodeOf<"heading"> }) {
  return (
    <Heading id={node.id} level={node.metadata.level}>
      <RichContent node={node} />
    </Heading>
  );
}
