import type { NodeOf } from "../../../../types/cms";
import { Disclosure } from "./Disclosure";
import { ContentView } from "../../renderers/ContentView";
export function DisclosureBundle({ node }: { node: NodeOf<"disclosure"> }) {
  return (
    <Disclosure
      label={node.metadata.label}
      variant={node.metadata.variant}
      initiallyExpanded={node.metadata.initially_expanded}
    >
      <ContentView blocks={node.content} />
    </Disclosure>
  );
}
