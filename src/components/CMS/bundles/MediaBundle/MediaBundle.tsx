import type { NodeOf } from "../../renderers/ContentViewRender";
import { Media } from "../../../UI/Media/Media";
import { ContentViewRender } from "../../renderers/ContentViewRender";
import { assetUrl } from "../../../../utils/assets";
import { textContent } from "../../../../utils/document";
export function MediaBundle({ node }: { node: NodeOf<"media"> }) {
  const caption =
    node.metadata.variant === "hero" || node.metadata.variant === "evidence" ? (
      node.content.map(textContent).join("")
    ) : (
      <ContentViewRender blocks={node.content} />
    );
  return (
    <Media
      definition={{
        image: {
          src: assetUrl(node.metadata.src),
          alt: node.metadata.alt,
          width: node.metadata.width,
          height: node.metadata.height,
        },
        title: node.metadata.title,
        variant: node.metadata.variant,
        body: node.metadata.body,
        captionLabel: node.metadata.caption_label,
        triggerLabel: node.metadata.trigger_label,
        closeLabel: node.metadata.close_label,
        originalLinkLabel: node.metadata.original_link_label,
      }}
      caption={caption}
    />
  );
}
