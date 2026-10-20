import type { NodeOf } from "../../../../types/cms";
import { Footer } from "./Footer";
import { ContentView } from "../../renderers/ContentView";
export function FooterBundle({ node }: { node: NodeOf<"footer"> }) {
  return (
    <Footer id={node.id} variant={node.metadata.variant}>
      <ContentView blocks={node.content} />
    </Footer>
  );
}
