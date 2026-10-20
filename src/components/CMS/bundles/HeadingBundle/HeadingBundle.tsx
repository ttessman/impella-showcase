import type { NodeOf } from "../../renderers/ContentViewRender";
import { Heading } from "../../../UI/Heading/Heading";
import { RichContentRender } from "../../renderers/RichContentRender";
export function HeadingBundle({ node }: { node: NodeOf<"heading"> }) {
  return (
    <Heading id={node.id} level={node.metadata.level}>
      <RichContentRender node={node} />
    </Heading>
  );
}
