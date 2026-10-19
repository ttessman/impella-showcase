import type { HeaderBlock as Block } from "../../../../types/content";

export function HeadingBlock({ block }: { block: Block }) {
  return block.level === 2 ? <h3>{block.header}</h3> : <h4>{block.header}</h4>;
}
