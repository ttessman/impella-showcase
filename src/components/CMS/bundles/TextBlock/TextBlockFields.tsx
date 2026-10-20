import { useId, useRef, useState } from "react";
import type { StudioTextBundle } from "../../../../features/ContentStudio/model/studioDocument";

/** Authored superscripts match the original string contract without accepting arbitrary HTML. */
export function TextBlockFields({
  block,
  onChange,
}: {
  block: StudioTextBundle;
  onChange: (block: StudioTextBundle) => void;
}) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const hint = useId();
  const [numbers, setNumbers] = useState("1");
  const [error, setError] = useState("");
  function insertCitation() {
    if (!/^[1-9]\d{0,2}(?:\s*,\s*[1-9]\d{0,2})*$/.test(numbers.trim())) {
      setError("Enter positive reference numbers, such as 1 or 1,2.");
      return;
    }
    const field = textarea.current;
    if (!field) return;
    const marker = `<sup>${numbers
      .split(",")
      .map((value) => value.trim())
      .join(",")}</sup>`;
    const start = field.selectionStart;
    const end = field.selectionEnd;
    const text =
      block.text_body.slice(0, start) + marker + block.text_body.slice(end);
    if (text.length > 5000) {
      setError("The citation would exceed the 5,000-character text limit.");
      return;
    }
    setError("");
    onChange({ ...block, text_body: text });
    requestAnimationFrame(() => {
      field.focus({ preventScroll: true });
      field.setSelectionRange(start + marker.length, start + marker.length);
    });
  }
  return (
    <>
      <label>
        Paragraph text
        <textarea
          ref={textarea}
          aria-label="Paragraph text"
          aria-describedby={hint}
          maxLength={5000}
          value={block.text_body}
          onChange={(event) =>
            onChange({ ...block, text_body: event.target.value })
          }
        />
      </label>
      <div className="citation-controls">
        <label>
          Reference numbers
          <input
            value={numbers}
            maxLength={100}
            inputMode="text"
            placeholder="1 or 1,2"
            aria-describedby={hint}
            onChange={(event) => {
              setNumbers(event.target.value);
              setError("");
            }}
          />
        </label>
        <button type="button" onClick={insertCitation}>
          Insert citation
        </button>
      </div>
      <p id={hint} className="small citation-help">
        Place the cursor in your text, then insert a citation. Numbers use{" "}
        {"<sup>1,2</sup>"} and match the order in your References list. Keep
        them aligned when reordering sources.
      </p>
      {error && (
        <p className="small" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
