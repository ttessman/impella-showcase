import type { Meta, StoryObj } from "@storybook/react-vite";
import ContentStudio from "../../../src/components/UI/ContentStudio/ContentStudio";
const meta = {
  title: "UI/ContentStudio",
  component: ContentStudio,
  parameters: {
    componentPath: "src/components/UI/ContentStudio/ContentStudio.tsx",
  },
  args: {},
} satisfies Meta<typeof ContentStudio>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
