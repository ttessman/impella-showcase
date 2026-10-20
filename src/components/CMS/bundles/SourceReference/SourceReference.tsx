import type { NodeOf } from "../../../../types/cms";
import { SourceReference as SourceReferenceView } from "../../../source/SourceReference/SourceReference";
export function SourceReference({
  node,
}: {
  node: NodeOf<"source_reference">;
}) {
  const files = node.content.filter(
    (child): child is NodeOf<"code"> => child.bundle === "code",
  );
  return (
    <SourceReferenceView
      source={{
        title: node.metadata.title,
        summary: node.metadata.summary,
        disclaimer: node.metadata.disclaimer,
        initialFile: node.metadata.initial_file,
        files: files.map((file) => ({
          path: file.metadata.path!,
          context: file.metadata.context!,
          example: file.content,
        })),
      }}
    />
  );
}
