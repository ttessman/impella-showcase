import { useContentEditor } from "./hooks/useContentEditor";
import { useWorkspaceLayout } from "./hooks/useWorkspaceLayout";
import { ContentStudioLayout } from "./components/ContentStudioLayout/ContentStudioLayout";
import { StudioToolbar } from "./components/StudioToolbar/StudioToolbar";
import { PageComposer } from "./components/PageComposer/PageComposer";
import { JsonInspector } from "./components/JsonInspector/JsonInspector";
import { MobilePreview } from "./components/MobilePreview/MobilePreview";
import { EditorFeedback } from "./components/EditorFeedback/EditorFeedback";

export default function ContentStudio() {
  const editor = useContentEditor();
  const layout = useWorkspaceLayout({
    active: editor.drag.drag !== null,
    cancel: editor.drag.cancel,
  });
  return (
    <ContentStudioLayout
      layout={layout}
      slots={{
        toolbar: <StudioToolbar editor={editor} layout={layout} />,
        compose: <PageComposer editor={editor} />,
        inspect: <JsonInspector editor={editor} />,
        preview: (
          <MobilePreview
            page={editor.page}
            compact={layout.value.layout === "stacked"}
          />
        ),
        feedback: (
          <EditorFeedback error={editor.error} message={editor.message} />
        ),
      }}
    />
  );
}
