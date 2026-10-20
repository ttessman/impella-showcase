import type { NodeOf } from "../../../../types/cms";
import { ContentView } from "../../renderers/ContentView";
import { frameParts } from "../../model/document";
import { FrameContent } from "../../renderers/FrameContent";

export function Hero({ node }: { node: NodeOf<"hero"> }) {
  const parts = frameParts(node);
  return (
    <div className="hero-band">
      <div id={node.id} className="hero">
        <div className="hero-copy">
          <FrameContent node={parts.header} />
        </div>
        <ContentView blocks={parts.content} />
      </div>
      <FrameContent node={parts.footer} />
    </div>
  );
}
