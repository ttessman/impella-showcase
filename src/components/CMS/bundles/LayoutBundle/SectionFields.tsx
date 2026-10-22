import { TextInput } from "../../../UI/Input/TextInput";
import type { StudioSectionBundle } from "../../../../utils/studio";

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
        <TextInput
          maxLength={5000}
          value={block.metadata.label}
          onChange={(e) =>
            onChange({
              ...block,
              metadata: { ...block.metadata, label: e.target.value },
            })
          }
        />
      </label>
      <p className="small">
        Choose this section as the destination above to add nested blocks.
        Sections use the same recursive content contract as the page.
      </p>
    </>
  );
}
