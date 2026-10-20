import { useContext } from "react";
import type { NodeOf, CmsNode } from "../../../types/cms";
import { Card as CardFrame } from "../../card/Card/Card";
import { ReadingNavigation as ReadingNavigationView } from "../../layout/ReadingHeader/ReadingNavigation";
import { ContentView } from "../ContentView/ContentView";
import { children, frameParts } from "../model/document";
import { DocumentContext, useDocument } from "../model/DocumentContext";
import { SectionLabel } from "../../content/SectionLabel/SectionLabel";
import { variantClass } from "../model/variants";

const content = (node?: CmsNode) =>
  node ? <ContentView blocks={children(node)} /> : null;
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
export function Group({ node }: { node: NodeOf<"group"> | NodeOf<"grid"> }) {
  const Element =
    node.bundle === "group" ? (node.metadata.element ?? "div") : "div";
  return (
    <Element
      id={node.id}
      className={variantClass(node.bundle, node.metadata.variant) || undefined}
    >
      <ContentView blocks={node.content} />
    </Element>
  );
}
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
        {content(parts.header)}
      </div>
      <ContentView blocks={parts.content} />
      {content(parts.footer)}
    </section>
  );
}
export function Card({ node }: { node: NodeOf<"card"> }) {
  const parts = frameParts(node);
  if (node.metadata.variant === "source-summary")
    return (
      <article id={node.id}>
        <ContentView blocks={node.content} />
      </article>
    );
  return (
    <CardFrame
      id={node.id}
      variant={node.metadata.variant}
      slots={{
        header: content(parts.header),
        content: <ContentView blocks={parts.content} />,
        footer: content(parts.footer),
      }}
    />
  );
}
export function Hero({ node }: { node: NodeOf<"hero"> }) {
  const parts = frameParts(node);
  return (
    <div className="hero-band">
      <div id={node.id} className="hero">
        <div className="hero-copy">{content(parts.header)}</div>
        <ContentView blocks={parts.content} />
      </div>
      {content(parts.footer)}
    </div>
  );
}
export function ReadingNavigation({
  node,
}: {
  node: NodeOf<"reading_header">;
}) {
  const { page, sections } = useDocument();
  return (
    <ReadingNavigationView
      sections={sections}
      identity={node.content}
      navigation={page.metadata.navigation}
    />
  );
}
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
