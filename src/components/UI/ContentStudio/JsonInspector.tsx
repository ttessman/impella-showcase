import { TextArea } from "../Input/TextArea";
import { EditorFeedback } from "./EditorFeedback";
import { useAutoSizeTextarea } from "../../../hooks/useAutoSizeTextarea";
import type { ContentEditor } from "../../../hooks/useContentEditor";
import { Button } from "../Button/Button";
import { ActionDropdown } from "../Popover/variants/ActionDropdown";

export function JsonInspector({ editor }: { editor: ContentEditor }) {
  const { json, draft, dirty, error, actions } = editor;
  const value = draft ?? json;
  const field = useAutoSizeTextarea(value);
  return (
    <div className="json-pane">
      <div className="json-pane-header">
        <div className="json-pane-heading">
          <h3>
            <span>02</span> Inspect the contract
          </h3>
          <p
            className="small"
            id="json-help"
            title="Every node uses id, bundle, metadata and content. Sections nest ordered content; only the page root declares the schema version."
          >
            Nodes: <code>id</code>, <code>bundle</code>, <code>metadata</code>,{" "}
            <code>content</code>. Nested sections; root schema version.
          </p>
        </div>
        <div className="json-actions">
          <Button variant="primary" onClick={() => actions.validate(true)}>
            Apply JSON
          </Button>
          <ActionDropdown
            label="JSON actions"
            items={[
              {
                label: "Validate JSON",
                icon: "validate",
                onSelect: () => actions.validate(false),
              },
              {
                label: "Revert JSON",
                icon: "reset",
                disabled: !dirty,
                onSelect: actions.discardDraft,
              },
            ]}
          />
        </div>
      </div>
      <EditorFeedback
        error={error}
        message={editor.message}
        tone={editor.validationTone}
      />
      <div
        className="json-pane-content"
        data-editor-scroll
        role="region"
        aria-label="JSON content"
        tabIndex={0}
      >
        <label className="sr-only" htmlFor="json-editor">
          Editable page JSON
        </label>
        <TextArea
          id="json-editor"
          className="json-editor"
          ref={field}
          value={value}
          onChange={(e) => actions.editJson(e.target.value)}
          spellCheck={false}
          aria-describedby="json-help"
          aria-invalid={error ? true : undefined}
        />
      </div>
    </div>
  );
}
