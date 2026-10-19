import { WorkspaceIcon } from "../../../../components/icons/WorkspaceIcon/WorkspaceIcon";
import type { ContentEditor } from "../../hooks/useContentEditor";
import type { StudioLayout } from "../../hooks/useWorkspaceLayout";

export function StudioToolbar({
  editor,
  layout,
}: {
  editor: ContentEditor;
  layout: StudioLayout;
}) {
  const { mobile, composeOpen } = layout;
  return (
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
            onClick={layout.openCompose}
          >
            <WorkspaceIcon name="compose" />
            <span className="action-label">Compose</span>
          </button>
        )}
        <button
          type="button"
          aria-label="Reset layout"
          title="Reset layout"
          onClick={layout.reset}
        >
          <WorkspaceIcon name="reset-layout" />
          <span className="action-label">Reset layout</span>
        </button>
        <button
          type="button"
          aria-label="Reset example"
          title="Reset example"
          onClick={editor.actions.reset}
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
  );
}
