import type { NodeOf } from "../../../types/cms";
import { children } from "../model/document";
import { checklistDefinition } from "../model/checklistDefinition";
import { ContentView } from "../ContentView/ContentView";
import { ChecklistDialog } from "../../forms/Checklist/ChecklistDialog";
export function Checklist({ node }: { node: NodeOf<"checklist"> }) {
  return (
    <ChecklistDialog
      definition={checklistDefinition(node)}
      renderOutcome={(id) => {
        const active = node.content.find(
          (item) => item.id === (id ?? node.metadata.empty_outcome_id),
        );
        return active ? <ContentView blocks={children(active)} /> : null;
      }}
    />
  );
}
