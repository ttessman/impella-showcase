import type { NodeOf, CmsNode } from "../../../types/cms";
import { Button } from "../../actions/Button/Button";
import { CitedText } from "../../content/CitedText/CitedText";
import { ContentView } from "../ContentView/ContentView";
import { variantClass } from "../model/variants";
import { assetUrl } from "../model/assets";
import { DocumentDialog } from "../../content/Document/DocumentDialog";
import { useDocument } from "../model/DocumentContext";
import { buildReaderDocument } from "../model/reader";
export function RichContent({ node }: { node: CmsNode }) {
  return typeof node.content === "string" ? (
    <CitedText text={node.content} />
  ) : (
    <ContentView blocks={Array.isArray(node.content) ? node.content : []} />
  );
}
export function Text({ node }: { node: NodeOf<"text"> }) {
  const copy = node.content;
  const mark = node.metadata.mark;
  return (
    <>
      {mark === "code" ? (
        <code>{copy}</code>
      ) : mark === "bold" ? (
        <b>{copy}</b>
      ) : mark === "emphasis" ? (
        <em>{copy}</em>
      ) : (
        copy
      )}
      {node.metadata.break_after && <br />}
    </>
  );
}
export function Heading({ node }: { node: NodeOf<"heading"> }) {
  const Element = `h${node.metadata.level}` as
    "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  return (
    <Element id={node.id}>
      <RichContent node={node} />
    </Element>
  );
}
export function TextBlock({ node }: { node: NodeOf<"text_block"> }) {
  const Element = node.metadata.element ?? "p";
  return (
    <Element
      className={variantClass("text_block", node.metadata.variant) || undefined}
    >
      <RichContent node={node} />
    </Element>
  );
}
export function Figure({ node }: { node: NodeOf<"figure"> }) {
  return (
    <figure
      className={variantClass("figure", node.metadata.variant) || undefined}
    >
      <ContentView blocks={node.content} />
    </figure>
  );
}
export function List({ node }: { node: NodeOf<"list"> }) {
  const Element =
    node.metadata.variant === "summary"
      ? "div"
      : node.metadata.ordered
        ? "ol"
        : "ul";
  return (
    <Element
      className={variantClass("list", node.metadata.variant) || undefined}
    >
      {node.content.map((item) => {
        const Item = Element === "div" ? "div" : "li";
        return (
          <Item key={item.id}>
            <ContentView
              blocks={Array.isArray(item.content) ? item.content : []}
            />
          </Item>
        );
      })}
    </Element>
  );
}
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
export function Disclosure({ node }: { node: NodeOf<"disclosure"> }) {
  return (
    <details
      className={
        node.metadata.variant === "implementation"
          ? "tool-implementation"
          : undefined
      }
      open={node.metadata.initially_expanded || undefined}
    >
      <summary>{node.metadata.label}</summary>
      <ContentView blocks={node.content} />
    </details>
  );
}
export function Code({ node }: { node: NodeOf<"code"> }) {
  return node.metadata.variant === "inline" ? (
    <code>{node.content}</code>
  ) : (
    <pre>
      <code>{node.content}</code>
    </pre>
  );
}
export function References({ node }: { node: NodeOf<"references_accordion"> }) {
  return (
    <details open>
      <summary>{node.metadata.label}</summary>
      <ol>
        {node.content.map((item) => (
          <li key={item.id}>
            <RichContent node={item} />
          </li>
        ))}
      </ol>
    </details>
  );
}
