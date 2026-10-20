import { useContext } from "react";
import type { NodeOf } from "../../../../types/cms";
import { ContentView } from "../../renderers/ContentView";
import { children } from "../../model/document";
import { frameParts } from "../../model/document";
import { DocumentContext } from "../../model/DocumentContext";
import { SectionLabel } from "../../../content/SectionLabel/SectionLabel";
import { FrameContent } from "../../renderers/FrameContent";

export function Section({ node }: { node: NodeOf<"section"> }) {
  const context = useContext(DocumentContext);
  if (node.metadata.variant === "preview")
    return (
      <section className="preview-section">
        <ContentView blocks={node.content} />
      </section>
    );
  const parts = frameParts(node);
  const definition = context?.sections.find((item) => item.id === node.id);
  const heading = parts.header
    ? children(parts.header).find((item) => item.bundle === "heading")
    : undefined;
  return (
    <section
      id={node.id}
      className={`case-section${node.metadata.variant === "full-bleed" ? " demo-section" : node.metadata.variant === "paper" ? " section-paper" : ""}`}
      aria-labelledby={heading?.id}
    >
      <div className="section-heading">
        {definition && <SectionLabel as="p" definition={definition} />}
        <FrameContent node={parts.header} />
      </div>
      <ContentView blocks={parts.content} />
      <FrameContent node={parts.footer} />
    </section>
  );
}
