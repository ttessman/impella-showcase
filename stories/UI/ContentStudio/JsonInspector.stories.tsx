import type { Meta, StoryObj } from "@storybook/react-vite";
import { useContentEditor } from "../../../src/hooks/useContentEditor";
import { JsonInspector } from "../../../src/components/UI/ContentStudio/JsonInspector";
function Example() {
  const editor = useContentEditor();
  return (
    <div style={{ height: 540 }}>
      <JsonInspector editor={editor} />
    </div>
  );
}
const meta = {
  title: "UI/ContentStudio/JsonInspector",
  parameters: {
    componentPath: "src/components/UI/ContentStudio/JsonInspector.tsx",
    docs: {
      description: {
        component:
          "JsonInspector with the real editor state and working controls.",
      },
    },
  },
  render: () => <Example />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
