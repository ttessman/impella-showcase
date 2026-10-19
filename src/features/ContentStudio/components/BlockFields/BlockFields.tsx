import { TextBlockFields } from "./TextBlockFields";
import { imageOptions } from "../../../../content/studioAssets";
import type { ContentBlock } from "../../../../types/content";
export function BlockFields({
  block,
  onChange,
}: {
  block: ContentBlock;
  onChange: (block: ContentBlock) => void;
}) {
  switch (block.bundle) {
    case "header":
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
    case "text_block":
      return (
        <TextBlockFields key={block.id} block={block} onChange={onChange} />
      );
    case "demo_section":
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
    case "media":
      return (
        <>
          <label>
            Image asset
            <select
              aria-label="Image asset"
              value={block.media.url}
              onChange={(e) =>
                onChange({
                  ...block,
                  media: {
                    ...block.media,
                    url: e.target.value,
                    alt: e.target.value.includes("studio")
                      ? "Illustrated notebook with green lines and a golden circle"
                      : "Illustrated green mountains under a golden sun",
                  },
                })
              }
            >
              {imageOptions.map((url) => (
                <option key={url} value={url}>
                  {url.includes("studio")
                    ? "Studio notebook"
                    : "Mountain landscape"}
                </option>
              ))}
            </select>
          </label>
          <label>
            Alternative text
            <input
              maxLength={5000}
              value={block.media.alt}
              onChange={(e) =>
                onChange({
                  ...block,
                  media: { ...block.media, alt: e.target.value },
                })
              }
            />
          </label>
          <label>
            Image caption
            <input
              maxLength={5000}
              value={block.media_caption}
              onChange={(e) =>
                onChange({ ...block, media_caption: e.target.value })
              }
            />
          </label>
        </>
      );
    case "references_accordion":
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
}
