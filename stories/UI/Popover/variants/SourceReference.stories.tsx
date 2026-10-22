import type { Meta, StoryObj } from "@storybook/react-vite";
import { SourceReference } from "../../../../src/components/UI/Popover/variants/SourceReference";
import { source } from "../../../support/fixtures";
const meta = {
  title: "UI/Popover/PreviewPopover/SourceReference",
  component: SourceReference,
  parameters: {
    componentPath: "src/components/UI/Popover/variants/SourceReference.tsx",
  },
  args: { source },
} satisfies Meta<typeof SourceReference>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
