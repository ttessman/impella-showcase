import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChecklistDialog } from "../../../../src/components/UI/Dialog/variants/ChecklistDialog";
import { checklist } from "../../../support/fixtures";
const meta = {
  title: "UI/Dialog/ChecklistDialog",
  component: ChecklistDialog,
  parameters: {
    componentPath: "src/components/UI/Dialog/variants/ChecklistDialog.tsx",
  },
  args: { definition: checklist },
} satisfies Meta<typeof ChecklistDialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
