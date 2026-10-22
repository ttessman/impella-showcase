import type { Meta, StoryObj } from "@storybook/react-vite";
import { MobilePreview } from "../../../src/components/UI/ContentStudio/MobilePreview";
import { studioPage } from "../../support/fixtures";
const meta = {
  title: "UI/ContentStudio/MobilePreview",
  component: MobilePreview,
  parameters: {
    componentPath: "src/components/UI/ContentStudio/MobilePreview.tsx",
  },
  args: { page: studioPage, compact: false },
} satisfies Meta<typeof MobilePreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
