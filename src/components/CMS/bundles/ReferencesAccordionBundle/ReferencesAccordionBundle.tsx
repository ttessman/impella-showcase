import type { NodeOf } from "../../renderers/ContentViewRender";
import { ReferencesAccordion } from "../../../UI/ReferencesAccordion/ReferencesAccordion";
import { RichContentRender } from "../../renderers/RichContentRender";
export function ReferencesAccordionBundle({
  node,
}: {
  node: NodeOf<"references_accordion">;
}) {
  return (
    <ReferencesAccordion
      label={node.metadata.label}
      items={node.content.map((item) => ({
        id: item.id,
        content: <RichContentRender node={item} />,
      }))}
    />
  );
}
