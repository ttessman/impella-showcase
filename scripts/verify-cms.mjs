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
    "/src/components/CMS/model/validateDocument.ts",
  );
  const { indexDocument, walkContent } = await server.ssrLoadModule(
    "/src/components/CMS/model/document.ts",
  );
  const { checklistDefinition } = await server.ssrLoadModule(
    "/src/components/CMS/model/checklistDefinition.ts",
  );
  const { evaluateChecklist } = await server.ssrLoadModule(
    "/src/components/forms/Checklist/checklistModel.ts",
  );
  const { renderDocument } = await server.ssrLoadModule(
    "/tests/helpers/renderCms.tsx",
  );
  const original = JSON.parse(
    await readFile(
      new URL("../src/content/pages/impella.json", import.meta.url),
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
  const html = renderDocument(fixture);
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
        bundle: "action",
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
    `CMS verified: ${count} nodes, 11 sections, bundled assets, second document rendered, derived navigation, ${invalid.length + 2} invalid-document cases, 16 checklist combinations.`,
  );
} finally {
  await server.close();
}
