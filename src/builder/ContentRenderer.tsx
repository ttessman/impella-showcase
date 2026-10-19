import type { ContentBlock } from "./model";

// Equivalent to the original BundleRender dispatch, independently implemented for the web.
export function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return blocks.map((block) => <Block key={block.id} block={block} />);
}
function Block({ block }: { block: ContentBlock }) {
  switch (block.bundle) {
    case "header":
      return block.level === 2 ? (
        <h3>{block.header}</h3>
      ) : (
        <h4>{block.header}</h4>
      );
    case "text_block":
      return <p className="plain-text">{block.text_body}</p>;
    case "media":
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
    case "demo_section":
      return (
        <section className="preview-section">
          <h3>{block.header}</h3>
          <ContentRenderer blocks={block.children} />
        </section>
      );
    case "references_accordion":
      return (
        <details open>
          <summary>{block.references_accordion_title || "References"}</summary>
          <ol>
            {block.references_container.references.map((ref, index) => (
              <li key={index}>{ref}</li>
            ))}
          </ol>
        </details>
      );
    default:
      return <p role="status">This block is not supported by this renderer.</p>;
  }
}
