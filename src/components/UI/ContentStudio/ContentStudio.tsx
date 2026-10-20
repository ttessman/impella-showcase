import { useContentEditor } from "../../../hooks/useContentEditor";
import { useWorkspaceLayout } from "../../../hooks/useWorkspaceLayout";
import { ContentStudioLayout } from "./ContentStudioLayout";
import { StudioToolbar } from "./StudioToolbar";
import { PageComposer } from "./PageComposer";
import { JsonInspector } from "./JsonInspector";
import { MobilePreview } from "./MobilePreview";
import { EditorFeedback } from "./EditorFeedback";

export default function ContentStudio({
  "data-bundle-name": bundleName,
}: {
  "data-bundle-name"?: string;
}) {
  const editor = useContentEditor();
  const layout = useWorkspaceLayout({
    active: editor.drag.drag !== null,
    cancel: editor.drag.cancel,
  });
  return (
    <ContentStudioLayout
      data-bundle-name={bundleName}
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
          <EditorFeedback
            error={editor.error}
            message={editor.message}
            tone={editor.validationTone}
          />
        ),
      }}
    />
  );
}
