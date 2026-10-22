import { TextArea } from "../../../../UI/Input/TextArea";
import { TextInput } from "../../../../UI/Input/TextInput";
import type { StudioReferencesBundle } from "../../../../../utils/studio";

/** Fields for the bounded studio draft of this bundle. */
export function ReferencesAccordionFields({
  block,
  onChange,
}: {
  block: StudioReferencesBundle;
  onChange: (block: StudioReferencesBundle) => void;
}) {
  return (
    <>
      <label>
        References title
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
      <label>
        References (one per line)
        <TextArea
          aria-label="References (one per line)"
          maxLength={5000}
          value={block.content.map((item) => item.content).join("\n")}
          onChange={(e) =>
            onChange({
              ...block,
              content: e.target.value.split("\n").map((content, index) => ({
                id:
                  block.content[index]?.id ??
                  `reference-${crypto.randomUUID()}`,
                bundle: "text_block",
                metadata: {},
                content,
              })),
            })
          }
        />
      </label>
    </>
  );
}
