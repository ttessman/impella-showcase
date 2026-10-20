import type { NodeOf } from "../../renderers/ContentViewRender";
import { Footer } from "../../../UI/Footer/Footer";
import { ContentViewRender } from "../../renderers/ContentViewRender";
export function FooterBundle({ node }: { node: NodeOf<"footer"> }) {
  return (
    <Footer id={node.id} variant={node.metadata.variant}>
      <ContentViewRender blocks={node.content} />
    </Footer>
  );
}
