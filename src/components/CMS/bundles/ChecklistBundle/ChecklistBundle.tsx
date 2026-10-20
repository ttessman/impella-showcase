import { Group } from "../../../UI/Layout/Group";
import type { NodeOf } from "../../renderers/ContentViewRender";
import { children } from "../../../../utils/document";
import { checklistDefinition } from "./checklistDefinition";
import { ContentViewRender } from "../../renderers/ContentViewRender";
import { ChecklistDialog } from "../../../UI/Dialog/variants/ChecklistDialog";
export function ChecklistBundle({ node }: { node: NodeOf<"checklist"> }) {
  return (
    <ChecklistDialog
      data-bundle-name={node.bundle}
      definition={checklistDefinition(node)}
      renderOutcome={(id) => {
        const active = node.content.find(
          (item) => item.id === (id ?? node.metadata.empty_outcome_id),
        );
        return active ? (
          <Group data-bundle-name={active.bundle}>
            <ContentViewRender blocks={children(active)} />
          </Group>
        ) : null;
      }}
    />
  );
}
