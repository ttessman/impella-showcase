import type { ChecklistDefinition } from "../components/UI/Checklist/Checklist";

/** Independently written first-match evaluation for the fictional showcase. */
export function evaluateChecklist(
  definition: ChecklistDefinition,
  selected: readonly string[],
) {
  const chosen = new Set(selected);
  return (
    definition.rules.find((rule) =>
      rule.operator === "and"
        ? rule.required.every((option) => chosen.has(option))
        : rule.required.some((option) => chosen.has(option)),
    )?.outcome ?? definition.fallback
  );
}
