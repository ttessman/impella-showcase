import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ActionDropdown } from "../../../../src/components/UI/Popover/variants/ActionDropdown";
const meta = {
  title: "UI/Popover/Dropdown/ActionDropdown",
  component: ActionDropdown,
  parameters: {
    componentPath: "src/components/UI/Popover/variants/ActionDropdown.tsx",
  },
  args: {
    label: "Journal actions",
    items: [
      { label: "Validate", icon: "validate", onSelect: fn() },
      { label: "Reset", icon: "reset", onSelect: fn() },
      { label: "Unavailable", disabled: true, onSelect: fn() },
    ],
  },
} satisfies Meta<typeof ActionDropdown>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
