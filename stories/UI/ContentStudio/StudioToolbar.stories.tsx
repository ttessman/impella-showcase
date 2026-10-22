import type { Meta, StoryObj } from "@storybook/react-vite";
import { useContentEditor } from "../../../src/hooks/useContentEditor";
import { useWorkspaceLayout } from "../../../src/hooks/useWorkspaceLayout";
import { StudioToolbar } from "../../../src/components/UI/ContentStudio/StudioToolbar";
function Example() {
  const editor = useContentEditor();
  const layout = useWorkspaceLayout({
    active: !!editor.drag.drag,
    cancel: editor.drag.cancel,
  });
  return <StudioToolbar editor={editor} layout={layout} />;
}
const meta = {
  title: "UI/ContentStudio/StudioToolbar",
  parameters: {
    componentPath: "src/components/UI/ContentStudio/StudioToolbar.tsx",
    docs: {
      description: {
        component:
          "StudioToolbar with the real editor state and working controls.",
      },
    },
  },
  render: () => <Example />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
