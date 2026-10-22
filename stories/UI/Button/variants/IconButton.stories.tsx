import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton } from "../../../../src/components/UI/Button/variants/IconButton";
import { Icon } from "../../../../src/components/UI/Icon/Icon";
const meta = {
  title: "UI/Button/IconButton",
  component: IconButton,
  parameters: {
    componentPath: "src/components/UI/Button/variants/IconButton.tsx",
  },
  args: { label: "Add a note", size: "default", children: <Icon type="add" /> },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Small: Story = { args: { size: "small" } };
export const Large: Story = { args: { size: "large" } };
export const Disabled: Story = { args: { disabled: true } };

export const Filled: Story = { args: { variant: "primary" } };
