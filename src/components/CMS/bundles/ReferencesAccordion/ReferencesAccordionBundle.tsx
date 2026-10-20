import type { NodeOf } from "../../../../types/cms";
import { ReferencesAccordion } from "./ReferencesAccordion";
import { RichContent } from "../../renderers/RichContent";
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
        content: <RichContent node={item} />,
      }))}
    />
  );
}
