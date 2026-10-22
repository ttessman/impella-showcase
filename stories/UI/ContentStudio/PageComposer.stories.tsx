import type { Meta, StoryObj } from "@storybook/react-vite";
import { useContentEditor } from "../../../src/hooks/useContentEditor";
import { PageComposer } from "../../../src/components/UI/ContentStudio/PageComposer";
function Example() {
  const editor = useContentEditor();
  return <PageComposer editor={editor} />;
}
const meta = {
  title: "UI/ContentStudio/PageComposer",
  parameters: {
    componentPath: "src/components/UI/ContentStudio/PageComposer.tsx",
    docs: {
      description: {
        component:
          "PageComposer with the real editor state and working controls.",
      },
    },
  },
  render: () => <Example />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
