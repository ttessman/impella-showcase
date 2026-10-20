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
    bundleName?: string;
    title: string;
    questions: readonly {
      id: string;
      bundleName?: string;
      title: string;
      options: readonly { id: string; label: string; bundleName?: string }[];
    }[];
  }[];
  rules: readonly ChecklistRule[];
  fallback: ChecklistOutcome;
  resetLabel: string;
  introLabel: string;
  emptyResultLabel: string;
  resultLabel: string;
  resultRegionLabel: string;
  caption: string;
  requiresJavaScriptLabel: string;
  dialog: {
    title: string;
    description: string;
    heading: string;
    closeLabel: string;
    launchLabel: string;
  };
  emptyTitle: string;
  emptyBody: string;
};

import type { ReactNode } from "react";
import { useId } from "react";
import type { ChecklistState } from "../../../hooks/useChecklist";
import { useClientReady } from "../../../hooks/useClientReady";

/** Definition-driven groups and live outcomes; no clinical content or original source. */
export function Checklist({
  "data-bundle-name": bundleName,
  definition,
  state,
  renderOutcome,
}: {
  "data-bundle-name"?: string;
  definition: ChecklistDefinition;
  state: ChecklistState;
  renderOutcome?: (id: string | null) => ReactNode;
}) {
  const id = useId();
  const ready = useClientReady();
  return (
    <section
      data-bundle-name={bundleName}
      className="checklist-showcase"
      aria-labelledby={`${id}-title`}
    >
      <div className="checklist-intro">
        <p className="eyebrow">{definition.introLabel}</p>
        <h3 id={`${id}-title`}>{definition.title}</h3>
        <p>{definition.description}</p>
      </div>
      <div className="checklist-body">
        <form
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          {definition.groups.map((group) => (
            <details
              data-bundle-name={group.bundleName}
              className="checklist-group"
              key={group.id}
              open
            >
              <summary>{group.title}</summary>
              <div className="checklist-questions">
                {group.questions.map((question) => (
                  <fieldset
                    data-bundle-name={question.bundleName}
                    disabled={!ready}
                    key={question.id}
                  >
                    <legend>{question.title}</legend>
                    {question.options.map((option) => (
                      <label
                        data-bundle-name={option.bundleName}
                        key={option.id}
                      >
                        <input
                          type="checkbox"
                          checked={state.selected.includes(option.id)}
                          onChange={() => state.toggle(option.id)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </fieldset>
                ))}
              </div>
            </details>
          ))}
          {!ready && (
            <p className="small">{definition.requiresJavaScriptLabel}</p>
          )}
        </form>
        <div
          className={`checklist-result${state.result ? " has-result" : ""}`}
          role="region"
          aria-label={definition.resultRegionLabel}
          tabIndex={-1}
        >
          <p className="eyebrow">
            {state.result
              ? definition.resultLabel
              : definition.emptyResultLabel}
          </p>
          <div aria-live="polite" aria-atomic="true">
            {renderOutcome ? (
              renderOutcome(state.result?.id ?? null)
            ) : (
              <>
                <h4>{state.result?.title ?? definition.emptyTitle}</h4>
                <p>{state.result?.body ?? definition.emptyBody}</p>
                {state.result && (
                  <p className="checklist-rule-note">
                    {state.result.explanation}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
