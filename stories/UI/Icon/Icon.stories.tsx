import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "../../../src/components/UI/Icon/Icon";
const meta = {
  title: "UI/Icon",
  component: Icon,
  parameters: { componentPath: "src/components/UI/Icon/Icon.tsx" },
  args: { type: "add", size: 24 },
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
