import type { NodeOf } from "../../../../types/cms";
import { useDocument } from "../../model/DocumentContext";
import { Action } from "./Action";
import { assetUrl } from "../../utils/assets";
import { ReaderDialog } from "./ReaderDialog";
import { buildReaderDocument } from "../../model/reader";
import { RichContent } from "../../renderers/RichContent";

export function ActionBundle({ node }: { node: NodeOf<"action"> }) {
  const context = useDocument();
  if (node.metadata.action === "reader")
    return (
      <ReaderDialog
        definition={buildReaderDocument(context)}
        label={typeof node.content === "string" ? node.content : undefined}
      />
    );
  const href = node.metadata.href.startsWith("/assets/")
    ? assetUrl(node.metadata.href)
    : node.metadata.href;
  return (
    <Action
      href={href}
      variant={node.metadata.variant}
      newTab={node.metadata.new_tab}
    >
      <RichContent node={node} />
    </Action>
  );
}
