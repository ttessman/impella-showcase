import type { ContentEditor } from "../../../hooks/useContentEditor";

export function JsonInspector({ editor }: { editor: ContentEditor }) {
  const { json, draft, dirty, error, actions } = editor;
  return (
    <div className="json-pane">
      <h3>
        <span>02</span> Inspect the contract
      </h3>
      <p className="small" id="json-help">
        Every node uses <code>id</code>, <code>bundle</code>,{" "}
        <code>metadata</code> and <code>content</code>. Sections nest ordered
        content; the page root declares the schema version. Edit, validate, then
        apply.
      </p>
      <label className="sr-only" htmlFor="json-editor">
        Editable page JSON
      </label>
      <textarea
        id="json-editor"
        className="json-editor"
        value={draft ?? json}
        onChange={(e) => actions.editJson(e.target.value)}
        spellCheck={false}
        aria-describedby="json-help"
        aria-invalid={error ? true : undefined}
      />
      <div className="json-actions">
        <button type="button" onClick={() => actions.validate(false)}>
          Validate JSON
        </button>
        <button
          type="button"
          className="primary"
          onClick={() => actions.validate(true)}
        >
          Apply JSON
        </button>
        {dirty && (
          <button type="button" onClick={actions.discardDraft}>
            Discard draft
          </button>
        )}
      </div>
    </div>
  );
}
