import type { NodeOf } from "../../../../types/cms";
import { Section } from "./Section";
import { ContentView } from "../../renderers/ContentView";
import { frameParts } from "../../model/document";
import { FrameContent } from "../../renderers/FrameContent";
import { useContext } from "react";
import { DocumentContext } from "../../model/DocumentContext";
import { children } from "../../model/document";
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
      headingId={heading?.id}
      slots={{
        header: <FrameContent node={parts.header} />,
        content: (
          <ContentView
            blocks={
              node.metadata.variant === "preview" ? node.content : parts.content
            }
          />
        ),
        footer: <FrameContent node={parts.footer} />,
      }}
    />
  );
}
