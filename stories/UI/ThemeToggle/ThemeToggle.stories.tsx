import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeToggle } from "../../../src/components/UI/ThemeToggle/ThemeToggle";
const meta = {
  title: "UI/ThemeToggle",
  component: ThemeToggle,
  parameters: {
    componentPath: "src/components/UI/ThemeToggle/ThemeToggle.tsx",
  },
  args: {},
} satisfies Meta<typeof ThemeToggle>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
