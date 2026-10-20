import { IconButton } from "../Button/variants/IconButton";
import { useElementSize } from "../../../hooks/useElementSize";
import { Dialog } from "../Dialog/Dialog";
import { useLayoutEffect, useRef } from "react";
import type { ContentStudioSlots } from "./ContentStudioLayout";
import type { StudioLayout } from "../../../hooks/useWorkspaceLayout";
import { ResizableSplit } from "../Layout/ResizableSplit";
import { Icon } from "../Icon/Icon";

type Props = { layout: StudioLayout; slots: ContentStudioSlots };
export function StudioWorkspace({ layout: controller, slots }: Props) {
  const {
    mobile,
    composeOpen,
    closeCompose: onCloseCompose,
    value,
    change: changeLayout,
  } = controller;
  const { compose, inspect, preview, feedback: composeFeedback } = slots;
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
  const scrollPositions = useRef<
    { element: HTMLElement; top: number; left: number }[]
  >([]);
  function onChange(patch: Parameters<typeof changeLayout>[0]) {
    scrollPositions.current = Array.from(
      workspace.current?.querySelectorAll<HTMLElement>(
        "[data-editor-scroll], .preview-content",
      ) ?? [],
    ).map((element) => ({
      element,
      top: element.scrollTop,
      left: element.scrollLeft,
    }));
    changeLayout(patch);
  }
  useLayoutEffect(() => {
    const positions = scrollPositions.current;
    const restore = () => {
      for (const { element, top, left } of positions) {
        if (!element.isConnected) continue;
        element.scrollTop = top;
        element.scrollLeft = left;
      }
    };
    restore();
    const frame = requestAnimationFrame(restore);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const size = useElementSize(workspace);
  const outputWidth =
    size.width > 0
      ? collapsed
        ? size.width - 48
        : (size.width - 12) * (1 - composeWidth / 100)
      : window.innerWidth;
  const narrow = outputWidth <= 600;
  const stacked = mobile || layout === "stacked" || narrow;
  const layoutAction = stacked
    ? "Show panels side by side"
    : "Stack preview above JSON";
  const layoutTooltip = narrow
    ? "Preview above JSON · A wider workspace enables side by side"
    : stacked
      ? "Preview above JSON · Show side by side"
      : "Side by side · Stack preview above JSON";
  const composeHeading = (
    <h3 id="compose-heading">
      <span>01</span> Compose
    </h3>
  );
  const composeAction = (
    <IconButton
      size="small"
      type="button"
      ref={collapseButton}

      label={mobile ? "Close Compose" : "Collapse Compose"}
      aria-expanded={mobile ? undefined : true}
      aria-controls="compose-panel"
      title={mobile ? undefined : "Collapse Compose"}
      tooltip={mobile ? "Close Compose" : "Collapse Compose"}
      onClick={mobile ? onCloseCompose : toggleCompose}
    >
      <Icon type={mobile ? "close" : "collapse"} />
    </IconButton>
  );
  const composePanel = (
    <div className="compose-pane-shell" id="compose-panel">
      <div className="workspace-pane-header">
        {composeHeading}
        {composeAction}
      </div>
      <div
        className="workspace-panel"
        data-editor-scroll
        role="region"
        aria-label="Compose content"
        tabIndex={0}
      >
        {compose}
      </div>
    </div>
  );
  const outputPanel = (
    <div className="workspace-output">
      <div className="workspace-pane-header workspace-output-header">
        <span className="workspace-output-title">Output</span>
        <IconButton
          size="small"
          type="button"

          label={layoutAction}
          title={layoutTooltip}
          tooltip={layoutTooltip}
          data-layout={stacked ? "stacked" : "side"}
          disabled={narrow}
          onClick={() =>
            onChange({ layout: layout === "side" ? "stacked" : "side" })
          }
        >
          <Icon type={stacked ? "rows" : "columns"} />
        </IconButton>
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
          <Dialog
            id="mobile-compose"
            size="small"
            variant="workspace"
            onEscapeKeyDown={controller.escapeCompose}
            className="compose-dialog"
            state={{
              open: composeOpen,
              onOpenChange: (open) => {
                if (!open) onCloseCompose();
              },
            }}
            definition={{ title: "01 Compose" }}
            slots={{
              header: composeHeading,
              actions: composeAction,
              body: (
                <>
                  {composeFeedback}
                  <div
                    id="compose-panel"
                    className="workspace-panel"
                    data-editor-scroll
                  >
                    {compose}
                  </div>
                </>
              ),
            }}
          />
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
                <Icon type="expand" />
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
