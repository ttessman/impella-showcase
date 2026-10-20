import type { NodeOf } from "../../../../types/cms";
import { RichContent } from "../../renderers/RichContent";

export function ReferencesAccordion({
  node,
}: {
  node: NodeOf<"references_accordion">;
}) {
  return (
    <details open>
      <summary>{node.metadata.label}</summary>
      <ol>
        {node.content.map((item) => (
          <li key={item.id}>
            <RichContent node={item} />
          </li>
        ))}
      </ol>
    </details>
  );
}
