import type { CmsNode, NodeOf } from "../../../types/cms";
import type {
  ChecklistDefinition,
  ChecklistOutcome,
} from "../../../types/checklist";
import { children, textContent } from "./document";

function outcome(node: CmsNode): ChecklistOutcome {
  const parts = children(node);
  return {
    id: node.id,
    title: textContent(parts[0]),
    body: textContent(parts[1]),
    explanation: parts[2] ? textContent(parts[2]) : "",
  };
}
/** Structured checklist children are interpreted by this capability, not public modal scaffolding. */
export function checklistDefinition(
  node: NodeOf<"checklist">,
): ChecklistDefinition {
  const m = node.metadata;
  const outcomes = new Map(
    node.content
      .filter((item) => item.bundle === "checklist_outcome")
      .map((item) => [item.id, outcome(item)]),
  );
  const empty = outcomes.get(m.empty_outcome_id)!;
  return {
    title: textContent(node.content.find((item) => item.bundle === "heading")!),
    description: textContent(
      node.content.find((item) => item.bundle === "text_block")!,
    ),
    groups: node.content
      .filter((item) => item.bundle === "checklist_group")
      .map((group) => ({
        id: group.id,
        title: group.metadata.label,
        questions: group.content
          .filter((q) => q.bundle === "checklist_question")
          .map((q) => ({
            id: q.id,
            title: q.metadata.label,
            options: q.content
              .filter((o) => o.bundle === "checklist_option")
              .map((o) => ({ id: o.id, label: o.content })),
          })),
      })),
    rules: node.content
      .filter((item) => item.bundle === "checklist_rule")
      .map((rule) => ({
        operator: rule.metadata.operator,
        required: rule.metadata.selected_ids,
        outcome: outcomes.get(rule.metadata.outcome_id)!,
      })),
    fallback: outcomes.get(m.fallback_outcome_id)!,
    emptyTitle: empty.title,
    emptyBody: empty.body,
    resetLabel: m.reset_label,
    introLabel: m.intro_label,
    emptyResultLabel: m.empty_result_label,
    resultLabel: m.result_label,
    resultRegionLabel: m.result_region_label,
    caption: m.caption,
    requiresJavaScriptLabel: m.requires_javascript_label,
    dialog: {
      title: m.title,
      description: m.description,
      heading: m.dialog_heading,
      launchLabel: m.trigger_label,
      closeLabel: m.close_label,
    },
  };
}
