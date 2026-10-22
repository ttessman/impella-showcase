import type { ContentEditor } from "../../../hooks/useContentEditor";
import { blockParent, findBlock } from "../../../utils/studio";
import type { StudioBundle } from "../../../utils/studio";
import { Select } from "../Input/Select";

/** Reparenting is distinct from the add palette's destination. */
export function BlockLocation({
  block,
  editor,
}: {
  block: StudioBundle;
  editor: ContentEditor;
}) {
  const parentId = blockParent(editor.page.content, block.id) ?? "root";
  const destinations = editor.destinations.filter(
    ({ block: candidate }) =>
      candidate.id !== block.id &&
      !(block.bundle === "section" && findBlock(block.content, candidate.id)),
  );
  return (
    <label>
      Move to
      <Select
        aria-label="Move block to"
        value={parentId}
        onChange={(event) =>
          editor.actions.relocate(block.id, {
            parentId: event.target.value === "root" ? null : event.target.value,
            beforeId: null,
          })
        }
      >
        <option value="root">Page root</option>
        {destinations.map(({ block: section, depth }) => (
          <option key={section.id} value={section.id}>
            {"— ".repeat(depth + 1)}
            {section.metadata.label || "Untitled section"} (
            {section.id.slice(0, 8)})
          </option>
        ))}
      </Select>
    </label>
  );
}
