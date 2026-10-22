import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { useState } from "react";
import { ResizableSplit } from "../../../src/components/UI/Layout/ResizableSplit";
type ExampleArgs = Omit<
  ComponentProps<typeof ResizableSplit>,
  "value" | "onChange"
>;
function Example(args: ExampleArgs) {
  const [value, setValue] = useState(50);
  return (
    <div style={{ height: 360 }}>
      <ResizableSplit {...args} value={value} onChange={setValue} />
    </div>
  );
}
const meta = {
  title: "UI/Layout/ResizableSplit",
  component: Example,
  parameters: { componentPath: "src/components/UI/Layout/ResizableSplit.tsx" },
  args: {
    axis: "x",
    label: "Resize example panels",
    className: "example-split",
    first: <p>First pane</p>,
    second: <p>Second pane</p>,
  },
  render: (args) => <Example {...args} />,
} satisfies Meta<ExampleArgs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
