import type { NodeOf } from "../../renderers/ContentViewRender";
import { useDocument } from "../../../../hooks/useDocument";
import { Action } from "../../../UI/Action/Action";
import { assetUrl } from "../../../../utils/assets";
import { ReaderDialog } from "../../../UI/Dialog/variants/ReaderDialog";
import { buildReaderDocument } from "../../../../utils/document";
import { RichContentRender } from "../../renderers/RichContentRender";

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
      <RichContentRender node={node} />
    </Action>
  );
}
