import { TextInput } from "../../../UI/Input/TextInput";
import { Select } from "../../../UI/Input/Select";
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
        <TextInput
          maxLength={5000}
          value={block.content}
          onChange={(e) => onChange({ ...block, content: e.target.value })}
        />
      </label>
      <label>
        Heading level
        <Select
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
        </Select>
      </label>
    </>
  );
}
