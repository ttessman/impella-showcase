import type { StudioBundle } from "./studioDocument";
import type { StudioSectionBundle } from "./studioDocument";
export function findBlock(
  blocks: StudioBundle[],
  id: string,
): StudioBundle | undefined {
  for (const block of blocks) {
    if (block.id === id) return block;
    if (block.bundle === "demo_section") {
      const found = findBlock(block.children, id);
      if (found) return found;
    }
  }
}
export function updateBlock(
  blocks: StudioBundle[],
  id: string,
  update: (b: StudioBundle) => StudioBundle,
): StudioBundle[] {
  return blocks.map((b) =>
    b.id === id
      ? update(b)
      : b.bundle === "demo_section"
        ? { ...b, children: updateBlock(b.children, id, update) }
        : b,
  );
}
export function removeBlock(
  blocks: StudioBundle[],
  id: string,
): StudioBundle[] {
  return blocks
    .filter((b) => b.id !== id)
    .map((b) =>
      b.bundle === "demo_section"
        ? { ...b, children: removeBlock(b.children, id) }
        : b,
    );
}
export function moveBlock(
  blocks: StudioBundle[],
  id: string,
  delta: number,
): StudioBundle[] {
  const index = blocks.findIndex((b) => b.id === id);
  if (index >= 0) {
    const next = [...blocks],
      target = index + delta;
    if (target >= 0 && target < next.length)
      [next[index], next[target]] = [next[target], next[index]];
    return next;
  }
  return blocks.map((b) =>
    b.bundle === "demo_section"
      ? { ...b, children: moveBlock(b.children, id, delta) }
      : b,
  );
}
export function sections(
  blocks: StudioBundle[],
  depth = 0,
): { block: StudioSectionBundle; depth: number }[] {
  return blocks.flatMap((b) =>
    b.bundle === "demo_section"
      ? [{ block: b, depth }, ...sections(b.children, depth + 1)]
      : [],
  );
}
export function blockLabel(block: StudioBundle): string {
  switch (block.bundle) {
    case "header":
      return block.header || "Untitled heading";
    case "text_block":
      return block.text_body || "Empty paragraph";
    case "media":
      return block.media_caption || "Image";
    case "demo_section":
      return block.header || "Untitled section";
    case "references_accordion":
      return block.references_accordion_title || "References";
  }
}

export type DropTarget = { parentId: string | null; beforeId: string | null };

/** Move a complete subtree without changing its IDs or losing its descendants. */
export function relocateBlock(
  blocks: StudioBundle[],
  id: string,
  target: DropTarget,
): StudioBundle[] {
  const block = findBlock(blocks, id);
  if (!block || target.beforeId === id) return blocks;
  const parent = target.parentId ? findBlock(blocks, target.parentId) : null;
  if (target.parentId && (!parent || parent.bundle !== "demo_section"))
    return blocks;
  if (
    block.bundle === "demo_section" &&
    target.parentId &&
    (target.parentId === id || findBlock(block.children, target.parentId))
  )
    return blocks;
  const siblings = parent?.bundle === "demo_section" ? parent.children : blocks;
  if (target.beforeId && !siblings.some((b) => b.id === target.beforeId))
    return blocks;
  const remaining = removeBlock(blocks, id);
  const insert = (list: StudioBundle[]) => {
    const next = [...list];
    const index = target.beforeId
      ? next.findIndex((b) => b.id === target.beforeId)
      : next.length;
    next.splice(index, 0, block);
    return next;
  };
  return target.parentId
    ? updateBlock(remaining, target.parentId, (b) =>
        b.bundle === "demo_section"
          ? { ...b, children: insert(b.children) }
          : b,
      )
    : insert(remaining);
}
