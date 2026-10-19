import { useState } from "react";
import type { ChecklistDefinition } from "../types/checklist";
import { evaluateChecklist } from "../components/forms/Checklist/checklistModel";

export function useChecklist(definition: ChecklistDefinition) {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<string[] | null>(null);
  return {
    selected,
    result:
      submitted === null ? null : evaluateChecklist(definition, submitted),
    pending:
      submitted !== null &&
      (selected.length !== submitted.length ||
        selected.some((id) => !submitted.includes(id))),
    toggle(id: string) {
      setSelected((current) =>
        current.includes(id)
          ? current.filter((item) => item !== id)
          : [...current, id],
      );
    },
    submit() {
      setSubmitted([...selected]);
    },
    reset() {
      setSelected([]);
      setSubmitted(null);
    },
  };
}
