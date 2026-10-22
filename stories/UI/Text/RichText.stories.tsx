import type { Meta, StoryObj } from "@storybook/react-vite";
import { RichText } from "../../../src/components/UI/Text/RichText";
const meta = {
  title: "UI/Text/RichText",
  component: RichText,
  parameters: { componentPath: "src/components/UI/Text/RichText.tsx" },
  args: {
    text: "Write **one observation**, follow a [safe link](https://example.com), and add a citation.<sup>1</sup>",
  },
} satisfies Meta<typeof RichText>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
