import type { NodeOf } from "../../../../types/cms";
import { Media } from "./Media";
import { ContentView } from "../../renderers/ContentView";
import { assetUrl } from "../../utils/assets";
import { textContent } from "../../model/document";
export function MediaBundle({ node }: { node: NodeOf<"media"> }) {
  const caption =
    node.metadata.variant === "hero" || node.metadata.variant === "evidence" ? (
      node.content.map(textContent).join("")
    ) : (
      <ContentView blocks={node.content} />
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
