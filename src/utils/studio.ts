import { visit } from "jsonc-parser";
import type { NodeOf } from "../components/CMS/renderers/ContentViewRender";
import { imageOptions } from "../components/CMS/bundles/MediaBundle/MediaFields";
import { validateBundleMetadata } from "./document";

/** The studio edits a bounded subset of the shared CMS node vocabulary. */
export type StudioHeadingBundle = Omit<
  NodeOf<"heading">,
  "metadata" | "content"
> & {
  metadata: { level: 2 | 3 };
  content: string;
};
export type StudioTextBundle = Omit<NodeOf<"text_block">, "content"> & {
  content: string;
};
export type StudioMediaBundle = Omit<NodeOf<"media">, "content"> & {
  content: StudioTextBundle[];
};
export type StudioSectionBundle = Omit<NodeOf<"section">, "content"> & {
  content: StudioBundle[];
};
export type StudioReferencesBundle = Omit<
  NodeOf<"references_accordion">,
  "content"
> & { content: StudioTextBundle[] };
export type StudioBundle =
  | StudioHeadingBundle
  | StudioTextBundle
  | StudioMediaBundle
  | StudioSectionBundle
  | StudioReferencesBundle;
export type StudioBundleName = StudioBundle["bundle"];
/** Page chrome is outside this demo; root metadata only needs version and title. */
export type StudioDocument = Omit<NodeOf<"page">, "metadata" | "content"> & {
  metadata: Pick<NodeOf<"page">["metadata"], "schema_version" | "title">;
  content: StudioBundle[];
};

