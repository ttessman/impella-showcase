export type HeaderBlock = {
  id: string;
  bundle: "header";
  header: string;
  level: 2 | 3;
};
export type TextBlock = { id: string; bundle: "text_block"; text_body: string };
export type MediaBlock = {
  id: string;
  bundle: "media";
  media: { bundle: "demo_image"; url: string; alt: string };
  media_caption: string;
};
export type SectionBlock = {
  id: string;
  bundle: "demo_section";
  header: string;
  children: ContentBlock[];
};
export type ReferencesBlock = {
  id: string;
  bundle: "references_accordion";
  references_accordion_title: string;
  references_container: { references: string[] };
};
export type ContentBlock =
  HeaderBlock | TextBlock | MediaBlock | SectionBlock | ReferencesBlock;
export type Bundle = ContentBlock["bundle"];
export type ContentPage = {
  title: string;
  primary_content_value: ContentBlock[];
};
export const imageOptions = [
  "assets/demo/field-notes.svg",
  "assets/demo/studio-notes.svg",
];
export const bundles: { value: Bundle; label: string }[] = [
  { value: "header", label: "Heading" },
  { value: "text_block", label: "Paragraph" },
  { value: "media", label: "Image" },
  { value: "demo_section", label: "Section" },
  { value: "references_accordion", label: "References" },
];
export function makeBlock(bundle: Bundle): ContentBlock {
  const id = crypto.randomUUID();
  switch (bundle) {
    case "header":
      return { id, bundle, header: "New heading", level: 2 };
    case "text_block":
      return {
        id,
        bundle,
        text_body: "Add a note from your next creative adventure.",
      };
    case "media":
      return {
        id,
        bundle,
        media: {
          bundle: "demo_image",
          url: imageOptions[0],
          alt: "Illustrated green mountains under a golden sun",
        },
        media_caption: "A fictional field journal illustration.",
      };
    case "demo_section":
      return { id, bundle, header: "New section", children: [] };
    case "references_accordion":
      return {
        id,
        bundle,
        references_accordion_title: "References",
        references_container: {
          references: [
            "Fictional field journal, volume one.",
            "Fictional studio notes, edition two.",
          ],
        },
      };
  }
}
export function defaultPage(): ContentPage {
  return {
    title: "A field guide to noticing",
    primary_content_value: [
      {
        id: "intro",
        bundle: "header",
        header: "Small observations. New ideas.",
        level: 2,
      },
      {
        id: "opening",
        bundle: "text_block",
        text_body:
          "A fictional journal about making time to look closely. Collect a color, sketch a shape, and write down one unexpected detail.",
      },
      {
        id: "landscape",
        bundle: "media",
        media: {
          bundle: "demo_image",
          url: imageOptions[0],
          alt: "Illustrated green mountains under a golden sun",
        },
        media_caption: "Field notes, an invented creative project.",
      },
      {
        id: "chapter",
        bundle: "demo_section",
        header: "Take a closer look",
        children: [
          {
            id: "prompt",
            bundle: "text_block",
            text_body:
              "Choose an ordinary object. Describe its texture without naming the object.",
          },
        ],
      },
      {
        id: "sources",
        bundle: "references_accordion",
        references_accordion_title: "Reading notes",
        references_container: {
          references: ["Fictional field journal, volume one."],
        },
      },
    ],
  };
}

// No casts of untrusted input into state: runtime validation must succeed first.
export function parsePage(raw: string): ContentPage {
  if (raw.length > 100_000)
    throw Error("JSON: maximum size is 100,000 characters.");
  let input: unknown;
  try {
    input = JSON.parse(raw);
  } catch {
    throw Error(
      "JSON syntax error. Check quotes, commas and closing brackets.",
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
  function list(value: unknown, path: string, depth: number): ContentBlock[] {
    if (!Array.isArray(value))
      throw Error(`${path}: expected an array of blocks.`);
    if (depth > 5)
      throw Error(`${path}: sections may nest at most 5 levels deep.`);
    return value.map((item: unknown, i: number) =>
      block(item, `${path}[${i}]`, depth),
    );
  }
  function block(value: unknown, path: string, depth: number): ContentBlock {
    if (++count > 100) throw Error(`${path}: maximum 100 blocks per page.`);
    const node = object(value, path);
    const id = text(node.id, `${path}.id`);
    if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id))
      throw Error(
        `${path}.id: use 1–80 letters, digits, underscores or hyphens.`,
      );
    if (ids.has(id)) throw Error(`${path}.id: duplicate ID "${id}".`);
    ids.add(id);
    const bundle = node.bundle;
    switch (bundle) {
      case "header": {
        keys(node, ["id", "bundle", "header", "level"], path);
        if (node.level !== 2 && node.level !== 3)
          throw Error(`${path}.level: choose 2 or 3.`);
        return {
          id,
          bundle,
          header: text(node.header, `${path}.header`),
          level: node.level,
        };
      }
      case "text_block":
        keys(node, ["id", "bundle", "text_body"], path);
        return {
          id,
          bundle,
          text_body: text(node.text_body, `${path}.text_body`),
        };
      case "media": {
        keys(node, ["id", "bundle", "media", "media_caption"], path);
        const media = object(node.media, `${path}.media`);
        keys(media, ["bundle", "url", "alt"], `${path}.media`);
        if (media.bundle !== "demo_image")
          throw Error(`${path}.media.bundle: expected demo_image.`);
        const url = text(media.url, `${path}.media.url`);
        if (!imageOptions.includes(url))
          throw Error(
            `${path}.media.url: choose a bundled demo image (${imageOptions.join(" or ")}).`,
          );
        const alt = text(media.alt, `${path}.media.alt`);
        if (!alt.trim()) throw Error(`${path}.media.alt: describe the image.`);
        return {
          id,
          bundle,
          media: { bundle: "demo_image", url, alt },
          media_caption: text(node.media_caption, `${path}.media_caption`),
        };
      }
      case "demo_section":
        keys(node, ["id", "bundle", "header", "children"], path);
        return {
          id,
          bundle,
          header: text(node.header, `${path}.header`),
          children: list(node.children, `${path}.children`, depth + 1),
        };
      case "references_accordion": {
        keys(
          node,
          [
            "id",
            "bundle",
            "references_accordion_title",
            "references_container",
          ],
          path,
        );
        const container = object(
          node.references_container,
          `${path}.references_container`,
        );
        keys(container, ["references"], `${path}.references_container`);
        if (
          !Array.isArray(container.references) ||
          container.references.length > 30
        )
          throw Error(
            `${path}.references_container.references: expected at most 30 text entries.`,
          );
        return {
          id,
          bundle,
          references_accordion_title: text(
            node.references_accordion_title,
            `${path}.references_accordion_title`,
          ),
          references_container: {
            references: container.references.map((r: unknown, i: number) =>
              text(r, `${path}.references_container.references[${i}]`),
            ),
          },
        };
      }
      default:
        throw Error(`${path}.bundle: unsupported bundle "${String(bundle)}".`);
    }
  }
  const page = object(input, "page");
  keys(page, ["title", "primary_content_value"], "page");
  return {
    title: text(page.title, "page.title"),
    primary_content_value: list(
      page.primary_content_value,
      "page.primary_content_value",
      0,
    ),
  };
}
