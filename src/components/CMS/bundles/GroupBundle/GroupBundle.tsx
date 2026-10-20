import type { NodeOf } from "../../renderers/ContentViewRender";
import { Group } from "../../../UI/Layout/Group";
import { ContentViewRender } from "../../renderers/ContentViewRender";
export function GroupBundle({ node }: { node: NodeOf<"group"> }) {
  return (
    <Group
      data-bundle-name={node.bundle}
      id={node.id}
      as={node.metadata.element}
      variant={node.metadata.variant}
    >
      <ContentViewRender blocks={node.content} />
    </Group>
  );
}
