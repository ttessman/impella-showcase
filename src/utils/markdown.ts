import { unified } from "unified";
import remarkParse from "remark-parse";
import { toString } from "mdast-util-to-string";
import type { Root } from "mdast";

type MarkdownNode = {
  type: string;
  value?: string;
  children?: MarkdownNode[];
  data?: object;
};
const parser = unified().use(remarkParse);

/** Preserve the established numeric citation convention without enabling raw HTML. */
export function remarkCitations() {
  return (tree: Root) => {
    function visit(node: MarkdownNode) {
      const items = node.children;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        const opening = items[i],
          value = items[i + 1],
          closing = items[i + 2];
        if (
          opening.type === "html" &&
          opening.value === "<sup>" &&
          value?.type === "text" &&
          /^[1-9]\d{0,2}(?:\s*,\s*[1-9]\d{0,2})*$/.test(value.value ?? "") &&
          closing?.type === "html" &&
          closing.value === "</sup>"
        ) {
          const numbers = value.value!.split(",").map((n) => n.trim());
          items.splice(i, 3, {
            type: "emphasis",
            children: [],
            data: {
              hName: "sup",
              hChildren: [
                {
                  type: "element",
                  tagName: "span",
                  properties: { className: ["sr-only"] },
                  children: [
                    {
                      type: "text",
                      value:
                        numbers.length === 1 ? "Reference " : "References ",
                    },
                  ],
                },
                { type: "text", value: numbers.join(",") },
              ],
            },
          });
        } else if (opening.type === "html") {
          // Treat every other HTML token as authored literal text.
          items[i] = { type: "text", value: opening.value };
        } else visit(opening);
      }
    }
    visit(tree);
  };
}

/** Readable titles/companions omit Markdown syntax while preserving authored text. */
export function plainRichText(text: string): string {
  const source = text.replace(
    /<sup>([1-9]\d{0,2}(?:\s*,\s*[1-9]\d{0,2})*)<\/sup>/g,
    "[$1]",
  );
  return parser
    .parse(source)
    .children.map((node) => toString(node))
    .join("\n\n");
}

export function hasRichTextBlocks(text: string): boolean {
  const blocks = parser.parse(text).children;
  return blocks.length > 1 || (!!blocks[0] && blocks[0].type !== "paragraph");
}
