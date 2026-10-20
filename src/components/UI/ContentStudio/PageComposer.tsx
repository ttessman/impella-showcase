import { Select } from "../Select/Select";
import { Button } from "../Button/Button";
import { Icon } from "../Icon/Icon";
import type { StudioBundleName } from "../../../utils/studio";
export const bundles: { value: StudioBundleName; label: string }[] = [
  { value: "heading", label: "Heading" },
  { value: "text_block", label: "Paragraph" },
  { value: "media", label: "Image" },
  { value: "section", label: "Section" },
  { value: "references_accordion", label: "References" },
];

import { blockLabel } from "../../../utils/studio";
import { BlockList } from "./BlockList";
import { BundleFields } from "./BundleFields";
import type { ContentEditor } from "../../../hooks/useContentEditor";

export function PageComposer({ editor }: { editor: ContentEditor }) {
  const {
    page,
    dirty,
    destination,
    destinations,
    selected,
    current,
    palette,
    drag,
    actions,
  } = editor;
  return (
    <div className="author-pane">
      <fieldset disabled={dirty}>
        <legend className="sr-only">Visual authoring controls</legend>
        <label>
          Page title
          <input
            maxLength={5000}
            value={page.metadata.title}
            onChange={(e) => actions.updateTitle(e.target.value)}
          />
        </label>
        <label>
          Add blocks to
          <Select
            aria-label="Add blocks to"
            value={destination}
            onChange={(e) => actions.setDestination(e.target.value)}
          >
            <option value="root">Page root</option>
            {destinations.map(({ block, depth }) => (
              <option key={block.id} value={block.id}>
                {"— ".repeat(depth + 1)}
                {block.metadata.label || "Untitled section"} (
                {block.id.slice(0, 8)})
              </option>
            ))}
          </Select>
        </label>
        <div className="palette">
          {bundles.map((b, i) => (
            <Button
              variant="secondary"
              size="small"
              aria-label={`Add ${b.label}`}
              ref={i === 0 ? palette : undefined}
              type="button"
              key={b.value}
              onClick={() => actions.add(b.value)}
            >
              <Icon type="add" size={16} /> {b.label}
            </Button>
          ))}
        </div>
        {page.content.length === 0 && <p>No blocks yet. Add one above.</p>}
        <p id="drag-help" className="small drag-help">
          Drag a grip above or below a block. The line marks where it will land.
          Drag into a section’s block list to nest it. With a grip focused,
          press Space, use arrow keys to choose a position, then Enter to drop.
          Escape cancels.
        </p>
        <BlockList
          drag={drag}
          blocks={page.content}
          selected={selected}
          renderProperties={(block) => (
            <section
              className="property-panel"
              id={`properties-${block.id}`}
              aria-labelledby={`properties-heading-${block.id}`}
            >
              <h4 id={`properties-heading-${block.id}`}>Block properties</h4>
              <p className="small">Editing: {blockLabel(block)}</p>
              <BundleFields
                key={block.id}
                block={block}
                onChange={actions.changeBlock}
              />
            </section>
          )}
          select={actions.selectBlock}
          move={actions.reorder}
          remove={actions.remove}
        />
        {!current && (
          <p className="small">Select a block to edit its properties.</p>
        )}
      </fieldset>
    </div>
  );
}
