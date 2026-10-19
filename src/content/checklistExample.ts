import data from "./checklistExample.json";
import type { ChecklistDefinition } from "../types/checklist";

/** Check the JSON operator boundary; the remaining shape is checked by TypeScript. */
export const checklistExample: ChecklistDefinition = {
  ...data,
  rules: data.rules.map((rule) => {
    const operator = rule.operator;
    if (operator !== "and" && operator !== "or") {
      throw new Error(`Unsupported checklist operator: ${operator}`);
    }
    return { ...rule, operator };
  }),
};
