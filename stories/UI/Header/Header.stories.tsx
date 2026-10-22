import type { Meta, StoryObj } from "@storybook/react-vite";
import { Header } from "../../../src/components/UI/Header/Header";
const meta = {
  title: "UI/Header",
  component: Header,
  parameters: { componentPath: "src/components/UI/Header/Header.tsx" },
  args: { children: "Field journal header" },
} satisfies Meta<typeof Header>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
