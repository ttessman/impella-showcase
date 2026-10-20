import type { StudioReferencesBundle } from "../../../../features/ContentStudio/model/studioDocument";

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
        <input
          maxLength={5000}
          value={block.references_accordion_title}
          onChange={(e) =>
            onChange({
              ...block,
              references_accordion_title: e.target.value,
            })
          }
        />
      </label>
      <label>
        References (one per line)
        <textarea
          aria-label="References (one per line)"
          maxLength={5000}
          value={block.references_container.references.join("\n")}
          onChange={(e) =>
            onChange({
              ...block,
              references_container: {
                references: e.target.value.split("\n"),
              },
            })
          }
        />
      </label>
    </>
  );
}
