import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading } from "../../../src/components/UI/Heading/Heading";
const meta = {
  title: "UI/Heading",
  component: Heading,
  parameters: { componentPath: "src/components/UI/Heading/Heading.tsx" },
  args: { level: 2, children: "Small observations. New ideas." },
} satisfies Meta<typeof Heading>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
