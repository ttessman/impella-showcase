import type { SectionBlock as Block } from "../../../../types/content";
import { ContentView } from "../../ContentView/ContentView";

export function SectionBlock({ block }: { block: Block }) {
  return (
    <section className="preview-section">
      <h3>{block.header}</h3>
      <ContentView blocks={block.children} />
    </section>
  );
}
