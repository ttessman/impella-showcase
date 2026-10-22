import type { Meta, StoryObj } from "@storybook/react-vite";
import { useContentEditor } from "../../../src/hooks/useContentEditor";
import { useWorkspaceLayout } from "../../../src/hooks/useWorkspaceLayout";
import { JsonInspector } from "../../../src/components/UI/ContentStudio/JsonInspector";
import { StudioToolbar } from "../../../src/components/UI/ContentStudio/StudioToolbar";
import { PageComposer } from "../../../src/components/UI/ContentStudio/PageComposer";
import { ContentStudioLayout } from "../../../src/components/UI/ContentStudio/ContentStudioLayout";
import { EditorFeedback } from "../../../src/components/UI/ContentStudio/EditorFeedback";
import { MobilePreview } from "../../../src/components/UI/ContentStudio/MobilePreview";
function Example() {
  const editor = useContentEditor();
  const layout = useWorkspaceLayout({
    active: !!editor.drag.drag,
    cancel: editor.drag.cancel,
  });
  return (
    <ContentStudioLayout
      layout={layout}
      slots={{
        toolbar: <StudioToolbar editor={editor} layout={layout} />,
        compose: <PageComposer editor={editor} />,
        inspect: <JsonInspector editor={editor} />,
        preview: <MobilePreview page={editor.page} compact />,
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
const meta = {
  title: "UI/ContentStudio/ContentStudioLayout",
  parameters: {
    componentPath: "src/components/UI/ContentStudio/ContentStudioLayout.tsx",
    docs: {
      description: {
        component:
          "ContentStudioLayout with the real editor state and working controls.",
      },
    },
  },
  render: () => <Example />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
