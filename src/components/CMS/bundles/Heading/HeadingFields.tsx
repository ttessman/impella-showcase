import type { StudioHeadingBundle } from "../../../../features/ContentStudio/model/studioDocument";

/** Fields for the bounded studio draft of this bundle. */
export function HeadingFields({
  block,
  onChange,
}: {
  block: StudioHeadingBundle;
  onChange: (block: StudioHeadingBundle) => void;
}) {
  return (
    <>
      <label>
        Heading text
        <input
          maxLength={5000}
          value={block.header}
          onChange={(e) => onChange({ ...block, header: e.target.value })}
        />
      </label>
      <label>
        Heading level
        <select
          aria-label="Heading level"
          value={block.level}
          onChange={(e) =>
            onChange({ ...block, level: Number(e.target.value) as 2 | 3 })
          }
        >
          <option value="2">Section heading</option>
          <option value="3">Subheading</option>
        </select>
      </label>
    </>
  );
}