export function findBlock(
  blocks: StudioBundle[],
  id: string,
): StudioBundle | undefined {
  for (const block of blocks) {
    if (block.id === id) return block;
    if (block.bundle === "section") {
      const found = findBlock(block.content, id);
      if (found) return found;
    }
  }
}
/** The direct owning section, or page root. */
export function blockParent(
  blocks: StudioBundle[],
  id: string,
  parentId: string | null = null,
): string | null | undefined {
  for (const block of blocks) {
    if (block.id === id) return parentId;
    if (block.bundle === "section") {
      const parent = blockParent(block.content, id, block.id);
      if (parent !== undefined) return parent;
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
      : b.bundle === "section"
        ? { ...b, content: updateBlock(b.content, id, update) }
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
      b.bundle === "section"
        ? { ...b, content: removeBlock(b.content, id) }
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
    b.bundle === "section"
      ? { ...b, content: moveBlock(b.content, id, delta) }
      : b,
  );
}
export function sections(
  blocks: StudioBundle[],
  depth = 0,
): { block: StudioSectionBundle; depth: number }[] {
  return blocks.flatMap((b) =>
    b.bundle === "section"
      ? [{ block: b, depth }, ...sections(b.content, depth + 1)]
      : [],
  );
}
export function blockLabel(block: StudioBundle): string {
  switch (block.bundle) {
    case "heading":
      return block.content || "Untitled heading";
    case "text_block":
      return block.content || "Empty paragraph";
    case "media":
      return block.content[0]?.content || "Image";
    case "section":
      return block.metadata.label || "Untitled section";
    case "references_accordion":
      return block.metadata.label || "References";
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
  if (target.parentId && (!parent || parent.bundle !== "section"))
    return blocks;
  if (
    block.bundle === "section" &&
    target.parentId &&
    (target.parentId === id || findBlock(block.content, target.parentId))
  )
    return blocks;
  const siblings = parent?.bundle === "section" ? parent.content : blocks;
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
        b.bundle === "section" ? { ...b, content: insert(b.content) } : b,
      )
    : insert(remaining);
}

/** A bounded authoring profile of the CMS contract, not a second wire format. */
export function parsePage(raw: string): StudioDocument {
  if (raw.length > 100_000)
    throw Error("JSON: maximum size is 100,000 characters.");
  let input: unknown;
  try {
    input = JSON.parse(raw);
  } catch {
    const location = { line: 0, column: 0, found: false };
    visit(
      raw,
      {
        onError: (_error, _offset, _length, line, column) => {
          if (location.found) return;
          location.line = line + 1;
          location.column = column + 1;
          location.found = true;
        },
      },
      {
        disallowComments: true,
        allowTrailingComma: false,
        allowEmptyContent: false,
      },
    );
    const at = location.found
      ? ` at line ${location.line}, column ${location.column}`
      : "";
    throw Error(
      `JSON syntax error${at}. Check quotes, commas and closing brackets.`,
    );
  }

  const ids = new Set<string>();
  let count = 0;
  function object(value: unknown, path: string): Record<string, unknown> {
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw Error(`${path}: expected an object.`);
    return value as Record<string, unknown>;
  }
  function keys(
    value: Record<string, unknown>,
    allowed: string[],
    path: string,
  ) {
    for (const key of Object.keys(value))
      if (!allowed.includes(key))
        throw Error(`${path}.${key}: unsupported property.`);
  }
  function text(value: unknown, path: string): string {
    if (typeof value !== "string") throw Error(`${path}: expected text.`);
    if (value.length > 5000)
      throw Error(`${path}: maximum length is 5,000 characters.`);
    return value;
  }
  function envelope(value: unknown, path: string) {
    const node = object(value, path);
    keys(node, ["id", "bundle", "metadata", "content"], path);
    const id = text(node.id, `${path}.id`);
    if (!/^[A-Za-z][\w-]{0,79}$/.test(id))
      throw Error(
        `${path}.id: use 1–80 letters, digits, underscores or hyphens, starting with a letter.`,
      );
    if (ids.has(id)) throw Error(`${path}.id: duplicate ID "${id}".`);
    ids.add(id);
    if (!Object.hasOwn(node, "content"))
      throw Error(`${path}.content: required.`);
    return node;
  }
  function list(value: unknown, path: string, depth: number): StudioBundle[] {
    if (!Array.isArray(value))
      throw Error(`${path}: expected an array of blocks.`);
    if (depth > 5)
      throw Error(`${path}: sections may nest at most 5 levels deep.`);
    return value.map((item, i) => block(item, `${path}[${i}]`, depth));
  }
  function block(value: unknown, path: string, depth: number): StudioBundle {
    if (++count > 100) throw Error(`${path}: maximum 100 blocks per page.`);
    const node = envelope(value, path);
    const m = object(node.metadata, `${path}.metadata`);
    // Bound all authorable strings, including metadata, before rendering.
    for (const [key, value] of Object.entries(m))
      if (typeof value === "string") text(value, `${path}.metadata.${key}`);
    const bundle = node.bundle;
    if (
      typeof bundle !== "string" ||
      ![
        "heading",
        "text_block",
        "media",
        "section",
        "references_accordion",
      ].includes(bundle)
    )
      throw Error(`${path}.bundle: unsupported bundle "${String(bundle)}".`);
    validateBundleMetadata(
      bundle as StudioBundle["bundle"],
      m,
      `${path}.metadata`,
    );
    switch (bundle) {
      case "heading":
        if (m.level !== 2 && m.level !== 3)
          throw Error(`${path}.metadata.level: choose 2 or 3.`);
        text(node.content, `${path}.content`);
        break;
      case "text_block":
        keys(m, ["variant"], `${path}.metadata`);
        if (m.variant !== undefined && m.variant !== "plain")
          throw Error(`${path}.metadata.variant: choose plain.`);
        text(node.content, `${path}.content`);
        break;
      case "media": {
        keys(
          m,
          ["src", "alt", "width", "height", "title", "variant"],
          `${path}.metadata`,
        );
        if (!imageOptions.some((url) => `/${url}` === m.src))
          throw Error(`${path}.metadata.src: choose a bundled demo image.`);
        if (!(m.alt as string).trim())
          throw Error(`${path}.metadata.alt: describe the image.`);
        if (m.variant !== "inline")
          throw Error(`${path}.metadata.variant: choose inline.`);
        const content = list(node.content, `${path}.content`, depth);
        if (
          content.length > 1 ||
          content.some((item) => item.bundle !== "text_block")
        )
          throw Error(
            `${path}.content: expected at most one text_block caption.`,
          );
        break;
      }
      case "section":
        if (m.variant !== "preview" || m.navigation !== false)
          throw Error(
            `${path}.metadata: studio sections require variant preview and navigation false.`,
          );
        list(node.content, `${path}.content`, depth + 1);
        break;
      case "references_accordion": {
        if (!Array.isArray(node.content) || node.content.length > 30)
          throw Error(`${path}.content: expected at most 30 text entries.`);
        const content = list(node.content, `${path}.content`, depth);
        if (content.some((item) => item.bundle !== "text_block"))
          throw Error(
            `${path}.content: references require text_block entries.`,
          );
        break;
      }
    }
    // All envelope, metadata, content and ownership checks succeeded.
    return node as StudioBundle;
  }
  const page = envelope(input, "page");
  if (page.bundle !== "page") throw Error("page.bundle: expected page.");
  const m = object(page.metadata, "page.metadata");
  keys(m, ["schema_version", "title"], "page.metadata");
  if (m.schema_version !== 1)
    throw Error("page.metadata.schema_version: expected 1.");
  const title = text(m.title, "page.metadata.title");
  return {
    id: page.id as string,
    bundle: "page",
    metadata: { schema_version: 1, title },
    content: list(page.content, "page.content", 0),
  };
}
