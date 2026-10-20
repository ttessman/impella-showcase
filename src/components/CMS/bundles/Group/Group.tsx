import type { NodeOf } from "../../../../types/cms";
import { ContentView } from "../../ContentView/ContentView";
import { variantClass } from "../../model/variants";

export function Group({ node }: { node: NodeOf<"group"> }) {
  const Element = node.metadata.element ?? "div";
  return (
    <Element
      id={node.id}
      className={variantClass(node.bundle, node.metadata.variant) || undefined}
    >
      <ContentView blocks={node.content} />
    </Element>
  );
}
