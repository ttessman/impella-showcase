import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip } from "../../../src/components/UI/Tooltip/Tooltip";
const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  parameters: { componentPath: "src/components/UI/Tooltip/Tooltip.tsx" },
  args: {
    label: "Add a journal note",
    children: (
      <button className="button button-secondary">Hover or focus</button>
    ),
  },
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
