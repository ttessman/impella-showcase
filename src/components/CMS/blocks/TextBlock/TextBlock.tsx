import type { TextBlock as Block } from "../../../../types/content";

export function TextBlock({ block }: { block: Block }) {
  return <p className="plain-text">{block.text_body}</p>;
}
