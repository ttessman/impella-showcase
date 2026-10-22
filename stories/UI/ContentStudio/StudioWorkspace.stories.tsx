import type { Meta, StoryObj } from "@storybook/react-vite";
import { useContentEditor } from "../../../src/hooks/useContentEditor";
import { useWorkspaceLayout } from "../../../src/hooks/useWorkspaceLayout";
import { JsonInspector } from "../../../src/components/UI/ContentStudio/JsonInspector";
import { PageComposer } from "../../../src/components/UI/ContentStudio/PageComposer";
import { StudioWorkspace } from "../../../src/components/UI/ContentStudio/StudioWorkspace";
import { EditorFeedback } from "../../../src/components/UI/ContentStudio/EditorFeedback";
import { MobilePreview } from "../../../src/components/UI/ContentStudio/MobilePreview";
function Example() {
  const editor = useContentEditor();
  const layout = useWorkspaceLayout({
    active: !!editor.drag.drag,
    cancel: editor.drag.cancel,
  });
  return (
    <div className="playground" style={{ height: 720 }}>
      <StudioWorkspace
        layout={layout}
        slots={{
          toolbar: null,
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
    </div>
  );
}
const meta = {
  title: "UI/ContentStudio/StudioWorkspace",
  parameters: {
    componentPath: "src/components/UI/ContentStudio/StudioWorkspace.tsx",
    docs: {
      description: {
        component:
          "StudioWorkspace with the real editor state and working controls.",
      },
    },
  },
  render: () => <Example />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
