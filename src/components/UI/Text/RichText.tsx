import Markdown from "react-markdown";
import { remarkCitations } from "../../../utils/markdown";

const inline = ["em", "strong", "a", "code", "br", "sup", "span"];
const blocks = [...inline, "p", "ul", "ol", "li", "blockquote", "pre", "hr"];
/** Rich text is supported by default; raw HTML stays literal and URLs are sanitized. */
export function RichText({
  text,
  block = false,
  links = true,
}: {
  text: string;
  block?: boolean;
  links?: boolean;
}) {
  return (
    <Markdown
      remarkPlugins={[remarkCitations]}
      allowedElements={(block ? blocks : inline).filter(
        (tag) => links || tag !== "a",
      )}
      unwrapDisallowed
    >
      {text}
    </Markdown>
  );
}
