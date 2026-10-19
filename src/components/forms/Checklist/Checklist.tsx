import { useId, useRef } from "react";
import { Button } from "../../actions/Button/Button";
import { useChecklist } from "../../../hooks/useChecklist";
import { useClientReady } from "../../../hooks/useClientReady";
import type { ChecklistDefinition } from "../../../types/checklist";

/** Definition-driven groups and submitted outcomes; no clinical content or original source. */
export function Checklist({ definition }: { definition: ChecklistDefinition }) {
  const id = useId();
  const ready = useClientReady();
  const state = useChecklist(definition);
  const result = useRef<HTMLDivElement>(null);
  const firstOption = useRef<HTMLInputElement>(null);
  function submit() {
    state.submit();
    requestAnimationFrame(() => {
      result.current?.focus({ preventScroll: true });
      result.current?.scrollIntoView({
        block: "nearest",
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    });
  }
  return (
    <section className="checklist-showcase" aria-labelledby={`${id}-title`}>
      <div className="checklist-intro">
        <p className="eyebrow">Try the checklist pattern · Fictional example</p>
        <h3 id={`${id}-title`}>{definition.title}</h3>
        <p>{definition.description}</p>
      </div>
      <div className="checklist-body">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          {definition.groups.map((group, groupIndex) => (
            <fieldset disabled={!ready} key={group.id}>
              <legend>{group.title}</legend>
              {group.options.map((option, optionIndex) => (
                <label key={option.id}>
                  <input
                    ref={
                      groupIndex === 0 && optionIndex === 0
                        ? firstOption
                        : undefined
                    }
                    type="checkbox"
                    checked={state.selected.includes(option.id)}
                    onChange={() => state.toggle(option.id)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </fieldset>
          ))}
          <div className="checklist-actions">
            <Button type="submit" disabled={!ready}>
              {definition.submitLabel} <span aria-hidden="true">↗</span>
            </Button>
            <Button
              type="button"
              disabled={!ready}
              onClick={() => {
                state.reset();
                firstOption.current?.focus({ preventScroll: true });
              }}
            >
              Start over
            </Button>
          </div>
          {!ready && (
            <p className="small">Enable JavaScript to try this example.</p>
          )}
        </form>
        <div
          ref={result}
          className={`checklist-result${state.result ? " has-result" : ""}`}
          role="region"
          aria-label="Creative checklist result"
          tabIndex={-1}
        >
          <p className="eyebrow">
            {state.result ? "Your mini adventure" : "Your prompt"}
          </p>
          <div aria-live="polite" aria-atomic="true">
            <h4>{state.result?.title ?? definition.emptyTitle}</h4>
            <p>{state.result?.body ?? definition.emptyBody}</p>
            {state.result && (
              <p className="checklist-rule-note">{state.result.explanation}</p>
            )}
            {state.pending && (
              <p className="checklist-pending">
                Choices changed. Submit again to update your prompt.
              </p>
            )}
          </div>
        </div>
      </div>
      <p className="checklist-caption">
        Independent, nonclinical web example of grouped options → authored
        conditions → result content. First matching rule wins.
      </p>
    </section>
  );
}
