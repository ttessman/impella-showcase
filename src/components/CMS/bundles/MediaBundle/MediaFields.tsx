import { TextInput } from "../../../UI/Input/TextInput";
import { Select } from "../../../UI/Input/Select";
import type { StudioMediaBundle } from "../../../../utils/studio";
export const imageOptions = [
  "assets/demo/field-notes.svg",
  "assets/demo/studio-notes.svg",
];

/** Fields for the bounded studio draft of this bundle. */
export function MediaFields({
  block,
  onChange,
}: {
  block: StudioMediaBundle;
  onChange: (block: StudioMediaBundle) => void;
}) {
  return (
    <>
      <label>
        Image asset
        <Select
          aria-label="Image asset"
          value={block.metadata.src}
          onChange={(e) =>
            onChange({
              ...block,
              metadata: {
                ...block.metadata,
                src: e.target.value,
                alt: e.target.value.includes("studio")
                  ? "Illustrated notebook with green lines and a golden circle"
                  : "Illustrated green mountains under a golden sun",
              },
            })
          }
        >
          {imageOptions.map((url) => (
            <option key={url} value={`/${url}`}>
              {url.includes("studio")
                ? "Studio notebook"
                : "Mountain landscape"}
            </option>
          ))}
        </Select>
      </label>
      <label>
        Alternative text
        <TextInput
          maxLength={5000}
          value={block.metadata.alt}
          onChange={(e) =>
            onChange({
              ...block,
              metadata: { ...block.metadata, alt: e.target.value },
            })
          }
        />
      </label>
      <label>
        Image caption
        <TextInput
          maxLength={5000}
          value={block.content[0]?.content ?? ""}
          onChange={(e) =>
            onChange({
              ...block,
              content: [
                {
                  id: block.content[0]?.id ?? `caption-${block.id}`,
                  bundle: "text_block",
                  metadata: {},
                  content: e.target.value,
                },
              ],
            })
          }
        />
      </label>
    </>
  );
}
