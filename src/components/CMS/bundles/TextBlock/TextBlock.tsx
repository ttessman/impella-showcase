import type { NodeOf } from "../../../../types/cms";
import { variantClass } from "../../model/variants";
import { RichContent } from "../../shared/RichContent";

export function TextBlock({ node }: { node: NodeOf<"text_block"> }) {
  const Element = node.metadata.element ?? "p";
  return (
    <Element
      className={variantClass("text_block", node.metadata.variant) || undefined}
    >
      <RichContent node={node} />
    </Element>
  );
}
