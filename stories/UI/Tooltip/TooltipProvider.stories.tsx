import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip } from "../../../src/components/UI/Tooltip/Tooltip";
import { TooltipProvider } from "../../../src/components/UI/Tooltip/TooltipProvider";
const meta = {
  title: "UI/Tooltip/TooltipProvider",
  component: TooltipProvider,
  parameters: {
    componentPath: "src/components/UI/Tooltip/TooltipProvider.tsx",
  },
  args: {
    delayDuration: 250,
    children: (
      <Tooltip label="Provider-backed tooltip">
        <button className="button button-secondary">Hover or focus</button>
      </Tooltip>
    ),
  },
} satisfies Meta<typeof TooltipProvider>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
