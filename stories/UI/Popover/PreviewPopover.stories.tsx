import type { Meta, StoryObj } from "@storybook/react-vite";
import { PreviewPopover } from "../../../src/components/UI/Popover/PreviewPopover";
const meta = {
  title: "UI/Popover/PreviewPopover",
  component: PreviewPopover,
  parameters: {
    componentPath: "src/components/UI/Popover/PreviewPopover.tsx",
  },
  args: {
    title: "About this example",
    slots: {
      trigger: (
        <button className="button button-secondary">Inspect the example</button>
      ),
      body: <p>A reusable source preview.</p>,
      footer: <p className="small">Independent fictional example.</p>,
    },
  },
} satisfies Meta<typeof PreviewPopover>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
