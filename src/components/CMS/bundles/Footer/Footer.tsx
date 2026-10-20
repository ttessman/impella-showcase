import type { NodeOf } from "../../../../types/cms";
import { ContentView } from "../../ContentView/ContentView";

export function Footer({ node }: { node: NodeOf<"footer"> }) {
  return (
    <footer
      id={node.id}
      className={node.metadata.variant === "site" ? "site-footer" : undefined}
    >
      <ContentView blocks={node.content} />
    </footer>
  );
}
