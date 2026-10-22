import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImageDialogTrigger } from "../../../../src/components/UI/Dialog/variants/ImageDialogTrigger";
import { image } from "../../../support/fixtures";
const meta = {
  title: "UI/Dialog/ImageDialog/Trigger",
  component: ImageDialogTrigger,
  parameters: {
    componentPath: "src/components/UI/Dialog/variants/ImageDialogTrigger.tsx",
  },
  args: {
    image,
    title: "Field journal",
    closeLabel: "Close image",
    children: "View illustration",
    className: "button button-secondary",
  },
} satisfies Meta<typeof ImageDialogTrigger>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
