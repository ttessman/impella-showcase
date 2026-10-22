import type { Meta, StoryObj } from "@storybook/react-vite";
import { useContentEditor } from "../../../src/hooks/useContentEditor";
import { BundleFields } from "../../../src/components/UI/ContentStudio/BundleFields";
import { BlockList } from "../../../src/components/UI/ContentStudio/BlockList";
function Example() {
  const editor = useContentEditor();
  return (
    <BlockList
      blocks={editor.page.content}
      drag={editor.drag}
      selected={editor.selected}
      select={editor.actions.selectBlock}
      move={editor.actions.reorder}
      remove={editor.actions.remove}
      renderProperties={(block) => (
        <div className="author-pane property-panel">
          <BundleFields block={block} onChange={editor.actions.changeBlock} />
        </div>
      )}
    />
  );
}
const meta = {
  title: "UI/ContentStudio/BlockList",
  parameters: {
    componentPath: "src/components/UI/ContentStudio/BlockList.tsx",
    docs: {
      description: {
        component: "BlockList with the real editor state and working controls.",
      },
    },
  },
  render: () => <Example />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
