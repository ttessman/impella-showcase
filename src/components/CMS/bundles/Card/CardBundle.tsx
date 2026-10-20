import type { NodeOf } from "../../../../types/cms";
import { Card } from "../../../card/Card/Card";
import { ContentView } from "../../renderers/ContentView";
import { frameParts } from "../../model/document";
import { FrameContent } from "../../renderers/FrameContent";
export function CardBundle({ node }: { node: NodeOf<"card"> }) {
  const parts = frameParts(node);
  return (
    <Card
      id={node.id}
      variant={node.metadata.variant}
      slots={{
        header: parts.header ? <FrameContent node={parts.header} /> : null,
        content: <ContentView blocks={parts.content} />,
        footer: parts.footer ? <FrameContent node={parts.footer} /> : null,
      }}
    />
  );
}
