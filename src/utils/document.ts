import { plainRichText } from "./markdown";
import type {
  CmsNode,
  PageDocument,
  NodeOf,
  BundleName,
} from "../components/CMS/renderers/ContentViewRender";
import type { SectionDefinition } from "../components/UI/SectionLabel/SectionLabel";
import type { DocumentIndex } from "../components/CMS/renderers/DocumentRender";
import { variants } from "./presentation";

export function children(node: CmsNode): CmsNode[] {
  if (node.bundle === "hero")
    return [
      ...node.metadata.content,
      ...node.metadata.actions,
      ...node.metadata.aside,
      ...node.metadata.footer,
    ];
  return Array.isArray(node.content) ? node.content : [];
}
export function walkContent(
  node: CmsNode,
  visit: (node: CmsNode, parent?: CmsNode) => void,
  parent?: CmsNode,
) {
  visit(node, parent);
  children(node).forEach((child) => walkContent(child, visit, node));
}
export function textContent(node: CmsNode): string {
  if (node.bundle === "hero")
    return [
      node.metadata.header.eyebrow,
      node.metadata.header.title,
      ...(node.metadata.header.tags ?? []),
      ...children(node).map(textContent),
    ]
      .filter(Boolean)
      .map((text) => plainRichText(text!))
      .join("\n");
  return typeof node.content === "string"
    ? (node.bundle === "code" ||
      (node.bundle === "text" && node.metadata.mark === "code")
        ? node.content
        : plainRichText(node.content)) +
        (node.bundle === "text" && node.metadata.break_after ? "\n" : "")
    : children(node).map(textContent).join("");
}
export function frameParts(node: CmsNode) {
  const items = children(node);
  return {
    header: items.find((item) => item.bundle === "header"),
    footer: items.find((item) => item.bundle === "footer"),
    content: items.filter(
      (item) => item.bundle !== "header" && item.bundle !== "footer",
    ),
  };
}
function ownedNodes(node: CmsNode): CmsNode[] {
  return children(node).flatMap((child) =>
    child.bundle === "section" ? [] : [child, ...ownedNodes(child)],
  );
}
export function sectionDefinition(
  node: NodeOf<"section">,
  number: number,
): SectionDefinition {
  const owned = ownedNodes(node);
  const heading = owned.find(
    (child) => child.bundle === "heading" && child.metadata.level === 2,
  );
  const intro = owned.find(
    (child) =>
      child.bundle === "text_block" &&
      child.metadata.variant === "section-intro",
  );
  return {
    id: node.id,
    number: String(number).padStart(2, "0"),
    label: node.metadata.label,
    title: heading ? textContent(heading) : node.metadata.label,
    intro: intro ? textContent(intro) : undefined,
  };
}
export function indexDocument(page: PageDocument) {
  const nodes = new Map<string, CmsNode>();
  const sections: SectionDefinition[] = [];
  walkContent(page, (node) => {
    nodes.set(node.id, node);
    if (node.bundle === "section" && node.metadata.navigation)
      sections.push(sectionDefinition(node, sections.length + 1));
  });
  return { page, nodes, sections };
}

export function buildReaderDocument(index: DocumentIndex) {
  const identity = index.page.metadata.identity;
  return {
    title: index.page.metadata.title,
    subtitle: `Case-study summary · ${identity.author}`,
    sections: [
      {
        heading: "My contribution",
        paragraphs: [identity.role, identity.team],
      },
      ...index.sections.map((section) => ({
        heading: `${section.number} / ${section.label}`,
        paragraphs: [section.title, ...(section.intro ? [section.intro] : [])],
      })),
      {
        heading: "Ownership and evidence",
        paragraphs: [identity.boundaries, identity.reconstruction],
      },
    ],
  };
}
/** Full authored narrative; private code illustrations and inactive outcomes are omitted. */
export function documentText(index: DocumentIndex) {
  const lines: string[] = [];
  function visit(node: Parameters<typeof textContent>[0]) {
    if (
      ["code", "source_reference", "checklist", "reading_header"].includes(
        node.bundle,
      )
    )
      return;
    if (node.bundle === "heading" || node.bundle === "text_block") {
      lines.push(textContent(node));
      return;
    }
    if (node.bundle === "hero") {
      const header = node.metadata.header;
      lines.push(
        ...[header.eyebrow, header.title, ...(header.tags ?? [])]
          .filter((value): value is string => !!value)
          .map(plainRichText),
      );
    }
    children(node).forEach(visit);
  }
  visit(index.page);
  return lines.join("\n\n");
}
export function publicLinks(index: DocumentIndex) {
  const links = new Set<string>();
  walkContent(index.page, (node) => {
    if (node.bundle === "button" && /^https?:/.test(node.metadata.href))
      links.add(node.metadata.href);
  });
  return [...links];
}

