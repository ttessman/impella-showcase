import { Page } from "../../../UI/Layout/Page";
import type { NodeOf } from "../../renderers/ContentViewRender";
import { ContentViewRender } from "../../renderers/ContentViewRender";

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
      data-bundle-name={node.bundle}
      skipLink={{
        href: `#${main?.id ?? node.id}`,
        label: node.metadata.skip_label,
      }}
      slots={{
        header: <ContentViewRender blocks={reading} />,
        content: <ContentViewRender blocks={body} />,
        footer: <ContentViewRender blocks={footers} />,
      }}
    />
  );
}
