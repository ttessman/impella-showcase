import type { StudioMediaBundle } from "../../../../features/ContentStudio/model/studioDocument";
import { imageOptions } from "../../../../content/studioAssets";

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
}
