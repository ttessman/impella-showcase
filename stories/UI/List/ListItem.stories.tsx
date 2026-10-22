import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListItem } from "../../../src/components/UI/List/ListItem";
const meta = {
  title: "UI/List/ListItem",
  component: ListItem,
  parameters: { componentPath: "src/components/UI/List/ListItem.tsx" },
  args: { as: "div", children: "An individual list entry" },
} satisfies Meta<typeof ListItem>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
