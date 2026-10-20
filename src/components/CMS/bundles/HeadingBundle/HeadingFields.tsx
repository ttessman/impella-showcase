import type { StudioHeadingBundle } from "../../../../utils/studio";

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
          value={block.content}
          onChange={(e) => onChange({ ...block, content: e.target.value })}
        />
      </label>
      <label>
        Heading level
        <select
          aria-label="Heading level"
          value={block.metadata.level}
          onChange={(e) =>
            onChange({
              ...block,
              metadata: {
                ...block.metadata,
                level: Number(e.target.value) as 2 | 3,
              },
            })
          }
        >
          <option value="2">Section heading</option>
          <option value="3">Subheading</option>
        </select>
      </label>
    </>
  );
}
