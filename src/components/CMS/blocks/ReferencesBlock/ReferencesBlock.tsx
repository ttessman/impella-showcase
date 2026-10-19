import type { ReferencesBlock as Block } from "../../../../types/content";

export function ReferencesBlock({ block }: { block: Block }) {
  return (
    <details open>
      <summary>{block.references_accordion_title || "References"}</summary>
      <ol>
        {block.references_container.references.map((reference, index) => (
          <li key={index}>{reference}</li>
        ))}
      </ol>
    </details>
  );
}
