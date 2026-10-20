import type { NodeOf } from "../../renderers/ContentViewRender";
import { Card } from "../../../UI/Card/Card";
import { ContentViewRender } from "../../renderers/ContentViewRender";
import { frameParts } from "../../../../utils/document";
import { FrameContentRender } from "../../renderers/FrameContentRender";
export function CardBundle({ node }: { node: NodeOf<"card"> }) {
  const parts = frameParts(node);
  return (
    <Card
      id={node.id}
      variant={node.metadata.variant}
      slots={{
        header: parts.header ? (
          <FrameContentRender node={parts.header} />
        ) : null,
        content: <ContentViewRender blocks={parts.content} />,
        footer: parts.footer ? (
          <FrameContentRender node={parts.footer} />
        ) : null,
      }}
    />
  );
}
