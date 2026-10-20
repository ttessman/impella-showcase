import type { NodeOf } from "../../../../types/cms";
import { useDocument } from "../../model/DocumentContext";
import { Button } from "../../../actions/Button/Button";
import { assetUrl } from "../../model/assets";
import { DocumentDialog } from "../../../content/Document/DocumentDialog";
import { buildReaderDocument } from "../../model/reader";
import { RichContent } from "../../shared/RichContent";

export function Action({ node }: { node: NodeOf<"action"> }) {
  const context = useDocument();
  if (node.metadata.action === "reader")
    return (
      <DocumentDialog
        definition={buildReaderDocument(context)}
        label={typeof node.content === "string" ? node.content : undefined}
      />
    );
  const href = node.metadata.href.startsWith("/assets/")
    ? assetUrl(node.metadata.href)
    : node.metadata.href;
  return (
    <Button asChild>
      <a
        href={href}
        className={
          node.metadata.variant === "primary" ? "button primary" : "text-link"
        }
        target={node.metadata.new_tab ? "_blank" : undefined}
        rel={node.metadata.new_tab ? "noreferrer" : undefined}
      >
        <RichContent node={node} />
      </a>
    </Button>
  );
}
