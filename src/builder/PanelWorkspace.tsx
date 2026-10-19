import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ResizableSplit } from "../components/ResizableSplit";
import { WorkspaceIcon } from "../components/WorkspaceIcon";
import type { WorkspaceLayout } from "./workspaceLayout";

type Props = {
  mobile: boolean;
  composeOpen: boolean;
  onCloseCompose: () => void;
  compose: ReactNode;
  composeFeedback: ReactNode;
  inspect: ReactNode;
  preview: ReactNode;
  value: WorkspaceLayout;
  onChange: (patch: Partial<WorkspaceLayout>) => void;
};
export function PanelWorkspace({
  mobile,
  composeOpen,
  onCloseCompose,
  compose,
  composeFeedback,
  inspect,
  preview,
  value,
  onChange,
}: Props) {
  const { collapsed, layout, composeWidth, inspectWidth, previewHeight } =
    value;
  const collapseButton = useRef<HTMLButtonElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  const restoreComposeFocus = useRef(false);
  useLayoutEffect(() => {
    if (!restoreComposeFocus.current) return;
    restoreComposeFocus.current = false;
    (collapsed ? expandButton : collapseButton).current?.focus({
      preventScroll: true,
    });
  }, [collapsed]);
  function toggleCompose() {
    restoreComposeFocus.current = true;
    onChange({ collapsed: !collapsed });
  }
  const workspace = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(() => window.innerWidth <= 650);
  useEffect(() => {
    if (!workspace.current) return;
    const observer = new ResizeObserver(([entry]) =>
      setNarrow(entry.contentRect.width <= 600),
    );
    observer.observe(workspace.current);
    return () => observer.disconnect();
  }, []);
  const stacked = mobile || layout === "stacked" || narrow;
  const layoutAction = stacked
    ? "Show panels side by side"
    : "Stack preview above JSON";
  const layoutTooltip = narrow
    ? "Preview above JSON · A wider workspace enables side by side"
    : stacked
      ? "Preview above JSON · Show side by side"
      : "Side by side · Stack preview above JSON";
  const composeDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = composeDialog.current;
    if (!mobile || !composeOpen || !dialog) return;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [mobile, composeOpen]);
  const composePanel = (
    <div className="compose-pane-shell" id="compose-panel">
      <div className="workspace-pane-header">
        <h3 id="compose-heading">
          <span>01</span> Compose
        </h3>
        <button
          type="button"
          ref={collapseButton}
          className="workspace-icon-button"
          aria-label={mobile ? "Close Compose" : "Collapse Compose"}
          aria-expanded={mobile ? undefined : true}
          aria-controls="compose-panel"
          title={mobile ? "Close Compose" : "Collapse Compose"}
          data-tooltip={mobile ? "Close Compose" : "Collapse Compose"}
          onClick={mobile ? onCloseCompose : toggleCompose}
        >
          <WorkspaceIcon name={mobile ? "close" : "collapse"} />
        </button>
      </div>
      <div className="workspace-panel">{compose}</div>
      {mobile && composeFeedback}
    </div>
  );
  const outputPanel = (
    <div className="workspace-output">
      <div className="workspace-pane-header workspace-output-header">
        <span className="workspace-output-title">Output</span>
        <button
          type="button"
          className="workspace-icon-button"
          aria-label={layoutAction}
          title={layoutTooltip}
          data-tooltip={layoutTooltip}
          data-layout={stacked ? "stacked" : "side"}
          disabled={narrow}
          onClick={() =>
            onChange({ layout: layout === "side" ? "stacked" : "side" })
          }
        >
          <WorkspaceIcon name={stacked ? "rows" : "columns"} />
        </button>
      </div>
      <ResizableSplit
        className="output-split"
        axis={stacked ? "y" : "x"}
        reverse={stacked}
        value={stacked ? previewHeight : inspectWidth}
        onChange={(value) =>
          onChange(stacked ? { previewHeight: value } : { inspectWidth: value })
        }
        initial={stacked ? 48 : 50}
        label="Resize Inspect and Preview"
        first={
          <div className="workspace-panel workspace-inspect">{inspect}</div>
        }
        second={
          <div className="workspace-panel workspace-preview">{preview}</div>
        }
      />
    </div>
  );
  return (
    <div
      ref={workspace}
      className={`builder-grid panel-workspace${mobile ? " mobile-workspace" : ""}`}
      role="region"
      aria-label="Content studio workspace"
      tabIndex={0}
    >
      <p id="workspace-layout-help" className="sr-only">
        Drag dividers to resize. Use arrow keys on a focused divider or Enter to
        reset. Stacked view places the mobile preview above JSON.
      </p>
      {mobile ? (
        <>
          {outputPanel}
          <dialog
            id="mobile-compose"
            ref={composeDialog}
            className="compose-dialog"
            aria-labelledby="compose-heading"
            onCancel={onCloseCompose}
            onClose={onCloseCompose}
            onKeyDown={(event) => {
              if (event.key !== "Tab") return;
              const controls = Array.from(
                event.currentTarget.querySelectorAll<HTMLElement>(
                  'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]',
                ),
              ).filter((element) => element.getClientRects().length > 0);
              const first = controls[0];
              const last = controls.at(-1);
              if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
              } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
              }
            }}
            onClick={(event) => {
              if (event.target === event.currentTarget) onCloseCompose();
            }}
          >
            {composePanel}
          </dialog>
        </>
      ) : (
        <ResizableSplit
          className="compose-split"
          axis="x"
          value={composeWidth}
          onChange={(composeWidth) => onChange({ composeWidth })}
          min={26}
          max={46}
          initial={34}
          label="Resize Compose"
          firstCollapsed={collapsed}
          collapsedFirst={
            <button
              ref={expandButton}
              className="compose-rail"
              type="button"
              aria-label="Show Compose"
              aria-expanded="false"
              aria-controls="compose-panel"
              title="Show Compose"
              onClick={toggleCompose}
            >
              <span className="compose-rail-content">
                <WorkspaceIcon name="expand" />
                <span>Compose</span>
              </span>
            </button>
          }
          first={composePanel}
          second={outputPanel}
        />
      )}
    </div>
  );
}
