import { Page } from "./Page";
import type { NodeOf } from "../../../../types/cms";
import { ContentView } from "../../renderers/ContentView";

export function PageBundle({ node }: { node: NodeOf<"page"> }) {
  const reading = node.content.filter(
    (item) => item.bundle === "reading_header" || item.bundle === "header",
  );
  const footers = node.content.filter((item) => item.bundle === "footer");
  const body = node.content.filter(
    (item) => !["reading_header", "header", "footer"].includes(item.bundle),
  );
  const main = body.find(
    (item) => item.bundle === "group" && item.metadata.element === "main",
  );
  return (
    <Page
      skipLink={{
        href: `#${main?.id ?? node.id}`,
        label: node.metadata.skip_label,
      }}
      slots={{
        header: <ContentView blocks={reading} />,
        content: <ContentView blocks={body} />,
        footer: <ContentView blocks={footers} />,
      }}
    />
  );
}
