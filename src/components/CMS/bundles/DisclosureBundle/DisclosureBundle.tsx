import type { NodeOf } from "../../renderers/ContentViewRender";
import { Disclosure } from "../../../UI/Disclosure/Disclosure";
import { ContentViewRender } from "../../renderers/ContentViewRender";
export function DisclosureBundle({ node }: { node: NodeOf<"disclosure"> }) {
  return (
    <Disclosure
      label={node.metadata.label}
      variant={node.metadata.variant}
      initiallyExpanded={node.metadata.initially_expanded}
    >
      <ContentViewRender blocks={node.content} />
    </Disclosure>
  );
}
