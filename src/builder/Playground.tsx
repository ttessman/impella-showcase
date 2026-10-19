import { useEffect, useRef, useState } from "react";
import { bundles, defaultPage, makeBlock, parsePage } from "./model";
import type { Bundle, ContentPage } from "./model";
import {
  blockLabel,
  findBlock,
  moveBlock,
  relocateBlock,
  removeBlock,
  sections,
  updateBlock,
} from "./tree";
import { useBlockDrag } from "./useBlockDrag";
import { BlockList } from "./BlockList";
import { BlockFields } from "./BlockFields";
import { WorkspaceIcon } from "../components/WorkspaceIcon";
import { initialWorkspaceLayout } from "./workspaceLayout";
import { PanelWorkspace } from "./PanelWorkspace";
import { MobilePreview } from "./MobilePreview";
export default function Playground() {
  const [mobile, setMobile] = useState(
    () => window.matchMedia("(max-width: 650px)").matches,
  );
  const [composeOpen, setComposeOpen] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 650px)");
    const update = () => {
      setMobile(media.matches);
      setComposeOpen(false);
    };
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const [workspace, setWorkspace] = useState(initialWorkspaceLayout);
  const [page, setPage] = useState<ContentPage>(defaultPage);
  const [selected, setSelected] = useState<string | null>("intro");
  const [destination, setDestination] = useState("root");
  const [draft, setDraft] = useState<string | null>(null);
  const [message, setMessage] = useState(
    "Working example loaded. Select a block to edit.",
  );
  const [error, setError] = useState("");
  const palette = useRef<HTMLButtonElement>(null);
  const dirty = draft !== null;
  const json = JSON.stringify(page, null, 2);
  const current = selected
    ? findBlock(page.primary_content_value, selected)
    : undefined;
  function commit(next: ContentPage, announcement?: string): boolean {
    try {
      const checked = parsePage(JSON.stringify(next));
      setPage(checked);
      setError("");
      if (announcement) setMessage(announcement);
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    }
  }
  const drag = useBlockDrag({
    disabled: dirty,
    announce: setMessage,
    drop: (id, target) => {
      const blocks = relocateBlock(page.primary_content_value, id, target);
      if (blocks === page.primary_content_value) {
        setMessage(
          "Move cancelled. A section cannot move inside itself or its descendants.",
        );
        return;
      }
      if (
        commit(
          { ...page, primary_content_value: blocks },
          "Block moved. JSON and preview updated.",
        )
      )
        setSelected(id);
    },
  });
  function revealProperties(id: string) {
    requestAnimationFrame(() =>
      document
        .getElementById(`properties-${id}`)
        ?.scrollIntoView({ block: "nearest" }),
    );
  }
  function add(bundle: Bundle) {
    const block = makeBlock(bundle);
    const blocks =
      destination === "root"
        ? [...page.primary_content_value, block]
        : updateBlock(page.primary_content_value, destination, (b) =>
            b.bundle === "demo_section"
              ? { ...b, children: [...b.children, block] }
              : b,
          );
    if (
      commit(
        { ...page, primary_content_value: blocks },
        `${bundles.find((b) => b.value === bundle)!.label} added. Edit its properties below.`,
      )
    ) {
      setSelected(block.id);
      revealProperties(block.id);
    }
  }
  function validate(apply: boolean) {
    try {
      const next = parsePage(draft ?? json);
      setError("");
      if (apply) {
        drag.cancel();
        setPage(next);
        setDraft(null);
        setSelected(next.primary_content_value[0]?.id ?? null);
        setDestination("root");
        setMessage("JSON applied. Editor and preview updated.");
      } else
        setMessage(
          "JSON is valid. Apply changes to update the editor and preview.",
        );
    } catch (e) {
      setError((e as Error).message);
      setMessage("JSON was not applied. Your last valid page is preserved.");
    }
  }
  return (
    <div className="playground">
      <div className="playground-bar">
        <span className="playground-title">
          <span className="live-dot" /> Content studio
        </span>
        <div className="playground-actions">
          {mobile && (
            <button
              type="button"
              aria-label="Open Compose"
              title="Open Compose"
              aria-haspopup="dialog"
              aria-expanded={composeOpen}
              aria-controls="mobile-compose"
              onClick={() => {
                drag.cancel();
                setComposeOpen(true);
              }}
            >
              <WorkspaceIcon name="compose" />
              <span className="action-label">Compose</span>
            </button>
          )}
          <button
            type="button"
            aria-label="Reset layout"
            title="Reset layout"
            onClick={() => {
              drag.cancel();
              setWorkspace(initialWorkspaceLayout);
            }}
          >
            <WorkspaceIcon name="reset-layout" />
            <span className="action-label">Reset layout</span>
          </button>
          <button
            type="button"
            aria-label="Reset example"
            title="Reset example"
            onClick={() => {
              drag.cancel();
              setPage(defaultPage());
              setDraft(null);
              setSelected("intro");
              setDestination("root");
              setError("");
              setMessage("Original example restored.");
            }}
          >
            <WorkspaceIcon name="reset-example" />
            <span className="action-label">Reset example</span>
          </button>
        </div>
        <p className="demo-note">
          Fictional creative journal · Independently written web demo · Not
          original Impella code or a clinical application
        </p>
      </div>
      <PanelWorkspace
        mobile={mobile}
        composeOpen={composeOpen}
        onCloseCompose={() => {
          drag.cancel();
          setComposeOpen(false);
        }}
        value={workspace}
        onChange={(patch) => {
          drag.cancel();
          setWorkspace((current) => ({ ...current, ...patch }));
        }}
        composeFeedback={
          <>
            {error && (
              <p className="validation-error" role="alert">
                {error}
              </p>
            )}
            <p className="builder-status" role="status">
              {message}
            </p>
          </>
        }
        compose={
          <div className="author-pane">
            {dirty && (
              <p className="draft-warning">
                JSON draft pending. Apply or discard it to resume visual
                editing.
              </p>
            )}
            <fieldset disabled={dirty}>
              <legend className="sr-only">Visual authoring controls</legend>
              <label>
                Page title
                <input
                  maxLength={5000}
                  value={page.title}
                  onChange={(e) => commit({ ...page, title: e.target.value })}
                />
              </label>
              <label>
                Add blocks to
                <select
                  aria-label="Add blocks to"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                >
                  <option value="root">Page root</option>
                  {sections(page.primary_content_value)
                    .filter((s) => s.depth < 5)
                    .map(({ block, depth }) => (
                      <option key={block.id} value={block.id}>
                        {"— ".repeat(depth + 1)}
                        {block.header || "Untitled section"} (
                        {block.id.slice(0, 8)})
                      </option>
                    ))}
                </select>
              </label>
              <div className="palette">
                {bundles.map((b, i) => (
                  <button
                    ref={i === 0 ? palette : undefined}
                    type="button"
                    key={b.value}
                    onClick={() => add(b.value)}
                  >
                    + {b.label}
                  </button>
                ))}
              </div>
              {page.primary_content_value.length === 0 && (
                <p>No blocks yet. Add one above.</p>
              )}
              <p id="drag-help" className="small drag-help">
                Drag a grip above or below a block. The line marks where it will
                land. Drag into a section’s block list to nest it. With a grip
                focused, press Space, use arrow keys to choose a position, then
                Enter to drop. Escape cancels.
              </p>
              <BlockList
                drag={drag}
                blocks={page.primary_content_value}
                selected={selected}
                renderProperties={(block) => (
                  <section
                    className="property-panel"
                    id={`properties-${block.id}`}
                    aria-labelledby={`properties-heading-${block.id}`}
                  >
                    <h4 id={`properties-heading-${block.id}`}>
                      Block properties
                    </h4>
                    <p className="small">Editing: {blockLabel(block)}</p>
                    <BlockFields
                      key={block.id}
                      block={block}
                      onChange={(updated) =>
                        commit({
                          ...page,
                          primary_content_value: updateBlock(
                            page.primary_content_value,
                            updated.id,
                            () => updated,
                          ),
                        })
                      }
                    />
                  </section>
                )}
                select={(id) => {
                  setSelected(id);
                  revealProperties(id);
                  const b = findBlock(page.primary_content_value, id);
                  if (b?.bundle === "demo_section") setDestination(id);
                }}
                move={(id, delta) =>
                  commit(
                    {
                      ...page,
                      primary_content_value: moveBlock(
                        page.primary_content_value,
                        id,
                        delta,
                      ),
                    },
                    "Block order updated.",
                  )
                }
                remove={(id) => {
                  const blocks = removeBlock(page.primary_content_value, id);
                  if (
                    commit(
                      { ...page, primary_content_value: blocks },
                      "Block removed.",
                    )
                  ) {
                    if (selected && !findBlock(blocks, selected))
                      setSelected(null);
                    if (
                      destination !== "root" &&
                      !findBlock(blocks, destination)
                    )
                      setDestination("root");
                    palette.current?.focus();
                  }
                }}
              />
              {!current && (
                <p className="small">Select a block to edit its properties.</p>
              )}
            </fieldset>
          </div>
        }
        inspect={
          <div className="json-pane">
            <h3>
              <span>02</span> Inspect the contract
            </h3>
            <p className="small" id="json-help">
              Bundle names follow the original contract.{" "}
              <code>demo_section</code>, image assets and heading level are
              educational extensions. Edit, validate, then apply.
            </p>
            <label className="sr-only" htmlFor="json-editor">
              Editable page JSON
            </label>
            <textarea
              id="json-editor"
              className="json-editor"
              value={draft ?? json}
              onChange={(e) => {
                drag.cancel();
                setDraft(e.target.value);
                setError("");
                setMessage(
                  "JSON draft pending. Preview shows the last applied page.",
                );
              }}
              spellCheck={false}
              aria-describedby="json-help"
              aria-invalid={error ? true : undefined}
            />
            <div className="json-actions">
              <button type="button" onClick={() => validate(false)}>
                Validate JSON
              </button>
              <button
                type="button"
                className="primary"
                onClick={() => validate(true)}
              >
                Apply JSON
              </button>
              {dirty && (
                <button
                  type="button"
                  onClick={() => {
                    setDraft(null);
                    setError("");
                    setMessage("Draft discarded. Last applied page restored.");
                  }}
                >
                  Discard draft
                </button>
              )}
            </div>
          </div>
        }
        preview={
          <MobilePreview page={page} compact={workspace.layout === "stacked"} />
        }
      />
      {error && (
        <p className="validation-error" role="alert">
          {error}
        </p>
      )}
      <p className="builder-status" role="status">
        {message}
      </p>
    </div>
  );
}
