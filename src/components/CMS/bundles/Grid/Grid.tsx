import type { NodeOf } from "../../../../types/cms";
import { ContentView } from "../../ContentView/ContentView";
import { variantClass } from "../../model/variants";

export function Grid({ node }: { node: NodeOf<"grid"> }) {
  return (
    <div id={node.id} className={variantClass("grid", node.metadata.variant)}>
      <ContentView blocks={node.content} />
    </div>
  );
}
