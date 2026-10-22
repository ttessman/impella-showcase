import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { useState } from "react";
import { SectionDropdown } from "../../../../src/components/UI/Popover/variants/SectionDropdown";
import { sections } from "../../../support/fixtures";
type ExampleArgs = Omit<
  ComponentProps<typeof SectionDropdown>,
  "open" | "onOpenChange"
>;
function Example(args: ExampleArgs) {
  const [open, onOpenChange] = useState(false);
  return <SectionDropdown {...args} open={open} onOpenChange={onOpenChange} />;
}
const meta = {
  title: "UI/Popover/Dropdown/SectionDropdown",
  component: Example,
  parameters: {
    componentPath: "src/components/UI/Popover/variants/SectionDropdown.tsx",
  },
  args: { label: "Sections", sections, activeId: "composition" },
  render: (args) => <Example {...args} />,
} satisfies Meta<ExampleArgs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
