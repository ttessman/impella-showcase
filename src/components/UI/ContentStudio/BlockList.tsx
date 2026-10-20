import { Icon } from "../Icon/Icon";
import type { ReactNode } from "react";
import { blockLabel } from "../../../utils/studio";
import { bundles } from "./PageComposer";
import type { StudioBundle } from "../../../utils/studio";
import { targetKey } from "../../../hooks/useBlockDrag";
import type { BlockDrag } from "../../../hooks/useBlockDrag";
import type { DropTarget } from "../../../utils/studio";
type Props = {
  blocks: StudioBundle[];
  drag: BlockDrag;
  parentId?: string | null;
  blocked?: boolean;
  parentLabel?: string;
  selected: string | null;
  renderProperties: (block: StudioBundle) => ReactNode;
  select: (id: string) => void;
  move: (id: string, delta: number) => void;
  remove: (id: string) => void;
};
export function BlockList({
  blocks,
  selected,
  renderProperties,
  select,
  move,
  remove,
  drag,
  parentId = null,
  parentLabel = "page root",
  blocked = false,
}: Props) {
  const disabled = !!drag.drag && parentId === drag.drag.id;
  function dropZone(beforeId: string | null, label: string) {
    const target: DropTarget = { parentId, beforeId };
    const invalid =
      blocked || disabled || (!!drag.drag && beforeId === drag.drag.id);
    const active =
      !!drag.drag?.target && targetKey(drag.drag.target) === targetKey(target);
    return (
      <div
        aria-hidden="true"
        data-drop-target=""
        data-parent-id={parentId ?? ""}
        data-before-id={beforeId ?? ""}
        data-drop-label={label}
        data-drop-disabled={invalid || undefined}
        className={`drop-zone ${active ? "drop-active" : ""} ${invalid ? "drop-disabled" : ""}`}
      />
    );
  }
  return (
    <ol
      className={`block-list ${drag.drag ? "is-dragging" : ""}`}
      data-drop-container=""
      data-parent-id={parentId ?? ""}
      aria-label={parentId ? `Blocks in ${parentLabel}` : "Page blocks"}
    >
      {blocks.map((block, index) => {
        const label = blockLabel(block),
          kind = bundles.find((b) => b.value === block.bundle)!.label;
        return (
          <li key={block.id} data-block-id={block.id}>
            {dropZone(block.id, `Before ${label} in ${parentLabel}`)}
            <div
              data-drag-row=""
              data-block-id={block.id}
              data-parent-id={parentId ?? ""}
              data-next-id={blocks[index + 1]?.id ?? ""}
              className={`block-row ${selected === block.id ? "selected" : ""}`}
            >
              <button
                type="button"
                className="drag-handle"
                data-drag-handle={block.id}
                aria-label={`Drag ${kind} ${label}`}
                aria-describedby="drag-help"
                aria-pressed={drag.drag?.id === block.id}
                {...drag.handle(block.id, `${kind}: ${label}`)}
              >
                <Icon type="grip" />
              </button>
              <button
                className="block-select"
                type="button"
                onClick={() => select(block.id)}
                aria-pressed={selected === block.id}
                aria-expanded={selected === block.id}
                aria-controls={
                  selected === block.id ? `properties-${block.id}` : undefined
                }
                aria-label={`Edit ${kind}: ${label}`}
              >
                <span className="block-kind">{kind}</span>
                <span className="block-name">{label}</span>
              </button>
              <div className="row-actions">
                <button
                  type="button"
                  disabled={index === 0}
                  aria-label={`Move ${kind} ${label} up`}
                  onClick={() => move(block.id, -1)}
                >
                  <Icon type="up" />
                </button>
                <button
                  type="button"
                  disabled={index === blocks.length - 1}
                  aria-label={`Move ${kind} ${label} down`}
                  onClick={() => move(block.id, 1)}
                >
                  <Icon type="down" />
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${kind} ${label}`}
                  onClick={() => remove(block.id)}
                >
                  <Icon type="remove" />
                </button>
              </div>
            </div>
            {selected === block.id && renderProperties(block)}
            {block.bundle === "section" && (
              <BlockList
                blocks={block.content}
                drag={drag}
                parentId={block.id}
                blocked={blocked || drag.drag?.id === block.id}
                parentLabel={label}
                selected={selected}
                renderProperties={renderProperties}
                select={select}
                move={move}
                remove={remove}
              />
            )}
          </li>
        );
      })}
      <li
        className={`drop-end ${blocks.length === 0 ? "empty-container" : ""}`}
      >
        {blocks.length === 0 && (
          <span className="empty-container-label">
            {parentId ? "Drop blocks inside this section" : "Drop blocks here"}
          </span>
        )}
        {dropZone(null, `Move to end of ${parentLabel}`)}
      </li>
    </ol>
  );
}
