import type { Meta, StoryObj } from "@storybook/react-vite";
import { ReaderDialog } from "../../../../src/components/UI/Dialog/variants/ReaderDialog";
import { reader } from "../../../support/fixtures";
const meta = {
  title: "UI/Dialog/ReaderDialog",
  component: ReaderDialog,
  parameters: {
    componentPath: "src/components/UI/Dialog/variants/ReaderDialog.tsx",
  },
  args: { definition: reader },
} satisfies Meta<typeof ReaderDialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
