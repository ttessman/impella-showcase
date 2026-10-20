import type { NodeOf } from "../../../../types/cms";
import { Group } from "./Group";
import { ContentView } from "../../renderers/ContentView";
export function GroupBundle({ node }: { node: NodeOf<"group"> }) {
  return (
    <Group
      id={node.id}
      as={node.metadata.element}
      variant={node.metadata.variant}
    >
      <ContentView blocks={node.content} />
    </Group>
  );
}
