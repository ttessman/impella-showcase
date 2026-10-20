import type { NodeOf } from "../../../../types/cms";
import { ContentView } from "../../ContentView/ContentView";
import { variantClass } from "../../model/variants";

export function Figure({ node }: { node: NodeOf<"figure"> }) {
  return (
    <figure
      className={variantClass("figure", node.metadata.variant) || undefined}
    >
      <ContentView blocks={node.content} />
    </figure>
  );
}
