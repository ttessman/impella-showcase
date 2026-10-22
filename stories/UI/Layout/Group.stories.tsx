import type { Meta, StoryObj } from "@storybook/react-vite";
import { Group } from "../../../src/components/UI/Layout/Group";
const meta = {
  title: "UI/Layout/Group",
  component: Group,
  parameters: { componentPath: "src/components/UI/Layout/Group.tsx" },
  args: {
    children: (
      <>
        <p>First observation.</p>
        <p>A second idea.</p>
      </>
    ),
  },
} satisfies Meta<typeof Group>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
