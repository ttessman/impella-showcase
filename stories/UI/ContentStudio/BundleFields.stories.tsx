import type { Meta, StoryObj } from "@storybook/react-vite";
import { useContentEditor } from "../../../src/hooks/useContentEditor";
import { BundleFields } from "../../../src/components/UI/ContentStudio/BundleFields";
function Example() {
  const editor = useContentEditor();
  return (
    <div className="author-pane">
      <BundleFields
        block={editor.current ?? editor.page.content[0]}
        onChange={editor.actions.changeBlock}
      />
    </div>
  );
}
const meta = {
  title: "UI/ContentStudio/BundleFields",
  parameters: {
    componentPath: "src/components/UI/ContentStudio/BundleFields.tsx",
    docs: {
      description: {
        component:
          "BundleFields with the real editor state and working controls.",
      },
    },
  },
  render: () => <Example />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
