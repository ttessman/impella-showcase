import type { TextContent } from "../../../types/caseStudy";
/** Structured inline content renders as React nodes, never injected HTML. */
export function RichText({ content }: { content: TextContent }) {
  return typeof content === "string"
    ? content
    : content.map((part, index) =>
        typeof part === "string" ? part : <code key={index}>{part.code}</code>,
      );
}
