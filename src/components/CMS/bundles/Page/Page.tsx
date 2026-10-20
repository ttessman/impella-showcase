import type { NodeOf } from "../../../../types/cms";
import { ContentView } from "../../ContentView/ContentView";

export function Page({ node }: { node: NodeOf<"page"> }) {
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
    <>
      <a className="skip-link" href={`#${main?.id ?? node.id}`}>
        {node.metadata.skip_label}
      </a>
      <ContentView blocks={reading} />
      <ContentView blocks={body} />
      <ContentView blocks={footers} />
    </>
  );
}
