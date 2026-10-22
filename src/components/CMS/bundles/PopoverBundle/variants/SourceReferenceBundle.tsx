import type { NodeOf } from "../../../renderers/ContentViewRender";
import { SourceReference } from "../../../../UI/Popover/variants/SourceReference";
export function SourceReferenceBundle({
  node,
}: {
  node: NodeOf<"source_reference">;
}) {
  const files = node.content.filter(
    (child): child is NodeOf<"code"> => child.bundle === "code",
  );
  return (
    <SourceReference
      data-bundle-name={node.bundle}
      source={{
        title: node.metadata.title,
        summary: node.metadata.summary,
        disclaimer: node.metadata.disclaimer,
        initialFile: node.metadata.initial_file,
        files: files.map((file) => ({
          bundleName: file.bundle,
          path: file.metadata.path!,
          context: file.metadata.context!,
          example: file.content,
        })),
      }}
    />
  );
}
