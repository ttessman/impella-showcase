import type { NodeOf } from "../../../../types/cms";
import { Card as CardFrame } from "../../../card/Card/Card";
import { ContentView } from "../../ContentView/ContentView";
import { frameParts } from "../../model/document";
import { FrameContent } from "../../shared/FrameContent";

export function Card({ node }: { node: NodeOf<"card"> }) {
  const parts = frameParts(node);
  if (node.metadata.variant === "source-summary")
    return (
      <article id={node.id}>
        <ContentView blocks={node.content} />
      </article>
    );
  return (
    <CardFrame
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
