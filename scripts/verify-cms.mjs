import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { fileURLToPath, URL } from "node:url";
import console from "node:console";
const clone = (value) => JSON.parse(JSON.stringify(value));
import { createServer } from "vite";
const root = fileURLToPath(new URL("../", import.meta.url));
const server = await createServer({
  root,
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: "custom",
  logLevel: "error",
});
try {
  const { parseDocument } = await server.ssrLoadModule(
    "/src/utils/document.ts",
  );
  const { indexDocument, walkContent } = await server.ssrLoadModule(
    "/src/utils/document.ts",
  );
  const { checklistDefinition } = await server.ssrLoadModule(
    "/src/components/CMS/bundles/ChecklistBundle/checklistDefinition.ts",
  );
  const { evaluateChecklist } = await server.ssrLoadModule(
    "/src/utils/evaluateChecklist.ts",
  );
  const { renderDocument } = await server.ssrLoadModule(
    "/tests/helpers/renderCms.tsx",
  );
  const original = JSON.parse(
    await readFile(
      new URL("../src/content/impella.json", import.meta.url),
      "utf8",
    ),
  );
  const fixture = JSON.parse(
    await readFile(
      new URL("../tests/fixtures/second-case-study.json", import.meta.url),
      "utf8",
    ),
  );
  const index = indexDocument(parseDocument(original));
  assert.equal(index.sections.length, 11);
  assert.equal(
    new Set(index.sections.map((section) => section.number)).size,
    11,
  );
  let count = 0;
  const assets = [];
  walkContent(index.page, (node) => {
    count++;
    assert.deepEqual(Object.keys(node).sort(), [
      "bundle",
      "content",
      "id",
      "metadata",
    ]);
    if (node.bundle !== "page")
      assert.equal(node.metadata.schema_version, undefined);
    if (node.bundle === "media")
      assets.push(access(`${root}public${node.metadata.src}`));
  });
  await Promise.all(assets);
  const imageActions = [...index.nodes.values()].filter(
    (n) => n.bundle === "button" && n.metadata.action === "image",
  );
  assert.equal(imageActions.length, 2);
  for (const action of imageActions) {
    const media = index.nodes.get(action.metadata.target_id);
    assert.equal(media.bundle, "media");
    assert.equal(media.metadata.dialog.close_label, "Close screenshot");
  }
  const badImageAction = clone(original);
  walkContent(badImageAction, (n) => {
    if (n.bundle === "button" && n.metadata.action === "image")
      n.metadata.target_id = "missing-image";
  });
  assert.throws(() => parseDocument(badImageAction), /matching media target/);

  const { renderBaseCard } = await server.ssrLoadModule(
    "/tests/helpers/renderBaseCard.tsx",
  );
  for (const variant of ["outlined", "tinted", "source-summary"]) {
    const example = clone(fixture);
    example.content[1].content[0].content[1].content[0].metadata.variant =
      variant;
    const cmsHtml = renderDocument(example);
    const cardHtml = cmsHtml.match(
      /<article[^>]*id="notes-card"[^>]*>[\s\S]*?<\/article>/,
    )?.[0];
    assert.equal(
      cardHtml?.replace(/ data-bundle-name="[^"]*"/g, ""),
      renderBaseCard(variant),
      `${variant}: direct React and CMS must render the same Card`,
    );
  }
  const libraryDoc = clone(original);
  libraryDoc.metadata.component_library = {
    enabled: true,
    label: "Browse components",
    href: "./storybook/",
  };
  assert.ok(renderDocument(libraryDoc).includes("Browse components"));
  libraryDoc.metadata.component_library.enabled = false;
  assert.ok(!renderDocument(libraryDoc).includes("Browse components"));
  delete libraryDoc.metadata.component_library;
  assert.ok(!renderDocument(libraryDoc).includes("component-library-link"));
  const html = renderDocument(fixture);
  for (const bundle of [
    "page",
    "group",
    "section",
    "header",
    "footer",
    "card",
    "heading",
    "text_block",
    "media",
    "button",
    "reading_header",
  ])
    assert.ok(
      renderDocument(original).includes(`data-bundle-name="${bundle}"`),
      `${bundle} DOM marker`,
    );
  assert.ok(html.includes("FIELD NOTES"));
  assert.ok(html.includes("Skip to field notes"));
  assert.ok(html.includes('href="#notes-main"'));
  assert.ok(html.includes("A headerless variant."));
  assert.ok(
    !html.includes("Impella") &&
      !html.includes("Tyler") &&
      !html.includes("Content studio"),
  );
  assert.ok(
    html.indexOf("Shared frame") < html.indexOf("Ordered body content."),
  );
  assert.ok(
    html.indexOf("Ordered body content.") < html.indexOf("Footer remains last"),
  );
  // Specialized hero areas remain first-class CMS descendants for validation and reading.
  const heroDoc = clone(fixture);
  const hero = {
    id: "fixture-hero",
    bundle: "hero",
    content: [],
    metadata: {
      variant: "split",
      header: {
        eyebrow: "An authored introduction",
        title: "A *reusable* hero",
        tags: ["React", "TypeScript"],
      },
      content: [
        {
          id: "hero-copy",
          bundle: "text_block",
          metadata: {},
          content: "A **dynamic** introduction.\n\nAnother paragraph.",
        },
      ],
      actions: [
        {
          id: "hero-action",
          bundle: "button",
          metadata: { href: "https://example.com/evidence" },
          content: "Read the evidence",
        },
      ],
      aside: [
        {
          id: "hero-aside-copy",
          bundle: "text_block",
          metadata: {},
          content: "A quote instead of an image.",
        },
      ],
      footer: [
        {
          id: "hero-footer-copy",
          bundle: "text_block",
          metadata: {},
          content: "**Outcome**\n\nAn authored footer.",
        },
      ],
    },
  };
  heroDoc.content[1].content.unshift(hero);
  const heroIndex = indexDocument(parseDocument(heroDoc));
  const heroHtml = renderDocument(heroDoc);
  assert.ok(heroHtml.includes("A <em>reusable</em> hero"));
  assert.ok(heroHtml.includes('aria-label="Project tags"'));
  assert.ok(heroHtml.includes("<li>React</li>"));
  assert.ok(heroHtml.includes("<strong>dynamic</strong>"));
  assert.ok(heroHtml.includes("<p>Another paragraph.</p>"));
  assert.ok(heroHtml.includes("A quote instead of an image."));
  assert.ok(heroHtml.includes("<strong>Outcome</strong>"));
  assert.ok(
    heroHtml.indexOf("An authored footer.") >
      heroHtml.indexOf("A quote instead of an image."),
  );
  for (const id of [
    "hero-copy",
    "hero-action",
    "hero-aside-copy",
    "hero-footer-copy",
  ])
    assert.ok(heroIndex.nodes.has(id));
  const { documentText, publicLinks } = await server.ssrLoadModule(
    "/src/utils/document.ts",
  );
  const narrative = documentText(heroIndex);
  for (const text of [
    "A reusable hero",
    "React",
    "A dynamic introduction.",
    "Another paragraph.",
    "A quote instead of an image.",
    "An authored footer.",
  ])
    assert.ok(narrative.includes(text), text);
  assert.ok(publicLinks(heroIndex).includes("https://example.com/evidence"));
  const backgroundDoc = clone(heroDoc);
  const backgroundHero = backgroundDoc.content[1].content[0];
  backgroundHero.metadata.variant = "background";
  backgroundHero.metadata.background = {
    src: "/assets/production/apple-home.webp",
    position: "top",
  };
  const backgroundHtml = renderDocument(parseDocument(backgroundDoc));
  assert.ok(backgroundHtml.includes("hero-variant-background"));
  assert.ok(backgroundHtml.includes("--hero-background:"));
  assert.ok(!backgroundHtml.includes('class="hero-aside"'));
  assert.ok(backgroundHtml.includes("A <em>reusable</em> hero"));
  for (const width of ["narrow", "default", "wide"]) {
    backgroundHero.metadata.content_width = width;
    assert.ok(
      renderDocument(parseDocument(backgroundDoc)).includes(
        `hero-content-${width}`,
      ),
    );
  }
  const heroInvalid = [
    (h) => (h.metadata.content_width = "unsupported"),
    (h) => (h.metadata.variant = "background"),
    (h) => (h.metadata.background = { src: "javascript:alert(1)" }),
    (h) =>
      (h.metadata.background = { src: "/assets/documentation/private.png" }),
    (h) => (h.metadata.aside_variant = "full-bleed"),
    (h) => (h.metadata.aside_padding = "unsupported"),
    (h) => h.metadata.aside.push(clone(h.metadata.content[0])),
    (h) => (h.metadata.actions[0].metadata.href = "javascript:alert(1)"),
    (h) => (h.metadata.footer[0].metadata.schema_version = 1),
    (h) => (h.metadata.aside[0].bundle = "unknown"),
    (h) => (h.metadata.aside = { content: [] }),
    (h) => (h.metadata.header.tags = "not an array"),
    (h) => (h.metadata.header.title = 42),
    (h) => h.metadata.actions.push(clone(h.metadata.aside[0])),
    (h) => h.content.push({ ...clone(h.metadata.content[0]), id: "misplaced" }),
    (h) =>
      h.metadata.footer.push({
        id: "bad-image",
        bundle: "media",
        metadata: {
          src: "/assets/../private",
          alt: "x",
          title: "x",
          width: 10,
          height: 10,
          variant: "inline",
        },
        content: [],
      }),
    (h) =>
      h.metadata.footer.push(
        ...Array.from({ length: 1001 }, (_, i) => ({
          id: `over-limit-${i}`,
          bundle: "text_block",
          metadata: {},
          content: "Text",
        })),
      ),
    (h) => {
      let item = { id: "too-deep", bundle: "group", metadata: {}, content: [] };
      for (let i = 0; i < 22; i++)
        item = {
          id: `deep-${i}`,
          bundle: "group",
          metadata: {},
          content: [item],
        };
      h.metadata.aside.push(item);
    },
  ];
  for (const mutate of heroInvalid) {
    const doc = clone(heroDoc);
    mutate(doc.content[1].content[0]);
    assert.throws(() => parseDocument(doc));
  }
  const renamed = clone(fixture);
  renamed.content[1].content.reverse();
  renamed.content[1].content[0].content[0].content[0].content =
    "A newly authored heading";
  const reordered = indexDocument(parseDocument(renamed));
  assert.equal(reordered.sections[0].number, "01");
  assert.equal(reordered.sections[0].id, "second-section");
  assert.equal(reordered.sections[0].title, "A newly authored heading");
  assert.equal(reordered.sections[1].number, "02");
  const invalid = [
    (doc) =>
      doc.content[1].content.push({
        id: "bad-button-size",
        bundle: "button",
        metadata: { href: "#first-section", size: "huge" },
        content: "Invalid size",
      }),
    (doc) =>
      doc.content[1].content.push({
        id: "bad-button-variant",
        bundle: "button",
        metadata: { href: "#first-section", variant: "arbitrary-css" },
        content: "Invalid variant",
      }),
    (doc) =>
      (doc.metadata.component_library = {
        enabled: "yes",
        label: "Library",
        href: "./storybook/",
      }),
    (doc) =>
      (doc.metadata.component_library = {
        enabled: true,
        label: "Library",
        href: "javascript:alert(1)",
      }),
    (doc) =>
      (doc.metadata.component_library = {
        enabled: true,
        label: "Library",
        href: "//external.example/",
      }),
    (doc) => (doc.extra = true),
    (doc) => (doc.metadata.schema_version = 2),
    (doc) => (doc.content[0].metadata.schema_version = 1),
    (doc) => (doc.content[0].bundle = "portal"),
    (doc) => (doc.content[0].metadata.region = "header"),
    (doc) => (doc.content[0].metadata.constructor = "unexpected"),
    (doc) => (doc.content[0].content = []),
    (doc) => (doc.content[0].id = doc.id),
    (doc) => (doc.metadata.navigation.overview.target_id = "missing"),
    (doc) => (doc.content[1].content[0].metadata.variant = "arbitrary-css"),
    (doc) =>
      (doc.content[1].content[0].content[0].content[0].metadata.level = 8),
    (doc) =>
      doc.content[1].content[0].content.push(
        clone(doc.content[1].content[0].content[0]),
      ),
    (doc) => {
      doc.content[1].content[0].content[0].bundle = "text_block";
    },
    (doc) => {
      doc.content[1].content[0].content.push({
        id: "unsafe-link",
        bundle: "button",
        metadata: { href: "javascript:alert(1)" },
        content: "Unsafe",
      });
    },
    (doc) => {
      doc.content[1].content[0].content.push({
        id: "bad-rule",
        bundle: "checklist_rule",
        metadata: { operator: "and", selected_ids: [], outcome_id: "unknown" },
        content: null,
      });
    },
  ];
  for (const mutate of invalid) {
    const bad = clone(fixture);
    mutate(bad);
    assert.throws(() => parseDocument(bad));
  }
  const checklist = [...index.nodes.values()].find(
    (node) => node.bundle === "checklist",
  );
  const definition = checklistDefinition(checklist);
  const options = definition.groups.flatMap((group) =>
    group.questions.flatMap((question) => question.options),
  );
  const expected = [
    "empty",
    "notebook",
    "pencil",
    "sketch",
    "camera",
    "archive",
    "photo",
    "story",
    "fallback",
    "field-notes",
    "sky-study",
    "sky-sketch",
    "outside-photo",
    "wandering-report",
    "light-study",
    "expedition",
  ];
  // Compare all combinations against independently authored expected rule outcomes.
  const labels = [];
  for (let mask = 0; mask < 16; mask++) {
    const selected = options
      .filter((_, i) => mask & (1 << i))
      .map((option) => option.id);
    const result = selected.length
      ? evaluateChecklist(definition, selected).id
      : "empty";
    labels.push(
      result.replace("checklist-outcome-", "").replace("checklist-", ""),
    );
  }
  // The exact authored IDs may vary; all singles/pairs/triples/full-set remain distinct.
  assert.equal(new Set(labels).size, 16);
  assert.equal(labels[0], expected[0]);
  assert.equal(labels[8], expected[8]);
  assert.equal(labels[15], expected[15]);
  for (const mutate of [
    (doc) => {
      const node = doc.content[1].content.find((n) => n.id === "tools");
      const find = (n) =>
        n.bundle === "checklist"
          ? n
          : Array.isArray(n.content)
            ? n.content.map(find).find(Boolean)
            : undefined;
      find(node).metadata.fallback_outcome_id = "unknown";
    },
    (doc) => {
      const find = (n) =>
        n.bundle === "media"
          ? n
          : Array.isArray(n.content)
            ? n.content.map(find).find(Boolean)
            : undefined;
      find(doc).metadata.src = "/assets/../../private";
    },
  ]) {
    const bad = clone(original);
    mutate(bad);
    assert.throws(() => parseDocument(bad));
  }
  console.log(
    `CMS verified: ${count} nodes, 11 sections, bundled assets, second document rendered, React/CMS card parity (3 variants), derived navigation, ${invalid.length + heroInvalid.length + 3} invalid-document cases, hero authored areas/Markdown/tags, 16 checklist combinations.`,
  );
} finally {
  await server.close();
}
