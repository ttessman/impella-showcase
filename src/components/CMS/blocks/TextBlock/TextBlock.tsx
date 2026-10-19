import { CitedText } from "../../../content/CitedText/CitedText";
import type { TextBlock as Block } from "../../../../types/content";

export function TextBlock({ block }: { block: Block }) {
  return (
    <p className="plain-text">
      <CitedText text={block.text_body} />
    </p>
  );
}
