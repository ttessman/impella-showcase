import type { PageDocument, BundleName } from "../../../types/cms";
import { children, indexDocument, walkContent } from "./document";
import { variants } from "./variants";

type Rule =
  | "string"
  | "boolean"
  | "number"
  | "strings"
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
  hero: { variant: ["editorial"] },
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
  },
  figure: { variant: optional(Object.keys(variants.figure)) },
  list: {
    variant: optional(Object.keys(variants.list)),
    ordered: optional("boolean"),
  },
  list_item: {},
  action: {
    href: "string",
    variant: optional(["text", "primary", "reader"]),
    new_tab: optional("boolean"),
    action: optional(["reader"]),
  },
  disclosure: {
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
    if (rule === "strings") {
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
const rich = new Set(["heading", "text_block", "action"]);
const inline = new Set(["text"]);
const owner: Record<string, string[]> = {
  list_item: ["list"],
  checklist_group: ["checklist"],
  checklist_question: ["checklist_group"],
  checklist_option: ["checklist_question"],
  checklist_rule: ["checklist"],
  checklist_outcome: ["checklist"],
};
/** Validates external data before it reaches React. Studio drafts retain their separate stricter validator. */
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
    if (["page", "card", "hero", "section"].includes(current.bundle)) {
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
    if (current.bundle === "action") {
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
  for (const action of [
    page.metadata.navigation.overview,
    page.metadata.navigation.primary_action,
  ])
    if (action && !index.nodes.has(action.target_id))
      fail("page.metadata.navigation", "unresolved navigation target");
  return page;
}
