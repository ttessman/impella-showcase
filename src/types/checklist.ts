export type ChecklistOutcome = {
  id: string;
  title: string;
  body: string;
  explanation: string;
};
export type ChecklistRule = {
  operator: "and" | "or";
  required: readonly string[];
  outcome: ChecklistOutcome;
};
export type ChecklistDefinition = {
  title: string;
  description: string;
  groups: readonly {
    id: string;
    title: string;
    options: readonly { id: string; label: string }[];
  }[];
  rules: readonly ChecklistRule[];
  fallback: ChecklistOutcome;
  submitLabel: string;
  emptyTitle: string;
  emptyBody: string;
};
