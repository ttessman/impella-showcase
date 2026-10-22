import { useDocument } from "../../../../hooks/useDocument";
import type { NodeOf } from "../../renderers/ContentViewRender";
import { Footer } from "../../../UI/Footer/Footer";
import { ContentViewRender } from "../../renderers/ContentViewRender";

export function FooterBundle({ node }: { node: NodeOf<"footer"> }) {
  const { page } = useDocument();
  const summary =
    node.metadata.variant === "site"
      ? node.content.find(
          (item): item is NodeOf<"group"> =>
            item.bundle === "group" &&
            item.metadata.variant === "footer-summary",
        )
      : undefined;
  const summaryContent = summary?.content.find(
    (item): item is NodeOf<"group"> => item.bundle === "group",
  );
  return (
    <Footer
      data-bundle-name={node.bundle}
      id={node.id}
      variant={node.metadata.variant}
      summary={
        summaryContent && (
          <ContentViewRender
            blocks={summaryContent.content.filter(
              (item) => item.bundle !== "button",
            )}
          />
        )
      }
      summaryActions={
        summaryContent && (
          <ContentViewRender
            blocks={summaryContent.content.filter(
              (item) => item.bundle === "button",
            )}
          />
        )
      }
      summaryAside={
        summary && (
          <ContentViewRender
            blocks={summary.content.filter((item) => item !== summaryContent)}
          />
        )
      }
      summaryAttributes={
        summary
          ? { id: summary.id, "data-bundle-name": summary.bundle }
          : undefined
      }
      summaryContentAttributes={
        summaryContent
          ? { id: summaryContent.id, "data-bundle-name": summaryContent.bundle }
          : undefined
      }
      componentLibrary={
        node.metadata.variant === "site"
          ? page.metadata.component_library
          : undefined
      }
    >
      <ContentViewRender
        blocks={node.content.filter((item) => item !== summary)}
      />
    </Footer>
  );
}
