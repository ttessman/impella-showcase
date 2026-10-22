import type { Meta, StoryObj } from "@storybook/react-vite";
import { StudioIsland } from "../../../src/components/UI/ContentStudio/StudioIsland";
const meta = {
  title: "UI/ContentStudio/StudioIsland",
  component: StudioIsland,
  parameters: {
    componentPath: "src/components/UI/ContentStudio/StudioIsland.tsx",
  },
  args: { fallback: <p>Enable JavaScript for the interactive journal.</p> },
} satisfies Meta<typeof StudioIsland>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
