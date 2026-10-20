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
      data-bundle-name={node.bundle}
      label={node.metadata.label}
      items={node.content.map((item) => ({
        id: item.id,
        bundleName: item.bundle,
        content: <RichContentRender node={item} />,
      }))}
    />
  );
}
