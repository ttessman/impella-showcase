import { ImageDialogTrigger } from "../../../UI/Dialog/variants/ImageDialogTrigger";
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
  if (node.metadata.action === "image") {
    const media = context.nodes.get(node.metadata.target_id ?? "");
    if (media?.bundle !== "media" || !media.metadata.dialog) return null;
    return (
      <ImageDialogTrigger
        image={{
          src: assetUrl(media.metadata.src),
          alt: media.metadata.alt,
          width: media.metadata.width,
          height: media.metadata.height,
        }}
        title={media.metadata.dialog.title ?? media.metadata.title}
        closeLabel={
          media.metadata.dialog.close_label ??
          media.metadata.close_label ??
          "Close screenshot"
        }
        size={media.metadata.dialog.size}
        className="text-link image-dialog-action"
      >
        <RichContentRender node={node} />
      </ImageDialogTrigger>
    );
  }
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
