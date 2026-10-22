import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { useState } from "react";
import { Dropdown } from "../../../src/components/UI/Popover/Dropdown";
type ExampleArgs = Omit<
  ComponentProps<typeof Dropdown>,
  "open" | "onOpenChange"
>;
function Example(args: ExampleArgs) {
  const [open, onOpenChange] = useState(false);
  return <Dropdown {...args} open={open} onOpenChange={onOpenChange} />;
}
const meta = {
  title: "UI/Popover/Dropdown",
  component: Example,
  parameters: { componentPath: "src/components/UI/Popover/Dropdown.tsx" },
  args: {
    label: "Journal menu",
    trigger: <button className="button button-secondary">Open menu</button>,
    children: (
      <>
        <button data-dropdown-item>Observe</button>
        <button data-dropdown-item>Reflect</button>
      </>
    ),
  },
  render: (args) => <Example {...args} />,
} satisfies Meta<ExampleArgs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
