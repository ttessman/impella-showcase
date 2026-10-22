import type { Meta, StoryObj } from "@storybook/react-vite";
import { List } from "../../../src/components/UI/List/List";
const meta = {
  title: "UI/List",
  component: List,
  parameters: { componentPath: "src/components/UI/List/List.tsx" },
  args: {
    ordered: true,
    items: [
      { id: "one", content: "Observe" },
      { id: "two", content: "Reflect" },
    ],
  },
} satisfies Meta<typeof List>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
