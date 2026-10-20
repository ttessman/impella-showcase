import type { StudioSectionBundle } from "../../../../features/ContentStudio/model/studioDocument";

/** Fields for the bounded studio draft of this bundle. */
export function SectionFields({
  block,
  onChange,
}: {
  block: StudioSectionBundle;
  onChange: (block: StudioSectionBundle) => void;
}) {
  return (
    <>
      <label>
        Section title
        <input
          maxLength={5000}
          value={block.header}
          onChange={(e) => onChange({ ...block, header: e.target.value })}
        />
      </label>
      <p className="small">
        Choose this section as the destination above to add nested blocks.
        Sections are a demo extension.
      </p>
    </>
  );
}
