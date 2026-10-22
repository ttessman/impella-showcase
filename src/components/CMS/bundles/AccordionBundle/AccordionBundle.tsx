import type { NodeOf } from "../../renderers/ContentViewRender";
import { Accordion } from "../../../UI/Accordion/Accordion";
import { ContentViewRender } from "../../renderers/ContentViewRender";
export function AccordionBundle({ node }: { node: NodeOf<"accordion"> }) {
  return (
    <Accordion
      data-bundle-name={node.bundle}
      label={node.metadata.label}
      variant={node.metadata.variant}
      initiallyExpanded={node.metadata.initially_expanded}
    >
      <ContentViewRender blocks={node.content} />
    </Accordion>
  );
}
