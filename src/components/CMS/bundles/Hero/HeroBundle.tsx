import type { NodeOf } from "../../../../types/cms";
import { Hero } from "./Hero";
import { ContentView } from "../../renderers/ContentView";
import { frameParts } from "../../model/document";
import { FrameContent } from "../../renderers/FrameContent";
export function HeroBundle({ node }: { node: NodeOf<"hero"> }) {
  const parts = frameParts(node);
  return (
    <Hero
      id={node.id}
      slots={{
        header: <FrameContent node={parts.header} />,
        content: <ContentView blocks={parts.content} />,
        footer: <FrameContent node={parts.footer} />,
      }}
    />
  );
}