type Rule =
  | "string"
  | "boolean"
  | "number"
  | "strings"
  | "nodes"
  | readonly (string | number)[]
  | { [key: string]: Field };
type Field = Rule | { optional: Rule };
const optional = (rule: Rule): Field => ({ optional: rule });
const identity = Object.fromEntries(
  [
    "title",
    "description",
    "author",
    "role",
    "team",
    "boundaries",
    "reconstruction",
  ].map((key) => [key, "string"]),
) as Record<string, Field>;
const target = { label: "string", target_id: "string" } as const;
/** This allowlist is both runtime validation and the supported authoring vocabulary. */
const metadata: Record<BundleName, Record<string, Field>> = {
  page: {
    schema_version: [1],
    title: "string",
    identity,
    subject: optional({ name: "string", publisher: optional("string") }),
    navigation: {
      overview: target,
      primary_action: optional(target),
      sections_label: "string",
    },
    skip_label: "string",
    component_library: optional({
      enabled: "boolean",
      label: "string",
      href: ["./storybook/", "/storybook/"],
    }),
  },
  group: {
    variant: optional(Object.keys(variants.group)),
    element: optional(["div", "main", "article", "p", "figcaption"]),
  },
  grid: { variant: Object.keys(variants.grid) },
  section: {
    label: "string",
    navigation: optional("boolean"),
    variant: optional(["full-bleed", "preview", "paper"]),
  },
  header: {},
  footer: { variant: optional(["site"]) },
  reading_header: {},
  hero: {
    variant: ["split", "background"],
    aside_padding: optional(["default", "none"]),
    content_width: optional(["narrow", "default", "wide"]),
    background: optional({
      src: "string",
      position: optional(["center", "top", "bottom", "left", "right"]),
    }),
    header: {
      eyebrow: optional("string"),
      title: "string",
      tags: optional("strings"),
    },
    content: "nodes",
    actions: "nodes",
    aside: "nodes",
    footer: "nodes",
  },
  card: { variant: ["outlined", "tinted", "source-summary"] },
  heading: { level: [1, 2, 3, 4, 5, 6] },
  text: {
    mark: optional(["code", "bold", "emphasis"]),
    break_after: optional("boolean"),
  },
  text_block: {
    variant: optional(Object.keys(variants.text_block)),
    element: optional([
      "p",
      "span",
      "div",
      "strong",
      "b",
      "small",
      "figcaption",
    ]),
  },
  media: {
    src: "string",
    alt: "string",
    width: "number",
    height: "number",
    title: "string",
    variant: ["hero", "original", "linked", "evidence", "gallery", "inline"],
    body: optional("string"),
    caption_label: optional("string"),
    trigger_label: optional("string"),
    close_label: optional("string"),
    original_link_label: optional("string"),
    provenance: optional(["approved-original-documentation"]),
    dialog: optional({
      title: optional("string"),
      close_label: optional("string"),
      size: optional(["small", "default", "large"]),
    }),
  },
  figure: { variant: optional(Object.keys(variants.figure)) },
  list: {
    variant: optional(Object.keys(variants.list)),
    ordered: optional("boolean"),
  },
  list_item: {},
  button: {
    href: "string",
    variant: optional(["text", "primary", "secondary"]),
    size: optional(["small", "default", "large"]),
    new_tab: optional("boolean"),
    action: optional(["reader", "image"]),
    target_id: optional("string"),
  },
  accordion: {
    label: "string",
    variant: optional(["implementation"]),
    initially_expanded: optional("boolean"),
  },
  code: {
    language: "string",
    variant: optional(["inline"]),
    path: optional("string"),
    context: optional("string"),
  },
  source_reference: {
    title: "string",
    summary: "string",
    disclaimer: "string",
    initial_file: optional("string"),
  },
  content_studio: {},
  references_accordion: { label: "string" },
  checklist: {
    presentation: ["dialog"],
    ...(Object.fromEntries(
      [
        "title",
        "description",
        "dialog_heading",
        "trigger_label",
        "close_label",
        "reset_label",
        "intro_label",
        "result_label",
        "empty_result_label",
        "result_region_label",
        "caption",
        "requires_javascript_label",
        "empty_outcome_id",
        "fallback_outcome_id",
      ].map((key) => [key, "string"]),
    ) as Record<string, Field>),
  },
  checklist_group: { label: "string" },
  checklist_question: { label: "string" },
  checklist_option: {},
  checklist_rule: {
    operator: ["and", "or"],
    selected_ids: "strings",
    outcome_id: "string",
  },
  checklist_outcome: {},
};
const record = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);
function fail(path: string, message: string): never {
  throw new Error(`${path}: ${message}`);
}
function check(value: unknown, rule: Rule, path: string): void {
  if (typeof rule === "string") {
    if (rule === "nodes") {
      if (!Array.isArray(value)) fail(path, "expected ordered child nodes");
    } else if (rule === "strings") {
      if (
        !Array.isArray(value) ||
        !value.every((item) => typeof item === "string")
      )
        fail(path, "expected string array");
    } else if (
      typeof value !== rule ||
      (rule === "string" && (value as string).length > 20000) ||
      (rule === "number" && (!Number.isFinite(value) || (value as number) <= 0))
    )
      fail(path, `expected bounded ${rule}`);
  } else if (Array.isArray(rule)) {
    if (!rule.includes(value as never)) fail(path, "unsupported value");
  } else {
    if (!record(value)) fail(path, "expected object");
    const fields = rule as Record<string, Field>;
    for (const key of Object.keys(value))
      if (!Object.hasOwn(fields, key))
        fail(`${path}.${key}`, "unknown property");
    for (const [key, field] of Object.entries(fields)) {
      if (record(field) && "optional" in field) {
        if (value[key] !== undefined)
          check(value[key], field.optional as Rule, `${path}.${key}`);
      } else check(value[key], field as Rule, `${path}.${key}`);
    }
  }
}
export function safeHref(href: string) {
  if (/^#[A-Za-z][\w-]*$/.test(href) || href === "./case-study.txt")
    return true;
  if (/^\/assets\/[\w./-]+$/.test(href) && !href.includes("..")) return true;
  try {
    const url = new URL(href);
    return (
      ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}
const leaf = new Set(["text", "reading_header", "code", "checklist_option"]);
const rich = new Set(["heading", "text_block", "button"]);
const inline = new Set(["text"]);
const owner: Record<string, string[]> = {
  list_item: ["list"],
  checklist_group: ["checklist"],
  checklist_question: ["checklist_group"],
  checklist_option: ["checklist_question"],
  checklist_rule: ["checklist"],
  checklist_outcome: ["checklist"],
};
/** Shared metadata vocabulary; authoring profiles may impose tighter limits. */
export function validateBundleMetadata(
  bundle: BundleName,
  value: unknown,
  path: string,
) {
  check(value, metadata[bundle], path);
}
/** Validates external page data before it reaches React. */
export function parseDocument(input: unknown): PageDocument {
  if (new TextEncoder().encode(JSON.stringify(input)).length > 512 * 1024)
    fail("page", "document exceeds 512 KiB");
  let count = 0;
  const ids = new Set<string>();
  function node(
    value: unknown,
    path: string,
    depth: number,
    parent?: string,
  ): void {
    if (++count > 1000 || depth > 20)
      fail(path, "document exceeds node/depth limits");
    if (!record(value)) fail(path, "expected content node");
    if (Object.keys(value).sort().join(",") !== "bundle,content,id,metadata")
      fail(path, "node must contain exactly id, bundle, metadata, content");
    const { id, bundle, content } = value;
    if (
      typeof id !== "string" ||
      !/^[A-Za-z][\w-]{0,127}$/.test(id) ||
      ids.has(id)
    )
      fail(`${path}.id`, "invalid or duplicate ID");
    ids.add(id);
    if (typeof bundle !== "string" || !Object.hasOwn(metadata, bundle))
      fail(`${path}.bundle`, "unsupported bundle");
    if (bundle === "page" && parent)
      fail(path, "page is only allowed at document root");
    if (owner[bundle] && !owner[bundle].includes(parent ?? ""))
      fail(path, "invalid owning bundle");
    check(value.metadata, metadata[bundle as BundleName], `${path}.metadata`);
    if (typeof content === "string" && content.length > 20000)
      fail(path, "text exceeds limit");
    if (bundle === "checklist_rule") {
      if (content !== null) fail(path, "rule content must be null");
    } else if (leaf.has(bundle)) {
      if (typeof content !== "string") fail(path, "expected leaf text");
    } else if (typeof content === "string" && rich.has(bundle)) {
      if (content.length > 20000) fail(path, "text exceeds limit");
    } else {
      if (!Array.isArray(content)) fail(path, "expected ordered child nodes");
      content.forEach((child, i) => {
        if (
          record(child) &&
          rich.has(bundle) &&
          !inline.has(child.bundle as string)
        )
          fail(path, "rich text accepts inline text nodes only");
        node(child, `${path}.content[${i}]`, depth + 1, bundle);
      });
    }
    if (bundle === "hero") {
      if (!Array.isArray(content) || content.length)
        fail(
          path,
          "hero content belongs in metadata.content; outer content must be empty",
        );
      const m = value.metadata as Record<string, unknown>;
      if (m.variant === "background" && !m.background)
        fail(path, "background hero requires metadata.background");
      if (m.background) {
        const src = (m.background as { src: string }).src;
        if (
          !/^\/assets\/[\w./-]+$/.test(src) ||
          src.includes("..") ||
          src.startsWith("/assets/documentation/")
        )
          fail(
            path,
            "hero background must use a safe public bundled asset path",
          );
      }
      for (const area of ["content", "actions", "aside", "footer"]) {
        (m[area] as unknown[]).forEach((child, i) => {
          if (
            area === "actions" &&
            (!record(child) || child.bundle !== "button")
          )
            fail(`${path}.metadata.actions[${i}]`, "expected button bundle");
          node(child, `${path}.metadata.${area}[${i}]`, depth + 1, bundle);
        });
      }
    }
  }
  node(input, "page", 0);
  if (!record(input) || input.bundle !== "page")
    fail("page", "root bundle must be page");
  const page = input as PageDocument;
  if (
    page.content.filter(
      (item) => item.bundle === "group" && item.metadata.element === "main",
    ).length !== 1
  )
    fail("page", "requires one direct main group");
  if (
    page.content.filter((item) => item.bundle === "reading_header").length > 1
  )
    fail("page", "duplicate reading header");
  const index = indexDocument(page);
  walkContent(page, (current, parent) => {
    if (
      current.bundle === "group" &&
      current.metadata.element === "main" &&
      parent?.bundle !== "page"
    )
      fail(current.id, "main group belongs directly to page");
    const items = children(current);
    if (["page", "card", "section"].includes(current.bundle)) {
      for (const part of ["header", "footer"])
        if (items.filter((item) => item.bundle === part).length > 1)
          fail(current.id, `duplicate ${part}`);
    }
    if (current.bundle === "section" && current.metadata.navigation) {
      const headings: string[] = [];
      function find(n: typeof current | (typeof items)[number]) {
        children(n).forEach((child) => {
          if (child.bundle === "section") return;
          if (child.bundle === "heading" && child.metadata.level === 2)
            headings.push(child.id);
          find(child);
        });
      }
      find(current);
      if (headings.length !== 1)
        fail(
          current.id,
          "navigable section requires one owned level-2 heading",
        );
    }
    if (current.bundle === "media") {
      if (
        !/^\/assets\/[\w./-]+$/.test(current.metadata.src) ||
        current.metadata.src.includes("..")
      )
        fail(current.id, "media must use a safe bundled asset path");
      if (!current.metadata.alt.trim())
        fail(current.id, "media requires alternative text");
      if (
        current.metadata.src.startsWith("/assets/documentation/") &&
        current.metadata.provenance !== "approved-original-documentation"
      )
        fail(current.id, "documentation asset requires publication permission");
    }
    if (current.bundle === "button") {
      if (!safeHref(current.metadata.href)) fail(current.id, "unsafe link");
      if (
        current.metadata.href.startsWith("#") &&
        !index.nodes.has(current.metadata.href.slice(1))
      )
        fail(current.id, "unresolved anchor");
    }
    if (
      current.bundle === "list" &&
      items.some((item) => item.bundle !== "list_item")
    )
      fail(current.id, "list accepts list_item nodes");
    if (current.bundle === "source_reference") {
      if (
        !items.length ||
        items.some(
          (item) =>
            item.bundle !== "code" ||
            !item.metadata.path ||
            !item.metadata.context,
        )
      )
        fail(current.id, "source reference requires contextual code files");
      if (
        current.metadata.initial_file &&
        !items.some(
          (item) =>
            item.bundle === "code" &&
            item.metadata.path === current.metadata.initial_file,
        )
      )
        fail(current.id, "initial source file not found");
    }
    if (
      current.bundle === "checklist_outcome" &&
      (items[0]?.bundle !== "heading" || items[1]?.bundle !== "text_block")
    )
      fail(current.id, "outcome requires heading and body");
    if (
      current.bundle === "checklist_group" &&
      (!items.length ||
        items.some((item) => item.bundle !== "checklist_question"))
    )
      fail(current.id, "group requires questions");
    if (
      current.bundle === "checklist_question" &&
      (!items.length ||
        items.some((item) => item.bundle !== "checklist_option"))
    )
      fail(current.id, "question requires options");
    if (current.bundle === "checklist") {
      if (
        !items.some((item) => item.bundle === "heading") ||
        !items.some((item) => item.bundle === "text_block") ||
        !items.some((item) => item.bundle === "checklist_group")
      )
        fail(current.id, "checklist requires introduction and questions");
      const local = new Map<string, (typeof items)[number]>();
      walkContent(current, (n) => local.set(n.id, n));
      for (const id of [
        current.metadata.empty_outcome_id,
        current.metadata.fallback_outcome_id,
      ])
        if (local.get(id)?.bundle !== "checklist_outcome")
          fail(current.id, "invalid checklist outcome");
      items
        .filter((item) => item.bundle === "checklist_rule")
        .forEach((rule) => {
          if (
            local.get(rule.metadata.outcome_id)?.bundle !==
              "checklist_outcome" ||
            !rule.metadata.selected_ids.length ||
            rule.metadata.selected_ids.some(
              (id) => local.get(id)?.bundle !== "checklist_option",
            )
          )
            fail(rule.id, "invalid checklist rule references");
        });
      if (
        items.some(
          (item) =>
            ![
              "heading",
              "text_block",
              "checklist_group",
              "checklist_rule",
              "checklist_outcome",
            ].includes(item.bundle),
        )
      )
        fail(current.id, "unsupported checklist content");
    }
  });
  walkContent(page, (current) => {
    if (current.bundle !== "button" || current.metadata.action !== "image")
      return;
    const media = index.nodes.get(current.metadata.target_id ?? "");
    if (
      media?.bundle !== "media" ||
      !media.metadata.dialog ||
      media.metadata.src !== current.metadata.href
    )
      fail(
        current.id,
        "image action requires a matching media target with dialog settings",
      );
  });
  for (const action of [
    page.metadata.navigation.overview,
    page.metadata.navigation.primary_action,
  ])
    if (action && !index.nodes.has(action.target_id))
      fail("page.metadata.navigation", "unresolved navigation target");
  return page;
}
