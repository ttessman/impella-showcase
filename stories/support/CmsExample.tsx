import { useState } from "react";
import { DocumentContext } from "../../src/hooks/useDocument";
import { BundleRender } from "../../src/components/CMS/renderers/BundleRender";
import { ContentViewRender } from "../../src/components/CMS/renderers/ContentViewRender";
import { DocumentRender } from "../../src/components/CMS/renderers/DocumentRender";
import { FrameContentRender } from "../../src/components/CMS/renderers/FrameContentRender";
import { RichContentRender } from "../../src/components/CMS/renderers/RichContentRender";
import { indexDocument, parseDocument } from "../../src/utils/document";
import type { CmsNode } from "../../src/components/CMS/renderers/ContentViewRender";
import { document } from "./fixtures";

function replace(value: unknown, id: string, replacement: unknown): unknown {
  if (Array.isArray(value))
    return value.map((item) => replace(item, id, replacement));
  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;
    if (object.id === id) return replacement;
    return Object.fromEntries(
      Object.entries(object).map(([key, item]) => [
        key,
        replace(item, id, replacement),
      ]),
    );
  }
  return value;
}

/** Controls edit real JSON; validation gates the preview and preserves the last valid result. */
export function CmsExample({
  node,
  renderer = "BundleRender",
}: {
  node: CmsNode;
  renderer?: string;
}) {
  const [draft, setDraft] = useState(JSON.stringify(node, null, 2));
  const [applied, setApplied] = useState(node);
  const [error, setError] = useState("");
  let page = document;
  try {
    page = parseDocument(replace(document, node.id, applied));
  } catch {
    /* Apply reports invalid input. */
  }
  const index = indexDocument(page);
  const target = index.nodes.get(applied.id) ?? applied;
  function apply() {
    try {
      const next: unknown = JSON.parse(draft);
      // The identity remains stable so references in the host document can resolve.
      if (!next || typeof next !== "object" || (next as CmsNode).id !== node.id)
        throw Error("Keep the example ID unchanged.");
      parseDocument(replace(document, node.id, next));
      setApplied(next as CmsNode);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <>
      <DocumentContext.Provider value={index}>
        <div style={{ minHeight: 100, maxWidth: "100%" }}>
          {renderer === "DocumentRender" ? (
            <DocumentRender document={page} />
          ) : renderer === "ContentViewRender" ? (
            <ContentViewRender blocks={[target]} />
          ) : renderer === "FrameContentRender" ? (
            <FrameContentRender node={target} />
          ) : renderer === "RichContentRender" ? (
            <RichContentRender node={target} />
          ) : target.bundle === "list_item" ? (
            <ul>
              <BundleRender block={target} />
            </ul>
          ) : (
            <BundleRender block={target} />
          )}
        </div>
      </DocumentContext.Provider>
      <details
        style={{
          marginTop: "var(--space-6)",
          borderTop: "1px solid var(--line)",
          paddingTop: "var(--space-3)",
        }}
      >
        <summary>Edit example JSON</summary>
        <label style={{ display: "block", marginBlock: "var(--space-3)" }}>
          CMS node
          <textarea
            aria-label="CMS node JSON"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            spellCheck={false}
            style={{
              display: "block",
              width: "100%",
              minHeight: 240,
              background: "var(--paper)",
              color: "var(--text)",
              border: "1px solid var(--control-border)",
              fontFamily: "monospace",
            }}
          />
        </label>
        <button className="button button-secondary" onClick={apply}>
          Apply JSON
        </button>
        {error && <p role="alert">{error}</p>}
      </details>
    </>
  );
}
