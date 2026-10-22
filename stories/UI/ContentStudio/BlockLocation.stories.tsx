import type { Meta, StoryObj } from "@storybook/react-vite";
import { useContentEditor } from "../../../src/hooks/useContentEditor";
import { BlockLocation } from "../../../src/components/UI/ContentStudio/BlockLocation";
function Example() {
  const editor = useContentEditor();
  return (
    <div className="author-pane">
      <BlockLocation
        block={editor.current ?? editor.page.content[0]}
        editor={editor}
      />
    </div>
  );
}
const meta = {
  title: "UI/ContentStudio/BlockLocation",
  parameters: {
    componentPath: "src/components/UI/ContentStudio/BlockLocation.tsx",
    docs: {
      description: {
        component:
          "BlockLocation with the real editor state and working controls.",
      },
    },
  },
  render: () => <Example />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
