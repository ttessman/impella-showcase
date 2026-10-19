import type { MediaBlock as Block } from "../../../../types/content";

export function MediaBlock({ block }: { block: Block }) {
  return (
    <figure>
      <img
        src={`${import.meta.env.BASE_URL}${block.media.url}`}
        alt={block.media.alt}
        width="800"
        height="480"
      />
      <figcaption>{block.media_caption}</figcaption>
    </figure>
  );
}
