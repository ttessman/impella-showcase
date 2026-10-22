import type { Meta, StoryObj } from "@storybook/react-vite";
import { SourceCodePreview } from "../../../src/components/UI/Popover/SourceCodePreview";
import { source } from "../../support/fixtures";
const meta = {
  title: "UI/Popover/PreviewPopover/SourceReference/CodePreview",
  component: SourceCodePreview,
  parameters: {
    componentPath: "src/components/UI/Popover/SourceCodePreview.tsx",
  },
  args: { source },
} satisfies Meta<typeof SourceCodePreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
