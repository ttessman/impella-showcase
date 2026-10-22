import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlockText } from "../../../../src/components/UI/Text/variants/BlockText";
const meta = {
  title: "UI/Text/BlockText",
  component: BlockText,
  parameters: {
    componentPath: "src/components/UI/Text/variants/BlockText.tsx",
  },
  args: {
    children: "Collect a color, sketch a shape, and notice something new.",
    variant: "section-intro",
  },
} satisfies Meta<typeof BlockText>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
