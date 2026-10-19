import { useState } from "react";
import type { ChecklistDefinition } from "../types/checklist";
import { evaluateChecklist } from "../components/forms/Checklist/checklistModel";

export function useChecklist(definition: ChecklistDefinition) {
  const [selected, setSelected] = useState<string[]>([]);
  const [resetKey, setResetKey] = useState(0);
  return {
    resetKey,
    selected,
    result:
      selected.length === 0 ? null : evaluateChecklist(definition, selected),
    toggle(id: string) {
      setSelected((current) =>
        current.includes(id)
          ? current.filter((item) => item !== id)
          : [...current, id],
      );
    },
    reset() {
      setSelected([]);
      setResetKey((current) => current + 1);
    },
  };
}

export type ChecklistState = ReturnType<typeof useChecklist>;
