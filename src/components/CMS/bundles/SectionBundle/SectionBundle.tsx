import type { NodeOf } from "../../renderers/ContentViewRender";
import { Section } from "../../../UI/Layout/Section";
import { ContentViewRender } from "../../renderers/ContentViewRender";
import { frameParts } from "../../../../utils/document";
import { FrameContentRender } from "../../renderers/FrameContentRender";
import { useContext } from "react";
import { DocumentContext } from "../../../../hooks/useDocument";
import { children } from "../../../../utils/document";
export function SectionBundle({ node }: { node: NodeOf<"section"> }) {
  const context = useContext(DocumentContext);
  const parts = frameParts(node);
  const definition = context?.sections.find((item) => item.id === node.id);
  const heading = parts.header
    ? children(parts.header).find((item) => item.bundle === "heading")
    : undefined;
  return (
    <Section
      id={node.id}
      variant={node.metadata.variant}
      label={definition}
      previewTitle={
        node.metadata.variant === "preview" ? node.metadata.label : undefined
      }
      headingId={heading?.id}
      slots={{
        header: <FrameContentRender node={parts.header} />,
        content: (
          <ContentViewRender
            blocks={
              node.metadata.variant === "preview" ? node.content : parts.content
            }
          />
        ),
        footer: <FrameContentRender node={parts.footer} />,
      }}
    />
  );
}
